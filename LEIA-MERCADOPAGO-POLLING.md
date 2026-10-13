# Confirmação de pagamentos sem Webhook Secret

Esta versão usa somente `MERCADOPAGO_ACCESS_TOKEN` no servidor para buscar pagamentos pela referência do pedido e conferir detalhes diretamente na API do Mercado Pago. `MERCADOPAGO_PUBLIC_KEY` não é necessária para o Checkout Pro atual. O servidor verifica automaticamente a cada 2 minutos (configurável por `MP_POLL_INTERVAL_MS`) e também ao consultar pedidos no painel ou na conta do cliente. Não configura webhook sem assinatura.

## Render
- `MERCADOPAGO_ACCESS_TOKEN`: token privado, somente no ambiente do Render.
- `PUBLIC_BASE_URL`: `https://site-tabacaria.onrender.com`.
- `MP_POLL_INTERVAL_MS`: `120000` (opcional).
- `MERCADOPAGO_WEBHOOK_SECRET`: não é necessário nesta modalidade.

## Limitações e cuidados
- A atualização pode demorar alguns minutos e depende do servidor estar ativo. No Render, instâncias gratuitas podem adormecer, interrompendo a verificação periódica.
- É preciso persistir `data/loja.db` em armazenamento durável para não perder pedidos, contas e dados após deploy/restart.
- Faça testes com credenciais de teste antes de aceitar pagamentos reais.
- IMPORTANTE: o checkout desta base ainda aceita preços enviados pelo navegador. Antes de publicar para vendas reais, o backend precisa calcular os preços e estoques pelo catálogo do servidor para impedir alteração de valores pelo cliente. Não considere a loja pronta para produção sem isso.
