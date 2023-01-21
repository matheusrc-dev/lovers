const vm = new Vue({
  el: '#app',
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    mensagemAlerta: 'Item adicionado',
    alertaAtivo: false,
    carrinhoAtivo: false,
    currentIndex: 0
  },
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    },
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach((item) => {
          total += item.preco;
        });
      }
      return total;
    },
  },
  methods: {
    fetchProdutos() {
      fetch('./api/produtos.json').then((response) => {
        return response.json().then((json) => {
          this.produtos = json;
        });
      });
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`).then((response) => {
        return response.json().then((json) => {
          this.produto = json;
        });
      });
    },
    fecharModal({ target, currentTarget }) {
      if (target == currentTarget) this.produto = false;
    },
    clickForaCarrinho({ target, currentTarget }) {
      if (target == currentTarget) this.carrinhoAtivo = false;
    },
    abrirModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    adicionarItem() {
      this.produto.estoque--;
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco });
      this.alerta(`${nome} adicionado ao carrinho`);
    },
    removerItem(index) {
      this.carrinho.splice(index, 1);
    },
    checarLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },
    compararEstoque() {
      const items = this.carrinho.filter(({ id }) => id === this.produto.id);
      this.produto.estoque -= items.length;
    },
    alerta(mensagem) {
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 3000);
    },
    router() {
      const hash = document.location.hash;
      if (hash) this.fetchProduto(hash.replace('#', ''));
    },
    previousPhoto() {
      if(this.currentIndex != 0)
        this.currentIndex--
    },
    nextPhoto() {
      if(this.currentIndex < 21)
        this.currentIndex++;
    }
  },
  watch: {
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    },
    produto() {
      document.title = this.produto.nome || 'Techno';
      const hash = this.produto.id || '';
      history.pushState(null, null, `#${hash}`);
      if(this.produto)
        this.compararEstoque();
    },
  },
  created() {
    this.fetchProdutos();
    this.router();
    this.checarLocalStorage();
  },
});
