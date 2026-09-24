import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../services/api';
import type { PedidoInput, PedidoItem } from '../types/pedido';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Hash,
  Settings2,
  GitFork,
  Wrench,
  Layers,
  Package,
  Key,
  RefreshCw,
  Eraser,
  ListPlus,
  Sparkles,
  Loader2,
} from 'lucide-react';

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
  chavePedido: z.string().min(1, 'Obrigatório').max(100),
});

type PedidoFormValues = z.infer<typeof pedidoSchema>;

/* ─── Example Data ───────────────────────────────────────────────── */
const EXAMPLE_DATA: PedidoFormValues = {
  item: 'IT-9604',
  modelo: 'Rotor Turbo 4500X',
  versao: 'v3.2',
  nomePeca: 'Eixo Estriado de Transmissão Central',
  gfpg: 'GFPG-01',
  quantidade: '100',
  chavePedido: 'PED-96-2025-0849',
};

/* ─── Component ──────────────────────────────────────────────────── */
interface PedidoFormProps {
  onAddItem: (item: PedidoItem) => void;
}

export function PedidoForm({ onAddItem }: PedidoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
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
      chavePedido: '',
    },
  });

  const fillExample = () => {
    (Object.keys(EXAMPLE_DATA) as (keyof PedidoFormValues)[]).forEach((key) => {
      setValue(key, EXAMPLE_DATA[key] ?? '', { shouldValidate: true });
    });
  };

  const onSubmit = async (data: PedidoFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      await api.enviarPedido(data as PedidoInput);
      setSubmitStatus('success');
      reset();
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      console.error(error);
      setSubmitStatus('error');
      setErrorMessage(
        error.message || 'Não foi possível enviar o pedido. Tente novamente.'
      );
      setTimeout(() => setSubmitStatus('idle'), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      chavePedido: data.chavePedido,
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
            <h2 className="card-title">Parâmetros do Componente</h2>
            <p className="card-description">
              Preencha os campos estruturais da ordem conforme engenharia de produto
            </p>
          </div>
        </div>
        <button type="button" className="btn-link" onClick={fillExample}>
          <Sparkles size={14} strokeWidth={1.75} />
          Preencher Exemplo
        </button>
      </div>

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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-grid">
          {/* Row 1: Item + Modelo */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="item">
                <Hash size={14} className="form-label-icon" strokeWidth={1.75} />
                Item (Código)
                <span className="form-sublabel">Ex: 010, IT-96</span>
              </label>
              <input
                id="item"
                className={`input ${errors.item ? 'input--error' : ''}`}
                placeholder="Ex: IT-9604"
                {...register('item')}
              />
              {errors.item && <span className="error-text">{errors.item.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="modelo">
                <Settings2 size={14} className="form-label-icon" strokeWidth={1.75} />
                Modelo
                <span className="form-sublabel">Linha / Equipamento</span>
              </label>
              <input
                id="modelo"
                className={`input ${errors.modelo ? 'input--error' : ''}`}
                placeholder="Ex: Rotor Turbo 4500X"
                {...register('modelo')}
              />
              {errors.modelo && <span className="error-text">{errors.modelo.message}</span>}
            </div>
          </div>

          {/* Row 2: Versão + Nome da Peça */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="versao">
                <GitFork size={14} className="form-label-icon" strokeWidth={1.75} />
                Versão
                <span className="form-sublabel">Rev. CAD</span>
              </label>
              <input
                id="versao"
                className={`input ${errors.versao ? 'input--error' : ''}`}
                placeholder="Ex: v3.2"
                {...register('versao')}
              />
              {errors.versao && <span className="error-text">{errors.versao.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="nomePeca">
                <Wrench size={14} className="form-label-icon" strokeWidth={1.75} />
                Nome da Peça
                <span className="form-sublabel">Nomenclatura Técnica</span>
              </label>
              <input
                id="nomePeca"
                className={`input ${errors.nomePeca ? 'input--error' : ''}`}
                placeholder="Ex: Eixo Estriado de Transmissão Central"
                {...register('nomePeca')}
              />
              {errors.nomePeca && <span className="error-text">{errors.nomePeca.message}</span>}
            </div>
          </div>

          {/* Row 3: GFPG + Quantidade */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="gfpg">
                <Layers size={14} className="form-label-icon" strokeWidth={1.75} />
                GFPG
                <span className="form-sublabel">Grupo de Fluxo</span>
              </label>
              <input
                id="gfpg"
                className={`input ${errors.gfpg ? 'input--error' : ''}`}
                placeholder="Ex: GFPG-01"
                {...register('gfpg')}
              />
              {errors.gfpg && <span className="error-text">{errors.gfpg.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="quantidade">
                <Package size={14} className="form-label-icon" strokeWidth={1.75} />
                Quantidade
                <span className="form-sublabel">Unidades</span>
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

          {/* Row 4: Chave do Pedido + Vincular */}
          <div className="form-row-key">
            <div className="form-group">
              <label className="form-label" htmlFor="chavePedido">
                <Key size={14} className="form-label-icon" strokeWidth={1.75} />
                Chave do Pedido
                <span className="form-sublabel">Vinculação</span>
              </label>
              <input
                id="chavePedido"
                className={`input ${errors.chavePedido ? 'input--error' : ''}`}
                placeholder="PED-96-2025-0849"
                {...register('chavePedido')}
              />
              {errors.chavePedido && (
                <span className="error-text">{errors.chavePedido.message}</span>
              )}
            </div>
            <button type="button" className="btn-vinculate" title="Vincular pedido">
              <RefreshCw size={18} strokeWidth={1.75} />
            </button>
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
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 size={16} className="spinner" strokeWidth={2} />
              ) : (
                <Send size={16} strokeWidth={1.75} />
              )}
              {isSubmitting ? 'Enviando...' : 'Enviar Pedido'}
            </button>
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
