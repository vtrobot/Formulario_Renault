
import { useState } from 'react';
import type { PedidoItem } from '../types/pedido';
import { api } from '../services/api';
import {
  Table2,
  Download,
  Trash2,
  Pencil,
  Package,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Send,
  Loader2,
} from 'lucide-react';

interface ItemsTableProps {
  items: PedidoItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export function ItemsTable({ items, onRemoveItem, onClearAll }: ItemsTableProps) {
  const totalModelos = new Set(items.map((i) => i.modelo)).size;
  const totalQuantidade = items.reduce((acc, i) => acc + Number(i.quantidade), 0);

  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [sendMessage, setSendMessage] = useState('');

  const handleSendEmail = async () => {
    if (items.length === 0) return;

    setIsSending(true);
    setSendStatus('idle');
    setSendMessage('');

    try {
      const itensParaEnviar = items.map(({ id, subtotalLcpu, ...rest }) => rest);
      const result = await api.enviarPedidoLote(itensParaEnviar);
      setSendStatus('success');
      setSendMessage(result.message || 'Itens enviados por e-mail com sucesso!');
      setTimeout(() => setSendStatus('idle'), 6000);
    } catch (error: any) {
      console.error(error);
      setSendStatus('error');
      setSendMessage(error.message || 'Não foi possível enviar os itens por e-mail.');
      setTimeout(() => setSendStatus('idle'), 8000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="card table-section">
      <div className="card-header">
        <div className="card-header-left">
          <div className="card-icon">
            <Table2 size={20} strokeWidth={1.75} />
          </div>
          <div>
            <div className="table-header-title">
              <h2 className="card-title">Itens Adicionados ao Pedido</h2>
              {items.length > 0 && (
                <span className="badge badge--count">{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
              )}
            </div>

          </div>
        </div>
        {items.length > 0 && (
          <div className="table-header-actions">
            <button type="button" className="btn-link">
              <Download size={14} strokeWidth={1.75} />
              Exportar
            </button>
            <button type="button" className="btn-link btn-link--danger" onClick={onClearAll}>
              <Trash2 size={14} strokeWidth={1.75} />
              Limpar Tabela
            </button>
          </div>
        )}
      </div>

      {sendStatus === 'success' && (
        <div className="toast toast--success">
          <CheckCircle2 size={18} strokeWidth={1.75} />
          <span>{sendMessage}</span>
        </div>
      )}
      {sendStatus === 'error' && (
        <div className="toast toast--error">
          <AlertCircle size={18} strokeWidth={1.75} />
          <span>{sendMessage}</span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <Inbox size={48} strokeWidth={1} className="empty-state-icon" />
          <p className="empty-state-title">Nenhum item adicionado</p>
          <p className="empty-state-text">
            Preencha o formulário acima e clique em "Adicionar à Lista de Itens"
          </p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Modelo</th>
                  <th>Versão</th>
                  <th>Nome da Peça</th>
                  <th>GFPG</th>
                  <th>Qtd</th>

                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <td>
                      <strong>{item.item}</strong>
                    </td>
                    <td>{item.modelo}</td>
                    <td>
                      <span className="badge badge--version">{item.versao}</span>
                    </td>
                    <td>{item.nomePeca}</td>
                    <td>
                      <span className="badge badge--navy">{item.gfpg}</span>
                    </td>
                    <td className="td-center">{Number(item.quantidade).toLocaleString('pt-BR')}</td>

                    <td>
                      <div className="td-actions">
                        <button type="button" className="btn-icon" title="Editar item">
                          <Pencil size={15} strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon--danger"
                          title="Remover item"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 size={15} strokeWidth={1.75} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div className="table-stats">
              <div className="stat-item">
                <BarChart3 size={15} className="stat-item-icon" strokeWidth={1.75} />
                Total de Modelos: <span className="stat-value">{totalModelos}</span>
              </div>
              <div className="stat-item">
                <Package size={15} className="stat-item-icon" strokeWidth={1.75} />
                Volume Físico: <span className="stat-value">{totalQuantidade.toLocaleString('pt-BR')} unidades</span>
              </div>

            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isSending}
              onClick={handleSendEmail}
            >
              {isSending ? (
                <Loader2 size={16} className="spinner" strokeWidth={2} />
              ) : (
                <Send size={16} strokeWidth={1.75} />
              )}
              {isSending ? 'Enviando...' : 'Enviar Pedido'}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
