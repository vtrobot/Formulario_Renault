import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, FileUp } from 'lucide-react';
import type { PedidoItem } from '../types/pedido';

interface CsvImportModalProps {
  onClose: () => void;
  onImport: (items: PedidoItem[]) => void;
}

export function CsvImportModal({ onClose, onImport }: CsvImportModalProps) {
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Por favor, selecione um arquivo .csv válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) {
        setError('Arquivo vazio ou não pôde ser lido.');
        return;
      }
      parseCSV(text);
    };
    reader.onerror = () => {
      setError('Erro ao ler o arquivo.');
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    try {
      // Split por quebra de linha ou caractere pipe (|)
      const rows = text.split(/\r?\n|\|/).filter((row) => row.trim() !== '');
      if (rows.length < 2) {
        setError('O arquivo CSV deve conter um cabeçalho e pelo menos uma linha de dados.');
        return;
      }

      // Validar cabeçalho
      const header = rows[0].split(';');
      const expectedHeader = ['Item', 'Modelo', 'Versao', 'NomePeca', 'GfPg', 'Quantidade'];
      
      const isHeaderValid = expectedHeader.every(col => 
        header.some(h => h.trim().toLowerCase() === col.toLowerCase())
      );

      if (!isHeaderValid) {
        setError('Formato de cabeçalho inválido. As colunas esperadas são: Item;Modelo;Versao;NomePeca;GfPg;Quantidade');
        return;
      }

      const items: PedidoItem[] = [];

      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(';');
        if (columns.length < 6) continue; // Pular linhas incompletas

        const [item, modelo, versao, nomePeca, gfpg, quantidadeStr] = columns.map(c => c.trim());
        const qty = Number(quantidadeStr);

        if (isNaN(qty) || qty <= 0) continue; // Pular quantidades inválidas

        items.push({
          id: crypto.randomUUID(),
          item,
          modelo,
          versao,
          nomePeca,
          gfpg,
          quantidade: quantidadeStr,
          subtotalLcpu: Math.round(qty * (14.5 + Math.random() * 3) * 100) / 100,
        });
      }

      if (items.length === 0) {
        setError('Nenhum dado válido encontrado para importar.');
        return;
      }

      onImport(items);
      onClose();
    } catch (err) {
      setError('Erro ao processar o CSV. Verifique o formato do arquivo.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="card modal-content" style={{ maxWidth: '500px', width: '100%', position: 'relative', zIndex: 10000 }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div className="card-icon">
            <FileUp size={20} strokeWidth={1.75} />
          </div>
          <h2 className="card-title" style={{ margin: 0 }}>Importar CSV</h2>
        </div>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
          Selecione um arquivo CSV com separador ponto-e-vírgula (;) contendo as colunas: <br/>
          <strong style={{ color: 'var(--color-tertiary)' }}>Item;Modelo;Versao;NomePeca;GfPg;Quantidade</strong>
        </p>

        {error && (
          <div className="toast toast--error" style={{ marginBottom: '20px' }}>
            <AlertCircle size={16} strokeWidth={1.75} />
            <span>{error}</span>
          </div>
        )}

        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{ 
            border: '2px dashed var(--color-border)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '32px', 
            textAlign: 'center', 
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            marginBottom: '24px',
            backgroundColor: 'var(--color-surface)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.backgroundColor = 'var(--color-surface)';
          }}
        >
          <Upload size={32} style={{ color: 'var(--color-primary)', marginBottom: '12px', opacity: 0.8 }} strokeWidth={1.75} />
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontWeight: 500, fontSize: '0.875rem' }}>
            Clique para selecionar o arquivo CSV
          </p>
        </div>

        <input 
          type="file" 
          accept=".csv" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-ghost"
          >
            Cancelar
          </button>
        </div>
      </div>
      
      {/* Styles for backdrop if not present globally */}
      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.2s ease;
        }
        .modal-content {
          animation: scaleIn 0.25s ease;
        }
      `}</style>
    </div>
  );
}
