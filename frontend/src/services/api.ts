import type { PedidoInput } from '../types/pedido';

const API_URL = 'http://localhost:3000/api';

export const api = {
  async enviarPedido(pedido: PedidoInput) {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedido),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao enviar pedido');
    }

    return data;
  },

  async enviarPedidoLote(itens: PedidoInput[]) {
    const response = await fetch(`${API_URL}/pedidos/lote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itens }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao enviar itens por e-mail');
    }

    return data;
  },
};
