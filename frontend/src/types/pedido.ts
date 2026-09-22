export type PedidoInput = {
  codigoPedido: string;
  cliente: string;
  produto: string;
  quantidade: string;
  dataPedido: string;
  centroCusto?: string;
  responsavel: string;
  unidade?: string;
  valorPedido?: string;
  observacao?: string;
};
