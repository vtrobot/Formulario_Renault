import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../services/api';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const pedidoSchema = z.object({
  item: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  modelo: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  versao: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  nomePeca: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  gfpg: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  quantidade: z.string().min(1, "Obrigatório").refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, { message: "Deve ser um número maior que zero" }),
  chavePedido: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
});

type PedidoFormValues = z.infer<typeof pedidoSchema>;

export function PedidoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: PedidoFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await api.enviarPedido(data);
      setSubmitStatus('success');
      reset();
    } catch (error: any) {
      console.error(error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Não foi possível enviar o pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="bg-brand-100 text-brand-600 p-2 rounded-lg">📋</span>
        Envio de Pedido
      </h2>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="font-medium">Pedido enviado com sucesso!</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="label-text">Item *</label>
            <input type="text" {...register('item')} className="input-field" placeholder="Item" />
            {errors.item && <p className="error-text">{errors.item.message}</p>}
          </div>

          <div>
            <label className="label-text">Modelo *</label>
            <input type="text" {...register('modelo')} className="input-field" placeholder="Modelo" />
            {errors.modelo && <p className="error-text">{errors.modelo.message}</p>}
          </div>

          <div>
            <label className="label-text">Versão *</label>
            <input type="text" {...register('versao')} className="input-field" placeholder="Versão" />
            {errors.versao && <p className="error-text">{errors.versao.message}</p>}
          </div>

          <div>
            <label className="label-text">Nome da Peça *</label>
            <input type="text" {...register('nomePeca')} className="input-field" placeholder="Nome da Peça" />
            {errors.nomePeca && <p className="error-text">{errors.nomePeca.message}</p>}
          </div>

          <div>
            <label className="label-text">GFPG *</label>
            <input type="text" {...register('gfpg')} className="input-field" placeholder="GFPG" />
            {errors.gfpg && <p className="error-text">{errors.gfpg.message}</p>}
          </div>

          <div>
            <label className="label-text">Quantidade *</label>
            <input type="text" {...register('quantidade')} className="input-field" placeholder="Ex: 100" />
            {errors.quantidade && <p className="error-text">{errors.quantidade.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="label-text">Chave do Pedido *</label>
            <input type="text" {...register('chavePedido')} className="input-field" placeholder="Chave do Pedido" />
            {errors.chavePedido && <p className="error-text">{errors.chavePedido.message}</p>}
          </div>

        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Pedido'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
