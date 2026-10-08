CREATE TABLE public.pedidos_enviados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave_pedido VARCHAR(50) NOT NULL,
    item VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    versao VARCHAR(100) NOT NULL,
    nome_peca VARCHAR(200) NOT NULL,
    gfpg VARCHAR(100) NOT NULL,
    quantidade INTEGER NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS e criar políticas (opcional, mas recomendado)
ALTER TABLE public.pedidos_enviados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserção anônima" ON public.pedidos_enviados
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir leitura anônima" ON public.pedidos_enviados
    FOR SELECT
    USING (true);
