const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJIZjkxNEJPTmR1cXlyWnZmRHMxU1VYYzNqQ2Z4ZUtwQUFXYXVidFpPMmU2ZzBGYUJjTyIsImp0aSI6IjE0NGZlODNhNDgzZjdhYWI1ZDM1MzNjMmU3MDc5Y2ZlZmU3ZDQ1MTI2NmYyN2EzNThlM2Y1Zjg0ZjcwMGJkZTIxYjllMjFhYWY2NTEzNDVjIiwiaWF0IjoxNzAzNTU3MTUyLCJuYmYiOjE3MDM1NTcxNTIsImV4cCI6MTcwMzU2MDc1Miwic3ViIjoiIiwic2NvcGVzIjpbXX0.mDrsyT6i0GepZ7ID_2iQmDks_vZcmKep5ieSDaLT-tLKfL0G22xeCSc_6rCwbNfjvEEN-nujCoe_ecghyLUqVdNlmsyhvndxcYkNV0gz3gSeSwxoNGn9VWubhyvavTgxO2gY_Dyhun1FrqStER6sEnfhwmdfB8utSGrUpTjBa_wP3jModc6blCY8NqnOeGOhAQLorIDZ1VJ6IFz9w73pT8floeCEhHrxtTc42bXGYyOUtYZn56i3Wxmde3UMCaTWQmpzaatK5JPHAWCN8h6Zl9XM61EXcd3kNXsxMJQxtekshX_riFUOSDNeQB4iwhOK-2XDOH4oy8dZiVKh9X97yw";

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
