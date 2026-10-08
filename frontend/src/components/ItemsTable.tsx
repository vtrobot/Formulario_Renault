
import { useState } from 'react';
import type { PedidoItem } from '../types/pedido';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';
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
  chavePedido: string;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export function ItemsTable({ items, chavePedido, onRemoveItem, onClearAll }: ItemsTableProps) {
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
      // 1. Salvar no Supabase
      if (!supabase) {
        throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.');
      }
      
      const { error: supabaseError } = await supabase
        .from('pedidos_enviados')
        .insert(
          items.map((item) => ({
            chave_pedido: chavePedido,
            item: item.item,
            modelo: item.modelo,
            versao: item.versao,
            nome_peca: item.nomePeca,
            gfpg: item.gfpg,
            quantidade: Number(item.quantidade),
          }))
        );

      if (supabaseError) {
        console.error('Erro ao salvar no Supabase:', supabaseError);
        throw new Error('Não foi possível salvar os itens no banco de dados.');
      }

      // 2. Enviar por e-mail
      const itensParaEnviar = items.map(({ id, subtotalLcpu, ...rest }) => rest);
      const result = await api.enviarPedidoLote(itensParaEnviar, chavePedido);
      setSendStatus('success');
      setSendMessage(result.message || 'Itens salvos e enviados por e-mail com sucesso!');
      onClearAll();
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

  const handleExportCSV = () => {
    if (items.length === 0) return;

    const header = 'Item;Modelo;Versao;NomePeca;GfPg;Quantidade;ChavePedido';
    const linhas = items.map(
      (item) => `${item.item};${item.modelo};${item.versao};${item.nomePeca};${item.gfpg};${item.quantidade};${chavePedido}`
    );
    const csvContent = [header, ...linhas].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pedidos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <button type="button" className="btn-link" onClick={handleExportCSV}>
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

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Modelo</th>
              <th>Versão</th>
              <th>Nome da Peça</th>
              <th>GFPG</th>
              <th>Qtd</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <Inbox size={48} strokeWidth={1} className="empty-state-icon" />
                    <p className="empty-state-title">Nenhum item adicionado</p>
                    <p className="empty-state-text">
                      Preencha o formulário acima e clique em "Adicionar à Lista de Itens"
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
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
              ))
            )}
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
          disabled={isSending || items.length === 0}
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
    </section>
  );
}
