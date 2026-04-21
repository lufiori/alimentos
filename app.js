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


// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🔎 Buscar alimentos
async function carregarAlimentos() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snapshot = await db.collection("alimentos").get();

  snapshot.forEach(doc => {
    const item = doc.data();

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.nome}</strong><br>
      Calorias: ${item.calorias} kcal<br>
      Proteína: ${item.proteina} g<br>
      Gordura: ${item.gordura} g<br>
      -------------------------
    `;

    lista.appendChild(li);
  });
}

// 🔍 Função de busca simples
async function buscar() {
  const texto = document.getElementById("busca").value.toLowerCase();
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snapshot = await db.collection("alimentos").get();

  snapshot.forEach(doc => {
    const item = doc.data();

    if (item.nome.toLowerCase().includes(texto)) {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${item.nome}</strong><br>
        Calorias: ${item.calorias} kcal<br>
        Proteína: ${item.proteina} g<br>
        Gordura: ${item.gordura} g<br>
        -------------------------
      `;
      lista.appendChild(li);
    }
  });
}


// Carregar ao abrir
carregarAlimentos();

async function adicionarExemplo() {
  try {
    await db.collection("alimentos").add({
      nome: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      categoria: "Frutas",
      calorias: 89,
      proteina: 1.1,
      carboidrato: 23,
      gordura: 0.3,
      fibra: 2.6,
      colesterol: 0,
      porcao: "100g",
      classificacao: "bom"
    });

    alert("🔥 Funcionou! Alimento adicionado!");
    carregarAlimentos(); // atualiza a lista
  } catch (erro) {
    console.error(erro);
    alert("❌ Deu erro (abre o console F12)");
  }
}


let idSelecionado = null;

// 👉 INCLUIR
async function incluir() {
  const nome = document.getElementById("nome").value;

  const dados = {
    nome: nome,
    calorias: Number(document.getElementById("calorias").value),
    proteina: Number(document.getElementById("proteina").value),
    gordura: Number(document.getElementById("gordura").value)
  };

  const doc = await db.collection("alimentos").add(dados);

  document.getElementById("status").innerText = "✅ Incluído!";
  limparCampos();
  carregarAlimentos();
}

// 👉 ALTERAR
async function alterar() {
  if (!idSelecionado) {
    alert("Selecione um item primeiro!");
    return;
  }

  await db.collection("alimentos").doc(idSelecionado).update({
    nome: document.getElementById("nome").value,
    calorias: Number(document.getElementById("calorias").value),
    proteina: Number(document.getElementById("proteina").value),
    gordura: Number(document.getElementById("gordura").value)
  });

  document.getElementById("status").innerText = "✏️ Alterado!";
  limparCampos();
  carregarAlimentos();
}

// 👉 EXCLUIR
async function excluir() {
  if (!idSelecionado) {
    alert("Selecione um item primeiro!");
    return;
  }

  await db.collection("alimentos").doc(idSelecionado).delete();

  document.getElementById("status").innerText = "🗑️ Excluído!";
  limparCampos();
  carregarAlimentos();
}

// 👉 selecionar item da lista
function selecionar(id, item) {
  idSelecionado = id;

  document.getElementById("nome").value = item.nome;
  document.getElementById("calorias").value = item.calorias;
  document.getElementById("proteina").value = item.proteina;
  document.getElementById("gordura").value = item.gordura;
}

// 👉 limpar campos
function limparCampos() {
  idSelecionado = null;
  document.getElementById("nome").value = "";
  document.getElementById("calorias").value = "";
  document.getElementById("proteina").value = "";
  document.getElementById("gordura").value = "";
}


