const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJIZjkxNEJPTmR1cXlyWnZmRHMxU1VYYzNqQ2Z4ZUtwQUFXYXVidFpPMmU2ZzBGYUJjTyIsImp0aSI6ImQ2YTZiZjBhZDFkY2M5ZWZiNGMxZDUxM2E3MTlhYjhhZGI2MTA0ZTYyNTNjYTVmM2U0NmZkMWFiYzYwZjY1MjE3NDgwZGVhZWE1MDU0MjBmIiwiaWF0IjoxNzAzMTg5MDcxLCJuYmYiOjE3MDMxODkwNzEsImV4cCI6MTcwMzE5MjY3MSwic3ViIjoiIiwic2NvcGVzIjpbXX0.y6A5LllTMHHs5zrhElskqqSNJ0xOesQWzm85d8ixwgm3HkTMObzPWmTBjvmQ96OFwmmwUkPNuITSdHIxl_X0B7XsN7vnWux7Dr1b5t6iaD7D66iOJky8x7toJ4SmJHhNcF-HvHB_fcAxIitMPl8rMUB6z2O5LBVct-C3ooDckw3L8sHHAmMBu1hAap-AD_J5bLueGhXJvrf8FFM5tdLg5R7Od2UKLhB5hEgTCEz7CBf5LVQCs80CXVdH81zMRSPOxCJqWncjBSWDpjrWuRcg15Pmvn4uJGcLc_YYLYnJPgmYFkHvTuCKAKcsUHN2qNwPvJTWM8cVlO8NEc1SML5pAQ";
const apiEndPoint = "https://api.petfinder.com/v2/animals?type=dog&limit=8";
let indice_pagina = 0;

$(document).ready(function () {
  listarCaes(2);
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

function listarCaes(indice) 
{
  let link = apiEndPoint;

  if(indice >1){
    link  = apiEndPoint + "&page=" + indice;
  }
  console.log(link);
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


