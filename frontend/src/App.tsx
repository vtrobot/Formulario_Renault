import { useState } from 'react';
import { FormHeader } from './components/FormHeader';
import { PedidoForm } from './components/PedidoForm';
import { ItemsTable } from './components/ItemsTable';
import type { PedidoItem } from './types/pedido';

function App() {
  const [items, setItems] = useState<PedidoItem[]>([]);

  const handleAddItem = (item: PedidoItem) => {
    setItems((prev) => [...prev, item]);
  };

  const handleAddItems = (newItems: PedidoItem[]) => {
    setItems((prev) => [...prev, ...newItems]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  return (
    <div className="page">
      <FormHeader onFillExample={() => {}} />
      <PedidoForm onAddItem={handleAddItem} onAddItems={handleAddItems} />
      <ItemsTable
        items={items}
        onRemoveItem={handleRemoveItem}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

export default App;
