const access_token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJIZjkxNEJPTmR1cXlyWnZmRHMxU1VYYzNqQ2Z4ZUtwQUFXYXVidFpPMmU2ZzBGYUJjTyIsImp0aSI6IjBiOTMxMGIyMjEwMzk1YTc3YjkzMjk5MTEwZjlkNGZkMDVjN2EwY2ZkOTJiNzZjZTg3OTBlNzNlYmU5MjRkOWMxNTg2NWYxMTViOWNiM2ZjIiwiaWF0IjoxNzAxMzY2NzI0LCJuYmYiOjE3MDEzNjY3MjQsImV4cCI6MTcwMTM3MDMyNCwic3ViIjoiIiwic2NvcGVzIjpbXX0.rL--nSKMpNK08sTECcGpEy7BMbyteuvgcNRc3JYA9njE1Kf81VWlO9YpooP22CSlVMNVjjDqc-hgfUJv-TqpH6vVyx9fTe-DdoKP-oq46mErsKgn4RJ_Zup8ADxhu222fVwi9D-wDKnGISyW26vctI4uEYqCq6VRrIR-58wipNHXM54kM0cFT0JCTD8uJwsVHfZk8jfPk9y4LwmgVMGOIfpU5w3cbM_6qKRt1mNs5XzTbNBBReJAzX37c3KmOyIUCuJq4_9XR0QsA_1zgB7XSDsvtH5hjjYzuYwgp5y_FDo5LMfodZNrNOmBgs60l7OnFhNaua1wUrWqrLgQkSSrGw";
const apiEndPoint = "https://api.petfinder.com/v2/animals?type=dog&limit=12";

$(document).ready(function () {
  listarCaes();
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

function listarCaes() {
  $(".dogsWrap").empty();
  $.ajax({
    url: apiEndPoint,
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
  });
}

function criarCard(dadosCao) {
  const card = `
    <div class="col-md-6 col-lg-3 mt-3">
    <div class="card text-center h-100 rounded-0 border-0 dogsCard">
      <h5
        class="card-header border-0 bg-dark text-bg-dark rounded-0 text-center rounded-top-3 py-3"
      >
      ${dadosCao.name}
      </h5>
      <img
        class="card-img-top rounded-0"
        src="../Images/dogs_template/dalmata.jpg"
        alt="Card image cap"
      />
      <div
        class="btn-group rounded-bottom-3 rounded-top-0"
        role="group"
        aria-label="Basic example"
      >
        <button
          class="btn btn-outline-dark text-uppercase py-3 w-100 rounded-0"
        >
          ver detalhes
        </button>
        <button
          type="button"
          class="btn btn-outline-danger py-3 w-25 rounded-0"
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
