import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PedidoItem } from '../types/pedido';
import {
  CheckCircle2,
  AlertCircle,
  Hash,
  Settings2,
  GitFork,
  Wrench,
  Layers,
  Package,
  Eraser,
  ListPlus,
  Upload,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CsvImportModal } from './CsvImportModal';

const highlightText = (text: string, highlight: string) => {
  if (!highlight || !highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <b key={i} style={{ color: 'var(--color-primary-light, #60A5FA)' }}>{part}</b>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

/* ─── Validation Schema ──────────────────────────────────────────── */
const pedidoSchema = z.object({
  item: z.string().min(1, 'Obrigatório').max(100),
  modelo: z.string().min(1, 'Obrigatório').max(100),
  versao: z.string().min(1, 'Obrigatório').max(100),
  nomePeca: z.string().min(1, 'Obrigatório').max(200),
  gfpg: z.string().min(1, 'Obrigatório').max(100),
  quantidade: z.string().min(1, 'Obrigatório').refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    },
    { message: 'Deve ser um número maior que zero' }
  ),
});

type PedidoFormValues = z.infer<typeof pedidoSchema>;

/* ─── Component ──────────────────────────────────────────────────── */
interface PedidoFormProps {
  onAddItem: (item: PedidoItem) => void;
  onAddItems?: (items: PedidoItem[]) => void;
}

