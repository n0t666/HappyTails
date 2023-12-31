const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJIZjkxNEJPTmR1cXlyWnZmRHMxU1VYYzNqQ2Z4ZUtwQUFXYXVidFpPMmU2ZzBGYUJjTyIsImp0aSI6ImVmNjY1OTlmOGI4NTRiZWIzMWJiZjc5OGU2MzgyMDMxZWY3MDg5ZTAxNTdmNjZlMjFjMmE4MmFhOTUwMWQ0M2U3NjUzZGIwOWEwNjAxNjc5IiwiaWF0IjoxNzAzOTkzNDQwLCJuYmYiOjE3MDM5OTM0NDAsImV4cCI6MTcwMzk5NzA0MCwic3ViIjoiIiwic2NvcGVzIjpbXX0.CjzSUE_mG4xTpgC_7dut2YFd-NuFf5rwhq-xr3J-DKAHck3MHA7Q7FWmN7ysiPFLP08HSV6IoY6LoAOiIlhXSOlRAxJg6_NFTgGvyGDwBTRTgLY8bKS2JVYnlMW74_JdARQWU5VV5N2lYBgN0M-jCIo1xyALXOrLF4Y8q_5PE1m1OsF2U3wTNWFxloIFfbXoUymLuKVBpWG8Z17kQsenSszNMQXJqeXH_a7Mo5AJeMAqkiXGDwzbns6Og3TC_plELTOPsfMW940OhX02AhElNscjIRYCcstdihcXDIl8E8zK2xcDBBhx2bT4DCfuzyadwEdOMiw6AhucYv4SbjMwNA";
const apiEndPoint = "https://api.petfinder.com/v2/animals?type=dog&limit=8";

const numeroItensPaginacao = 5;

$(document).ready(function () {
  listarCaes(0);
});

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
  let caoFavorito = verificarCaoFavorito(dadosCao.id);
  let btnFavoritos = document.createElement("button");
  let card = document.createElement("div");
  btnFavoritos.innerHTML = `<i class="fa-solid fa-heart"></i>`;
  btnFavoritos.setAttribute("id", 'dogBtn_' + dadosCao.id);


  if (caoFavorito){
    btnFavoritos.classList.add("btn", "btn-danger", "py-3", "w-25", "rounded-0", "border-2");
    btnFavoritos.setAttribute("type", "button");
    btnFavoritos.addEventListener("click", () => {
      removerFavoritos(dadosCao);
    });
  } else {
    btnFavoritos.classList.add("btn", "btn-outline-danger", "py-3", "w-25", "rounded-0", "border-2");
    btnFavoritos.setAttribute("type", "button");
    btnFavoritos.addEventListener("click", () => {
      adicionarFavoritos(dadosCao);
    });
  }

  card.setAttribute("class", "col-md-6 col-lg-3 mt-3  d-flex align-items-stretch");
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
        alt="Card image cap"
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
