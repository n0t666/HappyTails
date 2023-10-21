function comprar(event,id) {
  event.preventDefault();
  const elemento_pai = document.getElementById(`p_${id}`);
  const preco = parseFloat(elemento_pai.querySelector(".preco").innerHTML);
  const quantidade = elemento_pai.querySelector(".quantidade").value;
  const titulo = elemento_pai.querySelector(".card-title").innerHTML;
  const total = (preco * quantidade).toFixed(2);
  const output = `Foram adquiridas ${quantidade} unidade(s) de "${titulo}" pelo valor total de ${total} Euros.`;
  $("#precoJanela").modal("show");
  document.getElementById("precoJanela").querySelector(".texto-principal").innerHTML = output;
  elemento_pai.querySelector(".quantidade").value = '1';
}

// Função para esconder o modal do preço do produto
function fecharJanela() {
  $("#precoJanela").modal("hide");
}

