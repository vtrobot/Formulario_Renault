import { PedidoForm } from './components/PedidoForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Renault Form
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Sistema de envio de pedidos integrado
          </p>
        </div>
        
        <PedidoForm />
      </div>
    </div>
  );
}

export default App;
