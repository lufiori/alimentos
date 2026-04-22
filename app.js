// 🔥 COLE AQUI SUA CONFIG DO FIREBASE

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9qmb14pgL6lb1ows_RYK_PAyiowocsq0",
  authDomain: "receitas-da-lu-44637.firebaseapp.com",
  projectId: "receitas-da-lu-44637",
  storageBucket: "receitas-da-lu-44637.firebasestorage.app",
  messagingSenderId: "860073650852",
  appId: "1:860073650852:web:db47e9b82dfccc2e859431",
  measurementId: "G-PPTQ4Y39FZ"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let idSelecionado = null;

// 🔥 CARREGAR
async function carregarAlimentos() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snapshot = await db.collection("alimentos").orderBy("nome").get();

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
      <td>${item.categoria}</td>
      <td>${item.calorias}</td>
      <td>${item.carboidrato}</td>
      <td>${item.proteina}</td>
      <td>${item.gordura}</td>
      <td>${item.fibra}</td>
      <td>${item.colesterol}</td>
      <td>${item.porcao}</td>
    `;

    tr.onclick = () => selecionar(doc.id, item);

    lista.appendChild(tr);
  });
}

// 🔍 BUSCAR
async function buscar() {
  const texto = document.getElementById("busca").value.toLowerCase();
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snapshot = await db.collection("alimentos").get();

  snapshot.forEach(doc => {
    const item = doc.data();

    if (item.nome.toLowerCase().includes(texto)) {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td></td>
        <td>${item.nome}</td>
        <td>${item.categoria}</td>
        <td>${item.calorias}</td>
        <td>${item.carboidrato}</td>
        <td>${item.proteina}</td>
        <td>${item.gordura}</td>
        <td>${item.fibra}</td>
        <td>${item.colesterol}</td>
        <td>${item.porcao}</td>
      `;

      tr.onclick = () => selecionar(doc.id, item);

      lista.appendChild(tr);
    }
  });
}

// ➕ INCLUIR
async function incluir() {
  const dados = pegarDados();
  await db.collection("alimentos").add(dados);

  document.getElementById("status").innerText = "✅ Incluído!";
  limparCampos();
  carregarAlimentos();
}

// ✏️ ALTERAR
async function alterar() {
  if (!idSelecionado) return alert("Selecione um item");

  await db.collection("alimentos").doc(idSelecionado).update(pegarDados());

  document.getElementById("status").innerText = "✏️ Alterado!";
  limparCampos();
  carregarAlimentos();
}

// 🗑️ EXCLUIR
async function excluir() {
  if (!idSelecionado) return alert("Selecione um item");

  await db.collection("alimentos").doc(idSelecionado).delete();

  document.getElementById("status").innerText = "🗑️ Excluído!";
  limparCampos();
  carregarAlimentos();
}

// 📥 pegar dados
function pegarDados() {
  return {
    nome: nome.value,
    categoria: categoria.value,
    porcao: porcao.value,
    calorias: Number(calorias.value),
    carboidrato: Number(carboidrato.value),
    proteina: Number(proteina.value),
    gordura: Number(gordura.value),
    fibra: Number(fibra.value),
    colesterol: Number(colesterol.value),
    classificacao: classificacao.value || "moderado"
  };
}

// 👉 selecionar
function selecionar(id, item) {
  idSelecionado = id;

  nome.value = item.nome;
  categoria.value = item.categoria;
  porcao.value = item.porcao;
  calorias.value = item.calorias;
  carboidrato.value = item.carboidrato;
  proteina.value = item.proteina;
  gordura.value = item.gordura;
  fibra.value = item.fibra;
  colesterol.value = item.colesterol;
  classificacao.value = item.classificacao || "moderado";
}

// 👉 limpar
function limparCampos() {
  idSelecionado = null;
  document.querySelectorAll("input").forEach(i => i.value = "");
}

// 🚀 iniciar
carregarAlimentos();



async function atualizarCampos() {
  const snapshot = await db.collection("alimentos").get();

  snapshot.forEach(async (doc) => {
    await db.collection("alimentos").doc(doc.id).update({
      energia_kcal: 0,
      energia_kj: 0,
      carboidrato: 0,
      proteina: 0,
      gordura: 0,
      fibra: 0,
      colesterol: 0,
      calcio: 0,
      magnesio: 0,
      ferro: 0,
      sodio: 0,
      cinzas: 0,
      umidade: 0
    });
  });

  alert("Campos adicionados!");
}



