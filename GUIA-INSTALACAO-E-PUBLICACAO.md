# Souza & Carvalho — guia de instalação e publicação

## O que esta entrega prepara
- Aplicação Node.js servida pelo próprio backend.
- Dockerfile para hospedagens que aceitam contêiner.
- Blueprint `render.yaml` com disco persistente para os arquivos JSON atuais e variáveis secretas.
- Endpoint de saúde `/healthz` para monitoramento da hospedagem.
- Integração Mercado Pago no backend; tokens ficam somente nas variáveis de ambiente.

## Atenção antes de vender de verdade
Esta versão ainda persiste contas, administradores e pedidos em arquivos JSON. O schema PostgreSQL que acompanha o projeto é apenas a preparação: a aplicação não foi migrada para usar PostgreSQL. O disco persistente é obrigatório nesta versão para não perder esses arquivos em reinicializações/deploys. Para crescimento, múltiplas instâncias e confiabilidade de estoque, concluir a migração PostgreSQL e transações antes de operar em escala.

## Executar localmente (Windows)
1. Instale Node.js 20 LTS ou mais recente.
2. Abra a pasta do projeto no VS Code.
3. Copie `.env.example` para `.env` e preencha `ADMIN_EMAIL` e `ADMIN_PASSWORD` com um e-mail seu e uma senha forte (mínimo 10 caracteres para o administrador).
4. No terminal da pasta, execute `npm install` e depois `npm start`.
5. Acesse `http://localhost:8080`. Verifique `http://localhost:8080/healthz`.
6. Não coloque `.env` em ZIP público, GitHub ou no navegador.

## Publicar no Render
1. Crie uma conta no Render e envie esta pasta para um repositório privado no GitHub (não inclua `.env`).
2. No Render, use **New + → Blueprint** e selecione o repositório com `render.yaml`.
3. Preencha as variáveis solicitadas no painel:
   - `ADMIN_EMAIL`: e-mail para entrar no painel administrativo.
   - `ADMIN_PASSWORD`: senha forte inédita.
   - `PUBLIC_BASE_URL`: URL HTTPS exata da aplicação, sem barra final, por exemplo `https://nome-do-site.onrender.com`.
   - `MERCADOPAGO_ACCESS_TOKEN`: Access Token fornecido pelo dono da conta Mercado Pago que receberá as vendas. Não use credencial de terceiros sem autorização.
   - `MERCADOPAGO_WEBHOOK_SECRET`: segredo de assinatura configurado para a URL `https://.../api/webhooks/mercadopago` no painel Mercado Pago.
4. Faça deploy e confira `/healthz`, cadastro/login e painel administrativo.
5. O disco persistente deve estar montado em `/app/data`; não remova nem troque esse disco sem backup.

## Mercado Pago
- A loja não contém token real. O pagamento online permanecerá indisponível até configurar `MERCADOPAGO_ACCESS_TOKEN` no ambiente de hospedagem.
- Configure a notificação/webhook no painel do Mercado Pago apontando para `PUBLIC_BASE_URL + /api/webhooks/mercadopago`, usando o mesmo segredo em `MERCADOPAGO_WEBHOOK_SECRET`.
- Primeiro valide com credenciais de teste. Só depois de validar pagamento aprovado, pendente, recusado e webhook, mude para credenciais de produção.
- O token nunca deve ser inserido em `index.html`, `admin.html`, arquivos JavaScript públicos ou enviado por chat.

## Limites conhecidos a resolver antes de operação comercial em escala
1. Migrar de JSON para PostgreSQL (schema e plano incluídos) e implementar transações para concorrência e estoque.
2. Usar catálogo de produtos e preços autoritativos no backend; o checkout atual recebe preços enviados pelo navegador e não deve ser considerado antifraude de produção.
3. Persistir sessões fora da memória do processo, aplicar proteção contra tentativas repetidas de login e fazer testes ponta a ponta do checkout/webhook.
4. Confirmar número do WhatsApp e política de frete/devolução antes da divulgação.

Este pacote organiza a publicação e mantém as credenciais fora do código, mas não significa que pagamentos reais foram testados: isso só pode ser feito depois de configurar as credenciais do titular e a URL HTTPS definitiva.


## Versão 13 — melhorias visuais
- Identidade visual branca, laranja e grafite reforçada.
- Bloco de vantagens do atacado na página inicial.
- Melhorias de contraste, foco por teclado, responsividade e apresentação do catálogo.
- Nenhuma credencial real do Mercado Pago foi adicionada.

**Nota operacional:** esta atualização é principalmente visual. Antes de aceitar pagamentos reais, valide o checkout em ambiente de teste e conclua a persistência transacional do banco de dados/estoque. O arquivo `.env` deve permanecer fora do ZIP público e nunca ser enviado ao navegador.
