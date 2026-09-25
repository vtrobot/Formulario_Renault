

interface FormHeaderProps {
  onFillExample: () => void;
}

export function FormHeader({ onFillExample: _onFillExample }: FormHeaderProps) {
  return (
    <div className="page-header">
      <h1 className="page-title">
        Novo Pedido de Produção <span className="page-title-dot">•</span> LCPU
      </h1>
      {/* <p className="page-subtitle">
        Entrada paramétrica de componentes industriais com apuração em tempo real
        de custo de mão de obra por unidade (Labor Cost Per Unit) e alocação de
        postos fabris.
      </p> */}
    </div>
  );
}
