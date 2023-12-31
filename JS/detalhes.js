const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJIZjkxNEJPTmR1cXlyWnZmRHMxU1VYYzNqQ2Z4ZUtwQUFXYXVidFpPMmU2ZzBGYUJjTyIsImp0aSI6ImVmNjY1OTlmOGI4NTRiZWIzMWJiZjc5OGU2MzgyMDMxZWY3MDg5ZTAxNTdmNjZlMjFjMmE4MmFhOTUwMWQ0M2U3NjUzZGIwOWEwNjAxNjc5IiwiaWF0IjoxNzAzOTkzNDQwLCJuYmYiOjE3MDM5OTM0NDAsImV4cCI6MTcwMzk5NzA0MCwic3ViIjoiIiwic2NvcGVzIjpbXX0.CjzSUE_mG4xTpgC_7dut2YFd-NuFf5rwhq-xr3J-DKAHck3MHA7Q7FWmN7ysiPFLP08HSV6IoY6LoAOiIlhXSOlRAxJg6_NFTgGvyGDwBTRTgLY8bKS2JVYnlMW74_JdARQWU5VV5N2lYBgN0M-jCIo1xyALXOrLF4Y8q_5PE1m1OsF2U3wTNWFxloIFfbXoUymLuKVBpWG8Z17kQsenSszNMQXJqeXH_a7Mo5AJeMAqkiXGDwzbns6Og3TC_plELTOPsfMW940OhX02AhElNscjIRYCcstdihcXDIl8E8zK2xcDBBhx2bT4DCfuzyadwEdOMiw6AhucYv4SbjMwNA";
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
  let imagem = criaContainerImagem(data.photos,data.description);
  let btnFavoritos = CriarDetalhesFavorito(data);
  let tabelaAtributos = criarTabelAtributos(data);
  let divTags = criarContainerTags(data.tags);

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
  $(".dogsDataWrap").append(tabelaAtributos);
  $(".dogsDataWrap").append(divTags);
  $(".dogsDataWrap").append(btnFavoritos);
}

function criaContainerImagem(photos, descricao) {
  if (photos.length > 0) {
    let containerImagem = document.createElement("div");
    containerImagem.setAttribute("class", "col-md-6 offset-md-3 mb-3 d-flex justify-content-center");

    let containerP = document.createElement("div");
    containerP.setAttribute("class","text-center");

    let image = document.createElement("img");
    let photo = photos[Math.floor(Math.random() * photos.length)];
    let photoMaior = photo.full || photo.large || photo.medium || photo.small;
    image.src = photoMaior;
    image.alt = "Imagem do cão";
    image.setAttribute("class", "img-fluid rounded detailsDogImage");

    containerP.appendChild(image);

    if (descricao && descricao.length > 0) {
      let desc = document.createElement("p");
      desc.textContent = descricao;
      desc.setAttribute("class", "mt-3 text-muted fw-light fs-3");
      containerP.appendChild(desc);
    }

    containerImagem.appendChild(containerP);

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
  btnFavoritos.innerHTML = `<i class="fa-solid fa-heart me-1"></i>`;
  


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

function criarTabelAtributos(data)
{
  console.log(data);
  let tabela = document.createElement("div");
  tabela.classList.add("table-responsive");
  tabela.innerHTML = `
  <div class="d-flex justify-content-center mb-2 text-bg-danger py-2 rounded  rounded-2 mt-3">
    <h2>Atributos:</h2>
  </div>
  <table class="table table-hover table-bordered">
  <thead class="table-dark">
    <tr>
      <th scope="col">Esterilizado/Castrado</th>
      <th scope="col">Treinado(a) para a Casa</th>
      <th scope="col">Sem Unhas</th>
      <th scope="col">Necessidades especiais</th>
      <th scope="col">Vacinado</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${ObterIndicadorAtributo(data.attributes.spayed_neutered)}</td>
      <td>${ObterIndicadorAtributo(data.attributes.house_trained)}</td>
      <td>${ObterIndicadorAtributo(data.attributes.declawed)}</td>
      <td>${ObterIndicadorAtributo(data.attributes.special_needs)}</td>
      <td>${ObterIndicadorAtributo(data.attributes.shots_current)}</td>
    </tr>
  </tbody>
</table>
  `;
  return tabela;
}
function ObterIndicadorAtributo(atributo) {
  let indicador;
  switch (atributo) {
    case true:
      indicador = `<i class="fas fa-check text-success"></i>`;
      break;
    case false:
      indicador = `<i class="fas fa-times text-danger"></i>`;
      break;
    default:
      indicador = `<i class="fas fa-question text-warning"></i>`;
      break;
  }
  return indicador;
}

function criarContainerTags(tags){
  let containerTags = document.createElement("div");
  let elementoTag;
  containerTags.setAttribute("class","mt-1");
  if (tags.length > 0) {
    tags.forEach(tag => {
      elementoTag = document.createElement("span");
      elementoTag.setAttribute("class","badge bg-primary me-1 py-2");
      elementoTag.textContent = tag;
      containerTags.appendChild(elementoTag);
    });
  }
  return containerTags;
}


