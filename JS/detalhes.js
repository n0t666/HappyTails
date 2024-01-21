const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJIZjkxNEJPTmR1cXlyWnZmRHMxU1VYYzNqQ2Z4ZUtwQUFXYXVidFpPMmU2ZzBGYUJjTyIsImp0aSI6IjYzNzdlYjIyOGI4YTgyYjY5NTU5NTQzZjU4MGQxMDdmMzhjNTIxYWVhMzUzZDI3OTcxMzQ4MzQxMjA1OGZiNWUxMTRhOWUyNGE3OTdkMGVkIiwiaWF0IjoxNzA1ODcyMzExLCJuYmYiOjE3MDU4NzIzMTEsImV4cCI6MTcwNTg3NTkxMSwic3ViIjoiIiwic2NvcGVzIjpbXX0.XwbvIGoOGi5tLK0IIDSdxtFgBQJctQmFhC40ySN-A_bSVyubndu6VixS4LFkEhKrJAvWiLcybd2NfUYgoPMQJPLGcHR_WP6n4RxbV1xkvptoBoOOzmuDvxxH-oQfFrK8M9YbqnzvE9FVaf5a-xmT14DILOvJvHXB8kz52zJQHWbLzEgM4GNgbszcGZcKUX8d8FphrEDBXSdWdjS8K6qkwV7yA_SkcFe3PUjT2wOYnR7CYLFTl5YZNH4c2v2Ru-txL58icrc5qk0RGvdXhJDDRio9HXrc_7WaOL9ohdIQegWZAU-dr2pUetsq1RGC04uDUiNkZksCYUitNCEGfah0pQ";
const queryString = window.location.search; //obter os parametros passados na url
const paramsUrl = new URLSearchParams(queryString); //criar um objeto com os parametros passados na url
const apiEndPoint = "https://api.petfinder.com/v2/animals/"; //endpoint da api

$(document).ready(function () {
  //quando a página carregar
  if (paramsUrl.has("id")) {
    //se for passado por parametro o id do cão
    let id = paramsUrl.get("id");
    if (id) {
      if (obterCaoEspecifico(id)) {
        //verificar se o cão está guardado no localStorage, se estiver, obter os dados do localStorage, se não estiver, fazer um pedido à api
        cao = obterCaoEspecifico(id);
        document.title = document.title + " " + cao.name; //adicionar o nome do cão ao titulo da página
        criarTabelaDados(cao);
      } else {
        //se o cão não estiver guardado no localStorage, fazer um pedido à api para obter os dados do cão com o id passado por parametro através da url
        procurarCao(id);
      }
    } else {
      //se não for passado por parametro o id do cão
      criarMensagemErro("O cão necessita de um ID válido.", "dogsDataWrap");
    }
  } else {
    //se não for passado por parametro o id do cão
    criarMensagemErro(
      "Não foi possível obter o cão correspondente.",
      "dogsDataWrap"
    );
  }
});

function procurarCao(id) {
  //fazer um pedido à api para obter os dados do cão com o id passado por parametro através da url, ou seja, se não estiver guardado no localStorage
  $.ajax({
    url: apiEndPoint + id,
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).always(function (data, textStatus) {
    if (textStatus == "success") {
      //se o pedido for bem sucedido
      document.title = document.title + " " + data.animal.name;
      criarTabelaDados(data.animal);
    } else {
      //se o pedido não for bem sucedido
      criarMensagemErro(
        "Não foi possível carregar os dados do cão.",
        "dogsDataWrap"
      );
    }
  });
}

function criarTabelaDados(data) {
  let tabela = document.createElement("div");
  let imagem = criaContainerImagem(data.photos, data.description);
  let btnFavoritos = CriarDetalhesFavorito(data);
  let tabelaAtributos = criarTabelAtributos(data);
  let divTags = criarContainerTags(data.tags);

  //Criar a tabela com os dados do cão
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
  //criar o container com a imagem do cão e a descrição em baixo
  if (photos.length > 0) {
    //se o cão tiver fotos
    let containerImagem = document.createElement("div");
    containerImagem.setAttribute(
      "class",
      "col-md-6 offset-md-3 mb-3 d-flex justify-content-center"
    );

    let containerP = document.createElement("div");
    containerP.setAttribute("class", "text-center");

    let image = document.createElement("img");
    let photo = photos[Math.floor(Math.random() * photos.length)]; //obter uma foto aleatória do cão
    let photoMaior = photo.full || photo.large || photo.medium || photo.small; //obter a foto com a maior resolução possivel, se não houver, obter a proxima maior resolução
    image.src = photoMaior;
    image.alt = "Imagem do cão";
    image.setAttribute("class", "img-fluid rounded detailsDogImage");

    containerP.appendChild(image);

    if (descricao && descricao.length > 0) {
      //se o cão tiver descrição adicionar a descrição
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
  let caoFavorito = verificarCaoFavorito(dadosCao.id); //verificar se o cão está guardado nos favoritos
  let btnFavoritos = document.createElement("button"); //criar o botão de favoritos
  let btnFavoritosContainer = document.createElement("div");

  btnFavoritosContainer.setAttribute(
    "class",
    "mt-3 mb-3 d-flex justify-content-center"
  );

  btnFavoritos.setAttribute("class", "btn py-3 rounded-0 border-2 fs-3");
  btnFavoritos.setAttribute("type", "button");
  btnFavoritos.setAttribute("id", "dogBtn_" + dadosCao.id); //atribuir um id ao botão de favoritos para depois ser possivel alterar o seu conteudo
  btnFavoritos.innerHTML = `<i class="fa-solid fa-heart me-1"></i>`;

  if (caoFavorito) {
    btnFavoritos.classList.add("btn-danger");
    btnFavoritos.innerHTML += `<span class="textoFavorito">Remover dos favoritos</span>`;
    btnFavoritos.addEventListener("click", () => {
      //adicionar um evento de click ao botão de favoritos para remover o cão dos favoritos quando o botão for clicado
      removerFavoritos(dadosCao);
    });
  } else {
    btnFavoritos.classList.add("btn-outline-danger");
    btnFavoritos.innerHTML += `<span class="textoFavorito">Adicionar aos favoritos</span>`;
    btnFavoritos.addEventListener("click", () => {
      //adicionar um evento de click ao botão de favoritos para adicionar o cão aos favoritos quando o botão for clicado
      adicionarFavoritos(dadosCao);
    });
  }

  btnFavoritosContainer.appendChild(btnFavoritos);
  return btnFavoritosContainer;
}

function criarTabelAtributos(data) {
  let tabela = document.createElement("div");
  tabela.classList.add("table-responsive");
  //Criar a tabela com os dados do cão
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

//Função que retorna um indicador de acordo com o atributo passado por parametro
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

//Função que retorna um container com as tags do cão
function criarContainerTags(tags) {
  let containerTags = document.createElement("div");
  let elementoTag;
  containerTags.setAttribute("class", "mt-1");
  if (tags.length > 0) {
    //se o cão tiver tags
    tags.forEach((tag) => {
      elementoTag = document.createElement("span");
      elementoTag.setAttribute("class", "badge bg-primary me-1 py-2");
      elementoTag.textContent = tag;
      containerTags.appendChild(elementoTag);
    });
  }
  return containerTags;
}
