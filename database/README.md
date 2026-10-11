# PostgreSQL — V11

O schema cria as tabelas centrais para clientes, administradores, produtos, pedidos e movimentações de estoque.

**Atenção:** a aplicação V10 original ainda usa `data/*.json` em várias rotas. O schema sozinho não migra os dados nem troca o repositório em execução. Antes de colocar em produção, é necessário executar a migração de dados e apontar todas as rotas para o repositório PostgreSQL; não apague os JSON até validar contagens e hashes. Consulte `MIGRACAO_V11.md` na raiz.
