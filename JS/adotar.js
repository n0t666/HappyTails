$(document).ready(function () { //função para executar o código quando a página estiver pronta
  var form = document.getElementById("formAdotar");
  form.addEventListener("submit", function (event) { //função para executar o código quando o formulário for submetido
    event.preventDefault(); //impedir o formulário de ser submetido
    if (validarCheckboxes()) { //verificar se os checkboxes obrigatórios estão marcados com pelo menos uma opção
      nomeAnimal = $("#inputPetName").val(); //obter o nome do animal introduzido pelo utilizador
      if (nomeAnimal.length > 0) { 
        if (verificarAnimaisAdotados(nomeAnimal)) {
          criarMensagemSucesso("O animal já foi adotado!", "danger");
          console.log("erro");
        } else {
          adicionarNomeAnimal(nomeAnimal);
          criarMensagemSucesso("O animal foi adotado com sucesso!", "success");
          console.log("sucesso");
        }
      }
    } else {
      criarMensagemSucesso("Preencha todos os campos necessários!", "danger");
    }
  });
  if(obterAnimaisAdotados().length > 0){
    preencherLista();
  }
});

function validarCheckboxes() {
  const listaCheckboxesObrigatorias = []; // Array que armazena os nomes dos checkboxes obrigatórios
  let count = 0;
  let flag = false;

  // Obtem o atributo name de todos os checkboxes com a classe ch_obligatory
  document.querySelectorAll(".ch_obligatory").forEach((checkbox) => {
    listaCheckboxesObrigatorias.push(checkbox.name);
  });

  // Percorre a lista de checkboxes obrigatórios e verifica se pelo menos um deles está marcado
  listaCheckboxesObrigatorias.forEach((checkbox) => {
    if ($(`input[name="${checkbox}"]:checked`).length > 0) {
      count++;
    }
  });
  if (count === listaCheckboxesObrigatorias.length) {
    // Se todos os checkboxes obrigatórios estiverem marcados
    flag = true;
  }
  return flag;
}

function preencherLista() {
  let lista = document.getElementById("listaAnimaisAdotados");
  let animaisAdotados = obterAnimaisAdotados();
  animaisAdotados.forEach((animal) => {
    console.log(animal);
    let li = document.createElement("li");
    let btn = criarBotaoApagar();
    btn.addEventListener("click", () => {
      removerAnimal(animal.nome, animal.id);
    });
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center", "dog_" + animal.id);
    li.innerHTML = `
      ${animal.nome}
    `;
    li.appendChild(btn);
    lista.appendChild(li);
  });
}

function criarBotaoApagar(){
  let btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.setAttribute("class", "btn btn-outline-danger");
  btn.innerHTML = `
    <i class="fas fa-trash-alt"></i>
  `;
  return btn;
}