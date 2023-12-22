const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJIZjkxNEJPTmR1cXlyWnZmRHMxU1VYYzNqQ2Z4ZUtwQUFXYXVidFpPMmU2ZzBGYUJjTyIsImp0aSI6ImQ4Mjc3OTg0N2YzZWQyYjA4NTdlNWVlYmZlYjk0MmUwNzVjYTljMTU0YTNhMWU5MjU4OGE4ODk1MDkwMThkOWU1MzE4MWVhNmQ1MzA5YTIzIiwiaWF0IjoxNzAzMjI0ODI1LCJuYmYiOjE3MDMyMjQ4MjUsImV4cCI6MTcwMzIyODQyNSwic3ViIjoiIiwic2NvcGVzIjpbXX0.Fihejn49OGKkp_RxknW2wRc7XxcM2JhIOWBZ6PNBaFei4Hf-le-LAanrIyn7kaUCJE3pkVRdrtYNsIvLT24MRdqoy1kYY5QzAtuiLsVUX4XDmM-2UQHsTIEfzrxGzwq_ydjFrQdJRu5ZRFFp3Fj5iSMDmWadLJ-CNmmA-lGgo2PLc6-Lvu_bQ77TruzjtAkZwdlBdAztfWjE5xxUTrNsYUT20LWNTBJbgEjQpYkYzKKARFx-zD4ujzbtwCB_iTLUsnlR6oYwzI05e_adoHSpI8JUMKRnDcHpD7bmexQRPR2oaCHYzMcWq3OsIlKq6H1B7qlGYZ616n1Ej4NhbadwkQ";
const apiEndPoint = "https://api.petfinder.com/v2/animals?type=dog&limit=8";

const numeroItensPaginacao = 5;

$(document).ready(function () {
  listarCaes(0);
});

function fill(icon_element) {
  if (icon_element.classList.contains("btn-outline-danger")) {
    icon_element.classList.remove("btn-outline-danger");
    icon_element.classList.add("btn-danger");
  } else {
    icon_element.classList.remove("btn-danger");
    icon_element.classList.add("btn-outline-danger");
  }
}

function listarCaes(indice) {
  let link = apiEndPoint;

  if (indice > 1) {
    link = apiEndPoint + "&page=" + indice;
  }
  console.log("isto" + link);
  $(".dogsWrap").empty();
  $.ajax({
    url: link,
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).done(function (data) {
    console.log(data.pagination);
    $.each(data.animals, function (index, dog) {
      console.log(dog);
      var card = criarCard(dog);
      $(".dogsWrap").append(card);
    });
    paginarCaes(data.pagination);
  });
}

function criarCard(dadosCao) {
  let imagemCao = verificarImagemCao(dadosCao);
  const card = `
    <div class="col-md-6 col-lg-3 mt-3 d-flex align-items-stretch">
    <div class="card text-center h-100 rounded-0 border-0 dogsCard  w-100 ">
      <h5
        class="card-header border-0 bg-dark text-bg-dark rounded-0 text-center rounded-top-3 py-3"
      >
      ${dadosCao.name}
      </h5>
      <img
        class="card-img-top rounded-0"
        src="${imagemCao}"
        alt="Card image cap"
      />
      <div
        class="btn-group rounded-bottom-3 rounded-top-0 d-flex align-items-stretch"
        role="group"
        aria-label="Basic example"
      >
        <button
          class="btn btn-outline-dark text-uppercase py-3 w-100 rounded-0 border-2"
        >
          ver detalhes
        </button>
        <button
          type="button"
          class="btn btn-outline-danger py-3 w-25 rounded-0 border-2"
          onclick="fill(this)"
        >
          <i class="fa-solid fa-heart"></i>
        </button>
      </div>
    </div>
  </div>
    `;
  return card;
}

function verificarImagemCao(dadosCao) {
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
  );
  const paginaFinal = Math.min(
    total_paginas,
    paginaInicial + numeroItensPaginacao - 1
  );

  for (let i = paginaInicial; i <= paginaFinal; i++) {
    elementoPaginacao = criarElementosPaginacao(i);
    if (i === pagina_atual) {
      elementoPaginacao.classList.add("active");
    }
    divPaginacao.insertBefore(elementoPaginacao, containerProximo);
    elementoPaginacao.addEventListener("click", () => {
      listarCaes(i);
    });
  }

  if (pagina_atual < total_paginas) {
    btnProximo.classList.remove("disabled");
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
