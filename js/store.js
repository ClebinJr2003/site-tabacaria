/**
 * ===== Pata Brava — lógica da loja =====
 *
 * Os PRODUTOS não ficam mais aqui: estão em js/produtos.js, que é o
 * catálogo publicado (o que todo visitante enxerga).
 *
 * O painel admin guarda as alterações no navegador (localStorage) como
 * um RASCUNHO, visível só pra quem está cadastrando. Pra que as
 * mudanças valham pra todo mundo, é preciso clicar em "Publicar
 * catálogo" no admin e substituir o arquivo js/produtos.js.
 *
 * IMPORTANTE: js/produtos.js deve ser carregado ANTES de js/store.js
 * nas páginas HTML.
 */

const PRODUCTS_STORAGE_KEY = "sc_custom_products";
const HIDDEN_DEFAULTS_KEY = "sc_hidden_defaults";
const CART_STORAGE_KEY = "sc_cart";
const SERVER_PRODUCTS_KEY = "sc_server_products_v1";

/** Produtos do catálogo publicado (js/produtos.js). */
function getPublishedProducts() {
  if (typeof DEFAULT_PRODUCTS === "undefined") {
    console.error("js/produtos.js não foi carregado antes de js/store.js.");
    return [];
  }
  return DEFAULT_PRODUCTS;
}

/** Existe alguma alteração feita no painel que ainda não foi publicada? */
function hasDraftChanges() {
  const custom = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY) || "[]");
  const hidden = JSON.parse(localStorage.getItem(HIDDEN_DEFAULTS_KEY) || "[]");
  return custom.length > 0 || hidden.length > 0;
}

/** Descarta o rascunho local e volta a enxergar exatamente o catálogo publicado. */
function discardDraft() {
  localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  localStorage.removeItem(HIDDEN_DEFAULTS_KEY);
}

/** Todos os produtos: os publicados (que não foram excluídos) + o rascunho do admin. */
function getAllProducts() {
  const serverCatalog = localStorage.getItem(SERVER_PRODUCTS_KEY);
  if (serverCatalog) { try { return JSON.parse(serverCatalog); } catch (_) {} }
  const custom = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY) || "[]");
  const hidden = JSON.parse(localStorage.getItem(HIDDEN_DEFAULTS_KEY) || "[]");
  const publicados = getPublishedProducts().filter((p) => !hidden.includes(p.id));
  return [...publicados, ...custom];
}

/**
 * Monta o conteúdo do novo js/produtos.js com a lista atual de produtos.
 * É o que o botão "Publicar catálogo" baixa.
 */
function buildProdutosJS() {
  const lista = getAllProducts().map((p) => ({
    id: p.id,
    nome: p.nome,
    peso: p.peso,
    preco: p.preco,
    precoAntigo: p.precoAntigo || null,
    selo: p.selo || "",
    descricao: p.descricao,
    imagem: p.imagem,
    categoria: p.categoria || "Acessórios",
    estoque: Number(p.estoque || 0),
    pedidoMinimo: Number(p.pedidoMinimo || 1),
    precosVolume: Array.isArray(p.precosVolume) ? p.precosVolume : []
  }));

  const dataHora = new Date().toLocaleString("pt-BR");

  return `/**
 * ===== Pata Brava — catálogo publicado =====
 *
 * Arquivo gerado pelo painel do administrador em ${dataHora}.
 * Substitua js/produtos.js por este arquivo e suba pra hospedagem:
 * o que está aqui é o que todos os visitantes vão ver.
 */
const DEFAULT_PRODUCTS = ${JSON.stringify(lista, null, 2)};
`;
}

/** Adiciona um produto novo (cadastrado pelo painel do administrador). */
function addProduct(product) {
  const custom = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY) || "[]");
  custom.push(product);
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(custom));
}

/** Remove um produto (fixo ou cadastrado) da vitrine. */
function deleteProduct(id) {
  const custom = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY) || "[]");
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(custom.filter((p) => p.id !== id)));

  const hidden = JSON.parse(localStorage.getItem(HIDDEN_DEFAULTS_KEY) || "[]");
  if (!hidden.includes(id)) {
    hidden.push(id);
    localStorage.setItem(HIDDEN_DEFAULTS_KEY, JSON.stringify(hidden));
  }
}

/** Formata número como preço em reais. */
function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Escapa caracteres HTML de um texto antes de inserir com innerHTML.
 * Evita que nome/descrição de um produto (digitados no painel do
 * administrador) sejam interpretados como código HTML.
 */
function escapeHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto == null ? '' : String(texto);
  return div.innerHTML;
}

/* ---------- Carrinho ---------- */

function getCart() {
  return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/** Adiciona uma quantidade de um produto ao carrinho (soma se já existir). */
function addToCart(productId, quantidade) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.quantidade += quantidade;
  } else {
    cart.push({ id: productId, quantidade });
  }
  saveCart(cart);
}

function updateCartQuantity(productId, quantidade) {
  let cart = getCart();
  if (quantidade <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  } else {
    const item = cart.find((i) => i.id === productId);
    if (item) item.quantidade = quantidade;
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  saveCart(getCart().filter((i) => i.id !== productId));
}

function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}

/** Junta o carrinho (ids + quantidades) com os dados completos dos produtos. */
function getCartDetailed() {
  const produtos = getAllProducts();
  return getCart()
    .map((item) => {
      const produto = produtos.find((p) => p.id === item.id);
      if (!produto) return null;
      return { ...produto, quantidade: item.quantidade };
    })
    .filter(Boolean);
}

function getCartTotal() {
  return getCartDetailed().reduce((total, item) => total + item.preco * item.quantidade, 0);
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantidade, 0);
}