export function PedidoForm({ onAddItem, onAddItems }: PedidoFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    mode: 'onBlur',
    defaultValues: {
      item: '',
      modelo: '',
      versao: '',
      nomePeca: '',
      gfpg: '',
      quantidade: '',
    },
  });

  const [pecasList, setPecasList] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pecasPage, setPecasPage] = useState(1);
  const [hasMorePecas, setHasMorePecas] = useState(true);
  const [loadingPecas, setLoadingPecas] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastSearchedTerm = useRef<string>('');
  const nomePecaValue = watch('nomePeca');

  const lastPecaElementRef = useCallback((node: HTMLLIElement | null) => {
    if (loadingPecas) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMorePecas) {
        setPecasPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingPecas, hasMorePecas]);

  const [referenciasList, setReferenciasList] = useState<string[]>([]);
  const [isReferenciaDropdownOpen, setIsReferenciaDropdownOpen] = useState(false);
  const referenciaValue = watch('item');

  const [gfpgsList, setGfpgsList] = useState<string[]>([]);
  const [isGfpgDropdownOpen, setIsGfpgDropdownOpen] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Busca nomes de peças enquanto o usuário digita
  useEffect(() => {
    async function searchPecas() {
      if (!supabase) return;
      
      const currentTerm = nomePecaValue || '';
      if (currentTerm.trim() === '') {
        setPecasList([]);
        return;
      }

      let currentPage = pecasPage;
      if (lastSearchedTerm.current !== currentTerm) {
        setPecasPage(1);
        setHasMorePecas(true);
        currentPage = 1;
        lastSearchedTerm.current = currentTerm;
      }

      setLoadingPecas(true);
      const limit = 20;

      const { data, error } = await supabase.rpc('buscar_pecas', { 
        termo: currentTerm,
        limite: limit,
        pagina: currentPage
      });

      if (!error && data) {
        const results = data.map((p: any) => p.nome_peca).filter(Boolean);
        setPecasList(prev => currentPage === 1 ? results : [...prev, ...results]);
        setHasMorePecas(results.length >= limit);
      } else {
        if (currentPage === 1) setPecasList([]);
        setHasMorePecas(false);
      }
      setLoadingPecas(false);
    }

    const timeoutId = setTimeout(() => {
      searchPecas();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [nomePecaValue, pecasPage]);

  // Ao selecionar Nome da Peça, carrega as Referências vinculadas
  useEffect(() => {
    async function fetchReferencias() {
      if (!supabase || !nomePecaValue || nomePecaValue.trim() === '') {
        setReferenciasList([]);
        setValue('item', '', { shouldValidate: false });
        setGfpgsList([]);
        setValue('gfpg', '', { shouldValidate: false });
        setValue('modelo', '', { shouldValidate: false });
        setValue('versao', '', { shouldValidate: false });
        setIsAutoFilled(false);
        return;
      }

      const { data, error } = await supabase
        .from('pecas')
        .select('referencia')
        .eq('nome_peca', nomePecaValue);

      if (!error && data) {
        const refs = Array.from(new Set(data.map((p: any) => String(p.referencia)).filter(Boolean)));
        setReferenciasList(refs);
        // Se existir apenas uma referência, preenche automaticamente
        if (refs.length === 1) {
          setValue('item', refs[0], { shouldValidate: true });
        } else {
          setValue('item', '', { shouldValidate: false });
          if (refs.length > 1) {
            setTimeout(() => {
              document.getElementById('item')?.focus();
              setIsReferenciaDropdownOpen(true);
            }, 50);
          }
        }
        setGfpgsList([]);
        setValue('gfpg', '', { shouldValidate: false });
        setValue('modelo', '', { shouldValidate: false });
        setValue('versao', '', { shouldValidate: false });
        setIsAutoFilled(false);
      }
    }

    fetchReferencias();
  }, [nomePecaValue]);

  // Ao selecionar Referência, carrega as GFPGs vinculadas
  useEffect(() => {
    async function fetchGfpgs() {
      if (!supabase || !referenciaValue || referenciaValue.trim() === '') {
        setGfpgsList([]);
        setValue('gfpg', '', { shouldValidate: false });
        setValue('modelo', '', { shouldValidate: false });
        setValue('versao', '', { shouldValidate: false });
        setIsAutoFilled(false);
        return;
      }

      const { data, error } = await supabase
        .from('pecas')
        .select('gfpg')
        .eq('referencia', referenciaValue);

      if (!error && data) {
        const gfpgs = Array.from(new Set(data.map((p: any) => p.gfpg).filter(Boolean)));
        setGfpgsList(gfpgs);
        // Se existir apenas um GFPG, preenche automaticamente
        if (gfpgs.length === 1) {
          setValue('gfpg', gfpgs[0], { shouldValidate: true });
          const { data: autoData } = await supabase
            .from('pecas')
            .select('modelo, versao')
            .eq('referencia', referenciaValue)
            .eq('gfpg', gfpgs[0])
            .limit(1)
            .single();
          if (autoData) {
            setValue('modelo', (autoData as any).modelo ?? '', { shouldValidate: true });
            setValue('versao', (autoData as any).versao ?? '', { shouldValidate: true });
            setIsAutoFilled(true);
          } else {
            setValue('modelo', '', { shouldValidate: false });
            setValue('versao', '', { shouldValidate: false });
            setIsAutoFilled(false);
          }
        } else {
          setValue('gfpg', '', { shouldValidate: false });
          // Limpa modelo e versão ao trocar referência
          setValue('modelo', '', { shouldValidate: false });
          setValue('versao', '', { shouldValidate: false });
          setIsAutoFilled(false);
          
          if (gfpgs.length > 1) {
            setTimeout(() => {
              document.getElementById('gfpg')?.focus();
              setIsGfpgDropdownOpen(true);
            }, 50);
          }
        }
      }
    }

    fetchGfpgs();
  }, [referenciaValue]);

  const handleAddToList = () => {
    const data = getValues();
    // Basic validation before adding to list
    if (!data.item || !data.modelo || !data.versao || !data.nomePeca || !data.gfpg || !data.quantidade) {
      setSubmitStatus('error');
      setErrorMessage('Preencha todos os campos obrigatórios antes de adicionar à lista.');
      setTimeout(() => setSubmitStatus('idle'), 5000);
      return;
    }
    const qty = Number(data.quantidade);
    if (isNaN(qty) || qty <= 0) {
      setSubmitStatus('error');
      setErrorMessage('Quantidade deve ser um número maior que zero.');
      setTimeout(() => setSubmitStatus('idle'), 5000);
      return;
    }

    const newItem: PedidoItem = {
      id: crypto.randomUUID(),
      item: data.item,
      modelo: data.modelo,
      versao: data.versao,
      nomePeca: data.nomePeca,
      gfpg: data.gfpg,
      quantidade: data.quantidade,
      subtotalLcpu: Math.round(qty * (14.5 + Math.random() * 3) * 100) / 100,
    };

    onAddItem(newItem);
    reset();
  };

  return (
    <section className="card">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon">
            <Settings2 size={20} strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="card-title">Parâmetros do Pedido</h2>
            <p className="card-description">
              Preencha os campos do formulário e adicione à lista de itens para cálculo do LCPU
            </p>
          </div>
        </div>
        <button type="button" className="btn-link" onClick={() => setIsModalOpen(true)}>
          <Upload size={14} strokeWidth={1.75} />
          Importar CSV
        </button>
      </div>

      {isModalOpen && (
        <CsvImportModal
          onClose={() => setIsModalOpen(false)}
          onImport={(items) => {
            if (onAddItems) {
              onAddItems(items);
            }
          }}
        />
      )}

      {submitStatus === 'success' && (
        <div className="toast toast--success">
          <CheckCircle2 size={18} strokeWidth={1.75} />
          <span>Pedido enviado com sucesso!</span>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="toast toast--error">
          <AlertCircle size={18} strokeWidth={1.75} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          {/* Row 1: Nome da Peça + Referência */}
          <div className="form-row">
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" htmlFor="nomePeca">
                <Wrench size={14} className="form-label-icon" strokeWidth={1.75} />
                Nome da Peça
                {/* <span className="form-sublabel">Nomenclatura Técnica</span> */}
              </label>
              <input
                id="nomePeca"
                autoComplete="off"
                className={`input ${errors.nomePeca ? 'input--error' : ''}`}
                placeholder="Ex: Eixo Estriado de Transmissão Central"
                {...register('nomePeca')}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              />
              {errors.nomePeca && <span className="error-text">{errors.nomePeca.message}</span>}
              
              {isDropdownOpen && (nomePecaValue || pecasList.length > 0) && (
                <ul
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    maxHeight: '250px',
                    overflowY: 'auto',
                    backgroundColor: 'var(--color-slate-800, #1E293B)',
                    border: '1px solid var(--color-slate-700, #334155)',
                    borderRadius: '0.375rem',
                    marginTop: '0.25rem',
                    padding: '0.25rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                    listStyle: 'none',
                  }}
                >
                  {nomePecaValue && pecasList.length === 0 && !loadingPecas ? (
                    <li style={{ padding: '0.5rem 0.75rem', color: 'var(--color-slate-400, #94A3B8)', fontStyle: 'italic' }}>
                      Nenhuma peça encontrada para "{nomePecaValue}"
                    </li>
                  ) : null}
                  
                  {pecasList.map((peca, idx) => {
                    const isLast = idx === pecasList.length - 1;
                    return (
                      <li
                        key={idx}
                        ref={isLast ? lastPecaElementRef : null}
                        style={{
                          padding: '0.5rem 0.75rem',
                          cursor: 'pointer',
                          color: 'var(--color-slate-50, #F8FAFC)',
                          borderRadius: '0.25rem',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setValue('nomePeca', peca, { shouldValidate: true });
                          setIsDropdownOpen(false);
                        }}
                        onMouseOver={(e) => {
                          (e.currentTarget as HTMLLIElement).style.backgroundColor = 'var(--color-slate-700, #334155)';
                        }}
                        onMouseOut={(e) => {
                          (e.currentTarget as HTMLLIElement).style.backgroundColor = 'transparent';
                        }}
                      >
                        {highlightText(peca, nomePecaValue || '')}
                      </li>
                    );
                  })}
                  
                  {loadingPecas && (
                    <li style={{ padding: '0.5rem 0.75rem', color: 'var(--color-slate-400, #94A3B8)', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.875rem' }}>Carregando...</span>
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" htmlFor="item">
                <Hash size={14} className="form-label-icon" strokeWidth={1.75} />
                Referência
              </label>
              <input
                id="item"
                autoComplete="off"
                className={`input ${errors.item ? 'input--error' : ''}`}
                placeholder={!nomePecaValue ? "Selecione o Nome da Peça primeiro" : "Selecione a Referência"}
                {...register('item')}
                onFocus={() => setIsReferenciaDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsReferenciaDropdownOpen(false), 200)}
              />
              {errors.item && <span className="error-text">{errors.item.message}</span>}

              {isReferenciaDropdownOpen && referenciasList.length > 0 && (
                <ul
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    backgroundColor: 'var(--color-slate-800, #1E293B)',
                    border: '1px solid var(--color-slate-700, #334155)',
                    borderRadius: '0.375rem',
                    marginTop: '0.25rem',
                    padding: '0.25rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    listStyle: 'none',
                  }}
                >
                  {referenciasList.map((ref, idx) => (
                    <li
                      key={idx}
                      style={{
                        padding: '0.5rem 0.75rem',
                        cursor: 'pointer',
                        color: 'var(--color-slate-50, #F8FAFC)',
                        borderRadius: '0.25rem',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setValue('item', ref, { shouldValidate: true });
                        setIsReferenciaDropdownOpen(false);
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLLIElement).style.backgroundColor = 'var(--color-slate-700, #334155)';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLLIElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      {ref}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Row 2: GFPG + Modelo */}
          <div className="form-row">
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" htmlFor="gfpg">
                <Layers size={14} className="form-label-icon" strokeWidth={1.75} />
                GFPG
              </label>
              <input
                id="gfpg"
                autoComplete="off"
                className={`input ${errors.gfpg ? 'input--error' : ''}`}
                placeholder={!referenciaValue ? "Selecione a Referência primeiro" : "Selecione o GFPG"}
                {...register('gfpg')}
                onFocus={() => setIsGfpgDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsGfpgDropdownOpen(false), 200)}
              />
              {errors.gfpg && <span className="error-text">{errors.gfpg.message}</span>}

              {isGfpgDropdownOpen && gfpgsList.length > 0 && (
                <ul
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    backgroundColor: 'var(--color-slate-800, #1E293B)',
                    border: '1px solid var(--color-slate-700, #334155)',
                    borderRadius: '0.375rem',
                    marginTop: '0.25rem',
                    padding: '0.25rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    listStyle: 'none',
                  }}
                >
                  {gfpgsList.map((gfpg, idx) => (
                    <li
                      key={idx}
                      style={{
                        padding: '0.5rem 0.75rem',
                        cursor: 'pointer',
                        color: 'var(--color-slate-50, #F8FAFC)',
                        borderRadius: '0.25rem',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseDown={async (e) => {
                        e.preventDefault();
                        setValue('gfpg', gfpg, { shouldValidate: true });
                        setIsGfpgDropdownOpen(false);
                        // Auto-preenche Modelo e Versão a partir do Supabase
                        if (supabase) {
                          const ref = getValues('item');
                          const { data } = await supabase
                            .from('pecas')
                            .select('modelo, versao')
                            .eq('referencia', ref)
                            .eq('gfpg', gfpg)
                            .limit(1)
                            .single();
                          if (data) {
                            setValue('modelo', (data as any).modelo ?? '', { shouldValidate: true });
                            setValue('versao', (data as any).versao ?? '', { shouldValidate: true });
                            setIsAutoFilled(true);
                          }
                        }
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLLIElement).style.backgroundColor = 'var(--color-slate-700, #334155)';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLLIElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      {gfpg}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="modelo">
                <Settings2 size={14} className="form-label-icon" strokeWidth={1.75} />
                Modelo
                {isAutoFilled && (
                  <span style={{ marginLeft: '6px', fontSize: '10px', padding: '1px 6px', borderRadius: '9999px', backgroundColor: 'var(--color-amber-500, #F59E0B)', color: '#000', fontWeight: 600, letterSpacing: '0.04em' }}>AUTO</span>
                )}
              </label>
              <input
                id="modelo"
                className={`input ${errors.modelo ? 'input--error' : ''}`}
                placeholder="Preenchido ao selecionar GFPG"
                {...register('modelo')}
                readOnly={isAutoFilled}
                style={isAutoFilled ? { backgroundColor: 'rgba(0,0,0,0.15)', cursor: 'default', opacity: 0.85 } : {}}
              />
              {errors.modelo && <span className="error-text">{errors.modelo.message}</span>}
            </div>
          </div>

          {/* Row 3: Versão + Quantidade */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="versao">
                <GitFork size={14} className="form-label-icon" strokeWidth={1.75} />
                Versão
                {isAutoFilled && (
                  <span style={{ marginLeft: '6px', fontSize: '10px', padding: '1px 6px', borderRadius: '9999px', backgroundColor: 'var(--color-amber-500, #F59E0B)', color: '#000', fontWeight: 600, letterSpacing: '0.04em' }}>AUTO</span>
                )}
              </label>
              <input
                id="versao"
                className={`input ${errors.versao ? 'input--error' : ''}`}
                placeholder="Preenchido ao selecionar GFPG"
                {...register('versao')}
                readOnly={isAutoFilled}
                style={isAutoFilled ? { backgroundColor: 'rgba(0,0,0,0.15)', cursor: 'default', opacity: 0.85 } : {}}
              />
              {errors.versao && <span className="error-text">{errors.versao.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="quantidade">
                <Package size={14} className="form-label-icon" strokeWidth={1.75} />
                Quantidade
                {/* <span className="form-sublabel">Unidades</span> */}
              </label>
              <input
                id="quantidade"
                className={`input ${errors.quantidade ? 'input--error' : ''}`}
                placeholder="Ex: 100"
                type="text"
                inputMode="numeric"
                {...register('quantidade')}
              />
              {errors.quantidade && (
                <span className="error-text">{errors.quantidade.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => reset()}
          >
            <Eraser size={16} strokeWidth={1.75} />
            Limpar Campos
          </button>
          <div className="form-actions-right">
            <button
              type="button"
              className="btn btn-outline-amber"
              onClick={handleAddToList}
            >
              <ListPlus size={16} strokeWidth={1.75} />
              Adicionar à Lista de Itens
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
