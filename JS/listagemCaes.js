const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJIZjkxNEJPTmR1cXlyWnZmRHMxU1VYYzNqQ2Z4ZUtwQUFXYXVidFpPMmU2ZzBGYUJjTyIsImp0aSI6ImFhYWM3NjVhODZkMWYxYWMyNzcwZDMyZmY5Y2MwMmM2YWQyZDRhOTAxZWY1ODk1NjFlNjdlY2Q2ODcwN2MyN2Y1NjViNGRlOWQzN2U5NWE1IiwiaWF0IjoxNzA1NzA4NjE5LCJuYmYiOjE3MDU3MDg2MTksImV4cCI6MTcwNTcxMjIxOSwic3ViIjoiIiwic2NvcGVzIjpbXX0.pdazVqnfgtPtTKOF4dQf6po5EAa-G6-f-e6vH19U8fRP2yDHrqVZAod4bnbibPlo5gG1UBeuy5SrQXfOqdKHQCkRnCSpBGrxqrOZrRKiXNmsid1Q8bss9tSyEpu9pDdVMDpfLNt5wetyE4Ps1vuAAbmyLeFx2Db6p6kdfEwWXmM57SyXTSz6MCawWabiOVqXr_b8QXWOgDSqQgKFhcRLsx5I-L1rLxaLim1a2912fWD6C_v_oYdVTPuCQMad4wJgpG-odMp2d0jsl9STZUtYhUGDmBoqf2B7T_iasCYUcpNFCR43KRepu89XZAdEaxkvLUxeVKgKNjLgpzZjv2G6Lw";
const apiEndPoint = "https://api.petfinder.com/v2/animals?type=dog&limit=8";

const numeroItensPaginacao = 5;

$(document).ready(function () {
  listarCaes(0);
});

