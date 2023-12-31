function adicionarFavoritos(cao) {
  let caesFavoritos = obterCaesFavoritos();

  if (!verificarCaoFavorito(cao.id)) {
    caesFavoritos.push(cao);
    localStorage.setItem("caesFavoritos", JSON.stringify(caesFavoritos));
    criarMensagemSucesso(
      "Cão adicionado aos favoritos com sucesso!",
      "success"
    );
    updateIconeFavorito(cao, true);
  }
}

function removerFavoritos(cao, removerPermanente = false) {
  let caesFavoritos = obterCaesFavoritos();
  if (verificarCaoFavorito(cao.id)) {
    caesFavoritos = caesFavoritos.filter((caes) => caes.id != cao.id);
    localStorage.setItem("caesFavoritos", JSON.stringify(caesFavoritos));
    criarMensagemSucesso("Cão removido dos favoritos com sucesso!", "danger");
    if (removerPermanente) {
      $(".dogCard_" + cao.id).fadeOut(300, function () {
        $(this).remove();
      });
    } else {
      updateIconeFavorito(cao, false);
    }
  }
}

function obterCaesFavoritos() {
  let favoritos = JSON.parse(localStorage.getItem("caesFavoritos"));
  if (favoritos == null) {
    favoritos = [];
  }
  return favoritos;
}

function obterCaoEspecifico(id) {
  let caesFavoritos = obterCaesFavoritos();
  let cao = caesFavoritos.find((cao) => cao.id == id);
  return cao;
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
  let btnFavorito = document.getElementById("dogBtn_" + cao.id);
  let btnFavoritoTexto = btnFavorito.querySelector(".textoFavorito");
  console.log(btnFavoritoTexto);
  if (favorito) {
    btnFavorito.classList.remove("btn-outline-danger");
    btnFavorito.classList.add("btn-danger");
    if (btnFavoritoTexto){
      btnFavoritoTexto.innerHTML = "Remover dos favoritos";
    }
    btnFavorito.addEventListener("click", () => {
      removerFavoritos(cao);
    });
  } else {
    btnFavorito.classList.remove("btn-danger");
    btnFavorito.classList.add("btn-outline-danger");
    if(btnFavoritoTexto){
      btnFavoritoTexto.innerHTML = "Adicionar aos favoritos";
    }
    btnFavorito.addEventListener("click", () => {
      if (btnFavorito){
        btnFavoritoTexto.innerHTML = "Adicionar aos favoritos";
      }
      adicionarFavoritos(cao);
    });
  }
}

function criarMensagemSucesso(msg, color) {
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

function mostrarToasters() {
  let toasters = document.querySelectorAll(".toast");
  toasters.forEach((toast) => {
    let bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    setTimeout(() => {
      toast.remove();
    }, 3000);
  });
}

function limparLocalStorage() {
  localStorage.removeItem("caesFavoritos");
  criarMensagemSucesso("Favoritos limpos com sucesso!", "danger");
}

function listarFavoritos() {
  let caesFavoritos = obterCaesFavoritos();
  let containerCaes = document.querySelector(".dogsWrap");

  if (caesFavoritos.length == 0) {
    containerCaes.innerHTML = `
    <div class="col-12 text-center">
      <h1 class="text-danger">Nenhum cão favorito encontrado!</h1>
    </div>`;
  } else {
    containerCaes.innerHTML = "";
    caesFavoritos.forEach((cao) => {
      let card = criarCardFavoritos(cao);
      containerCaes.appendChild(card);
    });
  }
}

function criarCardFavoritos(dadosCao) {
  let imagemCao = verificarImagemCaoFavoritos(dadosCao);
  let btnFavoritos = document.createElement("button");
  let card = document.createElement("div");

  btnFavoritos.innerHTML = `<i class="fa-solid fa-heart"></i>`;
  btnFavoritos.setAttribute("id", "dog_" + dadosCao.id);
  btnFavoritos.classList.add(
    "btn",
    "btn-danger",
    "py-3",
    "w-25",
    "rounded-0",
    "border-2"
  );
  btnFavoritos.setAttribute("type", "button");
  btnFavoritos.addEventListener("click", () => {
    removerFavoritos(dadosCao, true);
  });

  card.setAttribute(
    "class",
    "col-md-6 col-lg-3 mt-3 d-flex align-items-stretch"
  );

  card.setAttribute("id", "dogCard_" + dadosCao.id);

  card.innerHTML = `
    <div class="card text-center h-100 rounded-0 border-0 dogsCard w-100 justify-content-between dogCard_${dadosCao.id}">
      <h5 class="card-header border-0 bg-dark text-bg-dark rounded-0 text-center rounded-top-3 py-3">
        ${dadosCao.name}
      </h5>
      <img class="card-img-top rounded-0" src="${imagemCao}" alt="Card image cap" />
      <div class="btn-group rounded-bottom-3 rounded-top-0 d-flex align-items-stretch cnt-btns" role="group" aria-label="Basic example">
        <a href="detalhes.html?id=${dadosCao.id}" target="_blank" class="btn btn-outline-dark text-uppercase py-3 w-100 rounded-0 border-2">
          ver detalhes
        </a>
      </div>
    </div>
  </div>
  `;
  card.querySelector(".cnt-btns").appendChild(btnFavoritos);
  return card;
}

function verificarImagemCaoFavoritos(dadosCao) {
  if (dadosCao.photos.length > 0) {
    return dadosCao.photos[0].large;
  } else {
    return "https://www.bohemianleviathan.com/wp-content/uploads/2022/09/dog-placeholder-500x500-1.png";
  }
}
