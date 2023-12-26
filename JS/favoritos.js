function adicionarFavoritos(cao) {
  let caesFavoritos = obterCaesFavoritos();

  if (!verificarCaoFavorito(cao.id)) {
    caesFavoritos.push(cao);
    localStorage.setItem("caesFavoritos", JSON.stringify(caesFavoritos));
    criarMensagemSucesso("Cão adicionado aos favoritos com sucesso!", "success");
    updateIconeFavorito(cao, true);
  }
}

function removerFavoritos(cao) {
  let caesFavoritos = obterCaesFavoritos();

  if (verificarCaoFavorito(cao.id)) {
    caesFavoritos = caesFavoritos.filter((caes) => caes.id != cao.id);
    localStorage.setItem("caesFavoritos", JSON.stringify(caesFavoritos));
    criarMensagemSucesso("Cão removido dos favoritos com sucesso!", "danger");
    updateIconeFavorito(cao, false);
  }
}

function obterCaesFavoritos() {
  let favoritos = JSON.parse(localStorage.getItem("caesFavoritos"));
  if (favoritos == null) {
    favoritos = [];
  }
  return favoritos;
}

function verificarCaoFavorito(id) {
  caes_favoritos = obterCaesFavoritos();
  let cao = caes_favoritos.find((cao) => cao.id == id);
  if (cao != null) {
    return true;
  }
  return false;
}

function updateIconeFavorito(cao, favorito) {
  let btnFavorito = document.getElementById("dog_" + cao.id);

  if (favorito) {
    btnFavorito.classList.remove("btn-outline-danger");
    btnFavorito.classList.add("btn-danger");
    btnFavorito.addEventListener("click", () => {
      removerFavoritos(cao);
    });
  } else {
    btnFavorito.classList.remove("btn-danger");
    btnFavorito.classList.add("btn-outline-danger");
    btnFavorito.addEventListener("click", () => {
      adicionarFavoritos(cao);
    });
  }
}

function criarMensagemSucesso(msg,color) {
  const containerMensagens = document.querySelector(".toast-container"); 
  let mensagem;

  if (containerMensagens) {
    mensagem = `
    <div class="toast align-items-center text-bg-${color} border-0 fade " role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="1000">
    <div class="d-flex">
      <div class="toast-body">
        ${msg}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>
  </div>`;
  }

  containerMensagens.innerHTML += mensagem;

  mostrarToasters();
}

function mostrarToasters(){
  let toasters = document.querySelectorAll(".toast");
  toasters.forEach(toast => {
    let bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    setTimeout(() => {
      toast.remove();
    }, 3000);
  });

}

function limparLocalStorage(){
  localStorage.removeItem("caesFavoritos");
  criarMensagemSucesso("Favoritos limpos com sucesso!", "danger");
}

