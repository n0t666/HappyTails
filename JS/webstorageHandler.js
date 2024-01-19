
function adicionarFavoritos(cao) {
  let caesFavoritos = obterCaesFavoritos();

  if (!verificarCaoFavorito(cao.id)) {
    caesFavoritos.push(cao); //adicionar o cão aos favoritos
    localStorage.setItem("caesFavoritos", JSON.stringify(caesFavoritos)); //guardar o cão nos favoritos
    criarMensagemSucesso(
      "Cão adicionado aos favoritos com sucesso!",
      "success"
    );
    updateIconeFavorito(cao, true); //atualizar o icone de favoritos
  }
}

//função para remover cão dos favoritos
function removerFavoritos(cao, removerPermanente = false) {
  let caesFavoritos = obterCaesFavoritos();
  if (verificarCaoFavorito(cao.id)) {
    caesFavoritos = caesFavoritos.filter((caes) => caes.id != cao.id); //remover o cão dos favoritos filtrando os cães que não tem o id do cão que queremos remover
    localStorage.setItem("caesFavoritos", JSON.stringify(caesFavoritos));
    criarMensagemSucesso("Cão removido dos favoritos com sucesso!", "danger");
    if (removerPermanente) { 
      $(".dogCard_" + cao.id).fadeOut(300, function () { //remover o card do cão da lista de favoritos com uma animação de fadeout
        $(this).remove();
      });
    } else {
      updateIconeFavorito(cao, false);
    }
  }
}

//função para obter os cães favoritos
function obterCaesFavoritos() {
  let favoritos = JSON.parse(localStorage.getItem("caesFavoritos")); //obter os cães favoritos do localstorage
  if (favoritos == null) { //se não existirem cães favoritos, criar um array vazio
    favoritos = [];
  }
  return favoritos;
}

//função para obter um cão especifico
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

//função para atualizar o icone de favoritos quando o cão é adicionado ou removido dos favoritos, tem como parametro o cão e um booleano que indica se o cão está ou não nos favoritos
function updateIconeFavorito(cao, favorito) {
  let btnFavorito = document.getElementById("dogBtn_" + cao.id);
  let btnFavoritoTexto = btnFavorito.querySelector(".textoFavorito");
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

//função para criar notificação de sucesso ou erro (toaster), tem como parametro a mensagem e a cor da notificação (sucess para sucesso e danger para erro)
function criarMensagemSucesso(msg, color) {
  const containerMensagens = document.querySelector(".toast-container"); //obter o container das mensagens do tipo stack (acumulam-se umas em cima das outras)
  let mensagem;

  //Se existir o container das mensagens, criar a mensagem
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

  mostrarToasters(); //mostrar a mensagem que é eliminada passados 3 segundos
}

function mostrarToasters() {
  let toasters = document.querySelectorAll(".toast"); //obter todas os toasters
  toasters.forEach((toast) => { //para cada toaster, mostrar e eliminar passados 3 segundos
    let bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    setTimeout(() => {
      toast.remove();
    }, 3000);
  });
}

//função para limpar os favoritos
function limparLocalStorage() {
  localStorage.removeItem("caesFavoritos");
  criarMensagemSucesso("Favoritos limpos com sucesso!", "danger");
}

//função para listar os cães favoritos
function listarFavoritos() {
  let caesFavoritos = obterCaesFavoritos();
  let containerCaes = document.querySelector(".dogsWrap"); //obter o container onde vão ser colocados os cães favoritos

  if (caesFavoritos.length == 0) { //se não existirem cães favoritos, mostrar uma mensagem de erro
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

//função para criar o card de um cão favorito
function criarCardFavoritos(dadosCao) {
  let imagemCao = verificarImagemCaoFavoritos(dadosCao);
  let btnFavoritos = document.createElement("button");
  let card = document.createElement("div");

  btnFavoritos.innerHTML = `<i class="fa-solid fa-heart"></i>`; //criar o botão de favoritos
  btnFavoritos.setAttribute("id", "dog_" + dadosCao.id); //atribuir um id ao botão de favoritos para depois ser possivel alterar o seu conteudo
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

//função para verificar se o cão tem imagem, se não tiver, colocar uma imagem placeholder
function verificarImagemCaoFavoritos(dadosCao) {
  if (dadosCao.photos.length > 0) {
    return dadosCao.photos[0].large;
  } else {
    return "DogShelter/Images/place_holder_dog_cards.png";
  }
}

function adicionarNomeAnimal(nome){
  let animaisAdotados = obterAnimaisAdotados();
  id = animaisAdotados.length + 1;
  animaisAdotados.push({nome: nome, id: id});
  localStorage.setItem("animaisAdotados", JSON.stringify(animaisAdotados));
}

function verificarAnimaisAdotados(nome){
  let animaisAdotados = obterAnimaisAdotados();
  let animal = animaisAdotados.find((animal) => animal.nome == nome);
  if (animal != null) {
    return true;
  }
  return false;
}

function obterAnimaisAdotados(){
  let animais = JSON.parse(localStorage.getItem("animaisAdotados"));
  if (animais == null) {
    animais = [];
  }
  return animais;
}

//função para criar mensagem de erro
function criarMensagemErro(mensagem,target) {
  const mensagemErro = `
    <div class="alert alert-danger py-5 text-center fs-1" role="alert">
    <i class=bi bi-exclamation"></i>
        ${mensagem}
    </div>
  `;
  $("." + target).append(mensagemErro);
}

//função para remover animal da lista de animais adotados
function removerAnimal(nome,id){
  let animaisAdotados = obterAnimaisAdotados();
  if (verificarAnimaisAdotados(nome)) {
    animaisAdotados = animaisAdotados.filter((animal) => animal.id != id); // Remove o animal da lista de animais adotados
    localStorage.setItem("animaisAdotados", JSON.stringify(animaisAdotados));
    criarMensagemSucesso("Animal removido com sucesso!", "danger");
    $(".dog_" + id).fadeOut(300, function () {
      $(this).remove();
    });
  }

}
