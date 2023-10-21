function comprar(event) {
  event.preventDefault();
  const elemento_pai = document.getElementById("p_1");
  const preco = parseFloat(elemento_pai.querySelector(".preco").innerHTML);
  const quantidade = elemento_pai.querySelector(".quantidade").value;
  const titulo = elemento_pai.querySelector(".card-title").innerHTML;
  const total = (preco * quantidade).toFixed(2);
  const output = `Foram adquiridas ${quantidade} unidade(s) de "${titulo}" pelo valor total de ${total} Euros.`;
  console.log(output);
  $("#precoJanela").modal("show");
  document
    .getElementById("precoJanela")
    .querySelector(".texto-principal").innerHTML = output;
}

function fecharJanela() {
    $("#precoJanela").modal("hide");
}
