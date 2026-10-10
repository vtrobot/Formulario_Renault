export type PedidoInput = {
  item: string;
  modelo: string;
  versao: string;
  nomePeca: string;
  gfpg: string;
  quantidade: string;
  projeto: string;
  area: string;
  milestone: string;
  email: string;
};

export type PedidoItem = PedidoInput & {
  id: string;
  subtotalLcpu: number;
};


