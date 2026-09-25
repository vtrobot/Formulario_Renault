export type PedidoInput = {
  item: string;
  modelo: string;
  versao: string;
  nomePeca: string;
  gfpg: string;
  quantidade: string;
};

export type PedidoItem = PedidoInput & {
  id: string;
  subtotalLcpu: number;
};
