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

function corClassificacao(c) {
  if (c === "bom") return "green";
  if (c === "moderado") return "orange";
  if (c === "evitar") return "red";
  return "gray";
}

// LISTAR
async function carregarAlimentos() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snap = await db.collection("alimentos").get();

  snap.forEach(doc => {
    const item = doc.data();

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><span class="bolinha" style="background:${corClassificacao(item.classificacao)}"></span></td>
      <td>${item.nome}</td>
      <td>${item.energia_kcal}</td>
      <td>${item.proteina}</td>
      <td>${item.gordura}</td>
    `;

    tr.onclick = () => {
      idSelecionado = doc.id;
      mostrarDetalhe(item);
      preencherCampos(item);
    };

    lista.appendChild(tr);
  });
}

// DETALHE
function mostrarDetalhe(item) {
  const d = document.getElementById("detalhe");
  d.style.display = "block";

  d.innerHTML = `
    <h2>${item.nome}</h2>
    <p><b>Categoria:</b> ${item.categoria}</p>
    <hr>
    <div class="grid-detalhe">
      <div>Kcal: ${item.energia_kcal}</div>
      <div>Carb: ${item.carboidrato}</div>
      <div>Prot: ${item.proteina}</div>
      <div>Gord: ${item.gordura}</div>
      <div>Fibra: ${item.fibra}</div>
      <div>Colest: ${item.colesterol}</div>
      <div>Cálcio: ${item.calcio}</div>
      <div>Sódio: ${item.sodio}</div>
      <div>Magnésio: ${item.magnesio}</div>
    </div>
  `;
}

// CRUD
async function incluir() {
  const dados = pegarCampos();
  await db.collection("alimentos").add(dados);
  limpar();
  carregarAlimentos();
}

async function alterar() {
  if (!idSelecionado) return alert("Selecione um item");
  await db.collection("alimentos").doc(idSelecionado).update(pegarCampos());
  limpar();
  carregarAlimentos();
}

async function excluir() {
  if (!idSelecionado) return alert("Selecione um item");
  await db.collection("alimentos").doc(idSelecionado).delete();
  limpar();
  carregarAlimentos();
}

// FORM
function pegarCampos() {
  return {
    nome: nome.value,
    categoria: categoria.value,
    porcao: porcao.value,
    energia_kcal: Number(energia_kcal.value),
    carboidrato: Number(carboidrato.value),
    proteina: Number(proteina.value),
    gordura: Number(gordura.value),
    fibra: Number(fibra.value),
    colesterol: Number(colesterol.value),
    calcio: Number(calcio.value),
    sodio: Number(sodio.value),
    magnesio: Number(magnesio.value),
    classificacao: classificacao.value
  };
}

function preencherCampos(i) {
  nome.value = i.nome;
}

function limpar() {
  document.querySelectorAll("input").forEach(i => i.value = "");
  idSelecionado = null;
}

// BUSCA
async function buscar() {
  const texto = busca.value.toLowerCase();
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snap = await db.collection("alimentos").get();

  snap.forEach(doc => {
    const item = doc.data();
    if (item.nome.toLowerCase().includes(texto)) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td></td><td>${item.nome}</td><td>${item.energia_kcal}</td>`;
      lista.appendChild(tr);
    }
  });
}

// BASE PRONTA
async function carregarBase() {
  const base = [
    {nome:"Abacate",categoria:"Frutas",energia_kcal:96,carboidrato:6,proteina:1.2,gordura:8.4,fibra:6,calcio:8,sodio:1,magnesio:29,colesterol:0,classificacao:"bom"},
    {nome:"Arroz",categoria:"Grãos",energia_kcal:130,carboidrato:28,proteina:2.5,gordura:0.3,fibra:0.4,calcio:10,sodio:1,magnesio:12,colesterol:0,classificacao:"moderado"},
    {nome:"Frango",categoria:"Carnes",energia_kcal:165,carboidrato:0,proteina:31,gordura:3.6,fibra:0,calcio:15,sodio:74,magnesio:25,colesterol:85,classificacao:"bom"}
  ];

  for (const a of base) {
    await db.collection("alimentos").add(a);
  }

  carregarAlimentos();
  alert("Base carregada!");
}

// INIT
carregarAlimentos();