function listarCaes(indice) {
  let link = apiEndPoint;

  if (indice > 1) {
    link = apiEndPoint + "&page=" + indice; //se o indice for maior que 1, adicionar o indice ao link
  }

  $(".dogsWrap").empty();
  $.ajax({
    url: link,
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`, //adicionar o token de acesso ao header do pedido
    },
  }).always(function (data, textStatus) {
    //always é executado sempre que o pedido ajax é concluído, independentemente de ter sido bem sucedido ou não
    console.log(textStatus);
    if (textStatus == "success") {
      $.each(data.animals, function (index, dog) {
        //percorrer o array de cães e criar um card para cada um
        console.log(dog);
        var card = criarCard(dog);
        $(".dogsWrap").append(card);
      });
      paginarCaes(data.pagination); //paginar os cães com base na informação de paginação obtida no pedido ajax
    } else {
      criarMensagemErro(
        "Não foi possível carregar os dados dos cães.",
        "dogsWrap"
      );
    }
  });
}

function criarCard(dadosCao) {
  let imagemCao = verificarImagemCao(dadosCao);
  let caoFavorito = verificarCaoFavorito(dadosCao.id);
  let btnFavoritos = document.createElement("button");
  let card = document.createElement("div");
  btnFavoritos.innerHTML = `<i class="fa-solid fa-heart"></i>`;
  btnFavoritos.setAttribute("id", "dogBtn_" + dadosCao.id);

  if (caoFavorito) {
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
      removerFavoritos(dadosCao);
    });
  } else {
    btnFavoritos.classList.add(
      "btn",
      "btn-outline-danger",
      "py-3",
      "w-25",
      "rounded-0",
      "border-2"
    );
    btnFavoritos.setAttribute("type", "button");
    btnFavoritos.addEventListener("click", () => {
      adicionarFavoritos(dadosCao);
    });
  }

  card.setAttribute(
    "class",
    "col-md-6 col-lg-3 mt-3  d-flex align-items-stretch"
  );
  card.innerHTML = `
    <div class="card text-center h-100 rounded-0 border-0 dogsCard  w-100 justify-content-between dogCard_${dadosCao.id} ">
      <h5
        class="card-header border-0 bg-dark text-bg-dark rounded-0 text-center rounded-top-3 py-3"
      >
      ${dadosCao.name}
      </h5>
      <img
        class="card-img-top rounded-0"
        src="${imagemCao}"
        alt="Imagem do cão"
      />
      <div
        class="btn-group rounded-bottom-3 rounded-top-0 d-flex align-items-stretch cnt-btns"
        role="group"
        aria-label="Basic example"
      >
        <a href="detalhes.html?id=${dadosCao.id}" target="_blank"
          class="btn btn-outline-dark text-uppercase py-3 w-100 rounded-0 border-2"
        >
          ver detalhes
        </a>
      </div>
    </div>
  </div>
    `;
  card.querySelector(".cnt-btns").appendChild(btnFavoritos);
  return card;
}

function verificarImagemCao(dadosCao) {
  //verificar se o cão tem uma imagem associada
  if (dadosCao.photos.length > 0) {
    return dadosCao.photos[0].large;
  } else {
    return "https://www.bohemianleviathan.com/wp-content/uploads/2022/09/dog-placeholder-500x500-1.png";
  }
}

function paginarCaes(dadosPaginacao) {
  let total_paginas = dadosPaginacao.total_pages;
  let pagina_atual = dadosPaginacao.current_page;

  $(".containerPaginacao").empty();
  $(".containerPaginacao").append(containerPaginacaoOriginal());

  const divPaginacao = document.querySelector(".containerPaginacao");

  const containerAnterior = divPaginacao.querySelector(".previous");
  const btnAnterior = containerAnterior.querySelector(".btnPrevious");

  const containerProximo = divPaginacao.querySelector(".next");
  const btnProximo = containerProximo.querySelector(".btnNext");

  let elementoPaginacao;

  if (pagina_atual > 1) {
    btnAnterior.classList.remove("disabled");
    btnAnterior.addEventListener("click", () => {
      listarCaes(pagina_atual - 1);
    });
  } else {
    btnAnterior.classList.add("disabled");
  }

  const paginaInicial = Math.max(
    1,
    pagina_atual - Math.floor(numeroItensPaginacao / 2)
  ); //Math.max retorna o maior valor entre os dois valores passados como parâmetro
  const paginaFinal = Math.min(
    total_paginas,
    paginaInicial + numeroItensPaginacao - 1
  ); //Math.min retorna o menor valor entre os dois valores passados como parâmetro

  for (let i = paginaInicial; i <= paginaFinal; i++) {
    elementoPaginacao = criarElementosPaginacao(i);
    if (i === pagina_atual) {
      elementoPaginacao.classList.add("active"); //adicionar a classe active ao elemento de paginação que corresponde à página atual
    }
    divPaginacao.insertBefore(elementoPaginacao, containerProximo); //inserir o elemento de paginação antes do botão de paginação seguinte
    elementoPaginacao.addEventListener("click", () => {
      listarCaes(i);
    });
  }

  if (pagina_atual < total_paginas) {
    //se a página atual for menor que o total de páginas, adicionar o evento de click ao botão de paginação seguinte
    btnProximo.classList.remove("disabled"); //remover a classe disabled do botão de paginação seguinte
    btnProximo.addEventListener("click", () => {
      listarCaes(pagina_atual + 1);
    });
  } else {
    btnProximo.classList.add("disabled");
  }
}

function containerPaginacaoOriginal() {
  const containerPaginacao = `         
  <li class="page-item previous">
  <a class="page-link btnPrevious" href="#" aria-label="Anterior">
    <span aria-hidden="true">&laquo;</span>
  </a>
</li>
<li class="page-item next">
  <a class="page-link btnNext" href="#" aria-label="Próxima">
    <span aria-hidden="true">&raquo;</span>
  </a>
</li>
  `;
  return containerPaginacao;
}

function criarElementosPaginacao(numero) {
  const elemento = document.createElement("li");
  elemento.classList.add("page-item");
  elemento.innerHTML = `<a class="page-link" href="#">${numero}</a>`;
  return elemento;
}
