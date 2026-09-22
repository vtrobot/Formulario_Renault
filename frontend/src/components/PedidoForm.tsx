import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../services/api';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const pedidoSchema = z.object({
  codigoPedido: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  cliente: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  produto: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  quantidade: z.string().min(1, "Obrigatório").refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, { message: "Deve ser um número maior que zero" }),
  dataPedido: z.string().min(1, "Obrigatório").max(10, "Formato DD/MM/AAAA").regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato inválido"),
  centroCusto: z.string().max(100, "Máximo de 100 caracteres").optional().or(z.literal("")),
  responsavel: z.string().min(1, "Obrigatório").max(100, "Máximo de 100 caracteres"),
  unidade: z.string().max(100, "Máximo de 100 caracteres").optional().or(z.literal("")),
  valorPedido: z.string().max(100, "Máximo de 100 caracteres").optional().or(z.literal("")),
  observacao: z.string().max(500, "Máximo de 500 caracteres").optional().or(z.literal(""))
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
            <label className="label-text">Código do Pedido *</label>
            <input type="text" {...register('codigoPedido')} className="input-field" placeholder="Ex: 123456" />
            {errors.codigoPedido && <p className="error-text">{errors.codigoPedido.message}</p>}
          </div>

          <div>
            <label className="label-text">Data do Pedido *</label>
            <input type="text" {...register('dataPedido')} className="input-field" placeholder="DD/MM/AAAA" />
            {errors.dataPedido && <p className="error-text">{errors.dataPedido.message}</p>}
          </div>

          <div>
            <label className="label-text">Cliente *</label>
            <input type="text" {...register('cliente')} className="input-field" placeholder="Nome do cliente" />
            {errors.cliente && <p className="error-text">{errors.cliente.message}</p>}
          </div>

          <div>
            <label className="label-text">Responsável *</label>
            <input type="text" {...register('responsavel')} className="input-field" placeholder="Nome do responsável" />
            {errors.responsavel && <p className="error-text">{errors.responsavel.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="label-text">Produto *</label>
            <input type="text" {...register('produto')} className="input-field" placeholder="Descrição do produto" />
            {errors.produto && <p className="error-text">{errors.produto.message}</p>}
          </div>

          <div>
            <label className="label-text">Quantidade *</label>
            <input type="text" {...register('quantidade')} className="input-field" placeholder="Ex: 100" />
            {errors.quantidade && <p className="error-text">{errors.quantidade.message}</p>}
          </div>

          <div>
            <label className="label-text">Valor do Pedido</label>
            <input type="text" {...register('valorPedido')} className="input-field" placeholder="Ex: 1500.00" />
            {errors.valorPedido && <p className="error-text">{errors.valorPedido.message}</p>}
          </div>

          <div>
            <label className="label-text">Centro de Custo</label>
            <input type="text" {...register('centroCusto')} className="input-field" placeholder="Ex: CC001" />
            {errors.centroCusto && <p className="error-text">{errors.centroCusto.message}</p>}
          </div>

          <div>
            <label className="label-text">Unidade</label>
            <input type="text" {...register('unidade')} className="input-field" placeholder="Ex: Curitiba" />
            {errors.unidade && <p className="error-text">{errors.unidade.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="label-text">Observação</label>
            <textarea {...register('observacao')} className="input-field h-24 resize-none" placeholder="Observações adicionais..." />
            {errors.observacao && <p className="error-text">{errors.observacao.message}</p>}
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
