import { useState } from 'react';
import { FormHeader } from './components/FormHeader';
import { PedidoForm } from './components/PedidoForm';
import { ItemsTable } from './components/ItemsTable';
import type { PedidoItem } from './types/pedido';

function App() {
  const [items, setItems] = useState<PedidoItem[]>([]);
  const [chavePedido, setChavePedido] = useState<string>('');

  const generateKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `PED-${year}-${month}-${day}-${hour}-${min}`;
  };

  const handleAddItem = (item: PedidoItem) => {
    setItems((prev) => {
      if (prev.length === 0) {
        setChavePedido(generateKey());
      }
      const existingIndex = prev.findIndex(i => i.item === item.item && i.gfpg === item.gfpg);
      if (existingIndex >= 0) {
        const newItems = [...prev];
        const existing = newItems[existingIndex];
        newItems[existingIndex] = {
          ...existing,
          quantidade: String(Number(existing.quantidade) + Number(item.quantidade)),
          subtotalLcpu: (existing.subtotalLcpu || 0) + (item.subtotalLcpu || 0)
        };
        return newItems;
      }
      return [...prev, item];
    });
  };

  const handleAddItems = (newItems: PedidoItem[]) => {
    setItems((prev) => {
      if (prev.length === 0 && newItems.length > 0) {
        setChavePedido(generateKey());
      }
      let updated = [...prev];
      for (const item of newItems) {
        const existingIndex = updated.findIndex(i => i.item === item.item && i.gfpg === item.gfpg);
        if (existingIndex >= 0) {
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            quantidade: String(Number(existing.quantidade) + Number(item.quantidade)),
            subtotalLcpu: (existing.subtotalLcpu || 0) + (item.subtotalLcpu || 0)
          };
        } else {
          updated.push(item);
        }
      }
      return updated;
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const remaining = prev.filter((i) => i.id !== id);
      if (remaining.length === 0) {
        setChavePedido('');
      }
      return remaining;
    });
  };

  const handleClearAll = () => {
    setItems([]);
    setChavePedido('');
  };

  return (
    <div className="page">
      <FormHeader onFillExample={() => {}} />
      <PedidoForm onAddItem={handleAddItem} onAddItems={handleAddItems} />
      <ItemsTable
        items={items}
        chavePedido={chavePedido}
        onRemoveItem={handleRemoveItem}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

export default App;
