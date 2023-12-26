const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJIZjkxNEJPTmR1cXlyWnZmRHMxU1VYYzNqQ2Z4ZUtwQUFXYXVidFpPMmU2ZzBGYUJjTyIsImp0aSI6ImQwMDcyYzg2M2ZkMWI5M2EwYWZjN2Y2YjNiMTJmZmY0OTBlZTA2ZmZjM2RhODFkZjI3YjdjZDdkMjJmOWEzZmMyZWMwZDg4OGUxNDNhZjY4IiwiaWF0IjoxNzAzNjAxMDI1LCJuYmYiOjE3MDM2MDEwMjUsImV4cCI6MTcwMzYwNDYyNSwic3ViIjoiIiwic2NvcGVzIjpbXX0.T4tAgMdPRXd2YMw-bR923UAvqwLbm8QYa7SMOAN0Y_MtclVSliTvABBbI5Mo44Thy4KRRF-fVklLoDiWeYHjwT2X2JBFf3POysh-JKQi7DaN2gSCRQGGUS6LTlu54efo2IbYNUBgGWFwKeDuOq0BoTZRejphMzzRWD1ftN45GfTUqirkctKnkD_EABYbDNZuLaCeA02eVKyeuVYzmb54fMH3sc6wB98p_HNC7cUmsxc48iUychuqtu571vO8OpMcYkyrV8HNzEFuDmo_quDb6QOfv2uYSNcB4CVAr1P_IHU_gOfaEo7CWA8a1k4pbWVvvEqih8JQj7kko7oumr-MUQ";
const queryString = window.location.search;
const paramsUrl = new URLSearchParams(queryString);
const apiEndPoint = "https://api.petfinder.com/v2/animals/";

$(document).ready(function () {
  if (paramsUrl.has("id")) {
    let id = paramsUrl.get("id");
    if (id) {
      if (obterCaoEspecifico(id)) {
        cao = obterCaoEspecifico(id);
        document.title = document.title + " " + cao.name;
        criarTabelaDados(cao);
      } else {
        procurarCao(id);
      }
    } else {
      criarMensagemErro("O cão necessita de um ID válido.");
    }
  } else {
    criarMensagemErro("Não foi possível obter o cão correspondente.");
  }
});

function procurarCao(id) {
  $.ajax({
    url: apiEndPoint + id,
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).always(function (data, textStatus) {
    if (textStatus == "success") {
      document.title = document.title + " " + data.animal.name;
      criarTabelaDados(data.animal);
    } else {
      criarMensagemErro("Não foi possível carregar os dados do cão.");
    }
  });
}

function criarMensagemErro(mensagem) {
  const mensagemErro = `
    <div class="alert alert-danger py-5 text-center fs-1" role="alert">
    <i class=bi bi-exclamation"></i>
        ${mensagem}
    </div>
  `;
  $(".dogsDataWrap").append(mensagemErro);
}

function criarTabelaDados(data) {
  let tabela = document.createElement("div");
  let imagem = criaContainerImagem(data.photos);
  let btnFavoritos = CriarDetalhesFavorito(data);
  tabela.classList.add("table-responsive");
  tabela.innerHTML = `
  <div class="d-flex justify-content-center mb-2 text-bg-danger py-2 rounded  rounded-2 ">
    <h2>Detalhes gerais:</h2>
  </div>
  <table class="table table-hover table-bordered">
  <thead class="table-dark">
    <tr>
      <th scope="col">Nome</th>
      <th scope="col">Idade</th>
      <th scope="col">Raça</th>
      <th scope="col">Tamanho</th>
      <th scope="col">Cor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${data.name}</td>
      <td>${data.age}</td>
      <td>${data.breeds.primary}</td>
      <td>${data.size}</td>
      <td>${data.colors.primary}</td>
    </tr>
  </tbody>
</table>
  `;
  $(".dogsDataWrap").append(imagem);
  $(".dogsDataWrap").append(tabela);
  $(".dogsDataWrap").append(btnFavoritos);
}

function criaContainerImagem(photos) {
  if (photos.length > 0) {
    let containerImagem = document.createElement("div");
    let photo = photos[Math.floor(Math.random() * photos.length)];
    let photoMaior = photo.full || photo.large || photo.medium || photo.small;

    containerImagem.innerHTML = `
    <div class="col-md-6 offset-md-3 mb-3 d-flex justify-content-center">
    <img src="${photoMaior}" alt="Imagem do cão" class="img-fluid rounded detailsDogImage">
    </div`;
    return containerImagem;
  }
}

function CriarDetalhesFavorito(dadosCao) {
  let caoFavorito = verificarCaoFavorito(dadosCao.id);
  let btnFavoritos = document.createElement("button");
  let btnFavoritosContainer = document.createElement("div");

  btnFavoritosContainer.setAttribute(
    "class",
    "mt-3 mb-3 d-flex justify-content-center"
  );

  btnFavoritos.setAttribute(
    "class",
    "btn py-3 rounded-0 border-2 fs-3"
  );
  btnFavoritos.setAttribute("type", "button");
  btnFavoritos.setAttribute("id", 'dogBtn_' + dadosCao.id);
  btnFavoritos.innerHTML = `<i class="fa-solid fa-heart"></i>`;
  


  if (caoFavorito) {
    btnFavoritos.classList.add("btn-danger");
    btnFavoritos.innerHTML += `<span class="textoFavorito">Remover dos favoritos</span>`;
    btnFavoritos.addEventListener("click", () => {
      removerFavoritos(dadosCao);
    });
  } else {
    btnFavoritos.classList.add("btn-outline-danger");
    btnFavoritos.innerHTML += `<span class="textoFavorito">Adicionar aos favoritos</span>`;
    btnFavoritos.addEventListener("click", () => {
      adicionarFavoritos(dadosCao);
    });
  }

  btnFavoritosContainer.appendChild(btnFavoritos);
  return btnFavoritosContainer;
}

