const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJIZjkxNEJPTmR1cXlyWnZmRHMxU1VYYzNqQ2Z4ZUtwQUFXYXVidFpPMmU2ZzBGYUJjTyIsImp0aSI6IjdiNjgyMzZhYTFlM2RhNWZmNTIxMGVhZTYyM2M3ZjAxYTRjMDllNzIwM2E1MDFmMTZmZjRjYWMyM2ZhOTY4MmIwOTA3M2I4ZWM0Zjc4ZGNjIiwiaWF0IjoxNzAzMzcxODA1LCJuYmYiOjE3MDMzNzE4MDUsImV4cCI6MTcwMzM3NTQwNSwic3ViIjoiIiwic2NvcGVzIjpbXX0.PNwdiHr7otozfb4m5mB2hKA6fjf0mJXQ0SGWkdQbMVXMw33RIvx0KXBbWYC-qP_UJg_re7qhG7hZprrGHWH7twZ99kyqRKDkdhjYtdNHVCtVyQWlOVR4au8x-BvpfL-wwu-jnsFMKhXYiN9Gu2U_BP2CdNwug_V-TY21ZyYK12GTiX-HBcOa56JoTOYWDgRKWKjoovP04O8QvxYbo3eG4WlhBlEUzFH5E--13JZLfvF3iRe05aLbDyvZ3CptciUjqiLdcx5gP03uaJZXAuhjFnK7KWSQLBrxOTBtp7jW6QoTHuX7ANhKHGR0HzEWHBxzfT7uEYDIUbCOizxpWXbJIg";

const queryString = window.location.search;
const paramsUrl = new URLSearchParams(queryString);
const apiEndPoint = "https://api.petfinder.com/v2/animals/";

$(document).ready(function () {
  if (paramsUrl.has("id")) {
    let id = paramsUrl.get("id");
    console.log(id);
    if (id) {
      procurarCao(id);
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
      console.log(data);
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
  tabela.classList.add("table-responsive-sm");
  tabela.innerHTML = `
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
  $(".dogsDataWrap").append(tabela);
}
