const firebaseConfig = {
  apiKey: "SUA CHAVE",
  authDomain: "receitas-da-lu-44637.firebaseapp.com",
  projectId: "receitas-da-lu-44637",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let idSelecionado = null;

// 🔥 CARREGAR (ordenado)
async function carregarAlimentos() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snapshot = await db.collection("alimentos")
    .orderBy("nome")
    .get();

  snapshot.forEach(doc => {
    const item = doc.data();

    let cor = "gray";
    if (item.classificacao === "bom") cor = "green";
    if (item.classificacao === "moderado") cor = "orange";
    if (item.classificacao === "evitar") cor = "red";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><span class="bolinha" style="background:${cor}"></span></td>
      <td>${item.nome}</td>
      <td>${item.calorias}</td>
      <td>${item.proteina}</td>
      <td>${item.gordura}</td>
      <td>${item.classificacao || "-"}</td>
    `;

    tr.onclick = () => selecionar(doc.id, item);

    lista.appendChild(tr);
  });
}

// 🔍 BUSCAR (corrigido)
async function buscar() {
  const texto = document.getElementById("busca").value.toLowerCase();
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snapshot = await db.collection("alimentos").get();

  snapshot.forEach(doc => {
    const item = doc.data();

    if (item.nome.toLowerCase().includes(texto)) {

      let cor = "gray";
      if (item.classificacao === "bom") cor = "green";
      if (item.classificacao === "moderado") cor = "orange";
      if (item.classificacao === "evitar") cor = "red";

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><span class="bolinha" style="background:${cor}"></span></td>
        <td>${item.nome}</td>
        <td>${item.calorias}</td>
        <td>${item.proteina}</td>
        <td>${item.gordura}</td>
        <td>${item.classificacao || "-"}</td>
      `;

      tr.onclick = () => selecionar(doc.id, item);

      lista.appendChild(tr);
    }
  });
}

// ➕ INCLUIR
async function incluir() {
  const dados = {
    nome: document.getElementById("nome").value,
    calorias: Number(document.getElementById("calorias").value),
    proteina: Number(document.getElementById("proteina").value),
    gordura: Number(document.getElementById("gordura").value),
    classificacao: document.getElementById("classificacao").value || "moderado"
  };

  await db.collection("alimentos").add(dados);

  document.getElementById("status").innerText = "✅ Incluído!";
  limparCampos();
  carregarAlimentos();
}

// ✏️ ALTERAR
async function alterar() {
  if (!idSelecionado) {
    alert("Selecione um item!");
    return;
  }

  await db.collection("alimentos").doc(idSelecionado).update({
    nome: document.getElementById("nome").value,
    calorias: Number(document.getElementById("calorias").value),
    proteina: Number(document.getElementById("proteina").value),
    gordura: Number(document.getElementById("gordura").value),
    classificacao: document.getElementById("classificacao").value
  });

  document.getElementById("status").innerText = "✏️ Alterado!";
  limparCampos();
  carregarAlimentos();
}

// 🗑️ EXCLUIR
async function excluir() {
  if (!idSelecionado) {
    alert("Selecione um item!");
    return;
  }

  await db.collection("alimentos").doc(idSelecionado).delete();

  document.getElementById("status").innerText = "🗑️ Excluído!";
  limparCampos();
  carregarAlimentos();
}

// 👉 selecionar
function selecionar(id, item) {
  idSelecionado = id;

  document.getElementById("nome").value = item.nome;
  document.getElementById("calorias").value = item.calorias;
  document.getElementById("proteina").value = item.proteina;
  document.getElementById("gordura").value = item.gordura;
  document.getElementById("classificacao").value = item.classificacao || "moderado";
}

// 👉 limpar
function limparCampos() {
  idSelecionado = null;

  document.getElementById("nome").value = "";
  document.getElementById("calorias").value = "";
  document.getElementById("proteina").value = "";
  document.getElementById("gordura").value = "";
}

// 🚀 iniciar
carregarAlimentos();
