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





async function carregarBase() {
  if (!confirm("Isso vai adicionar vários alimentos. Continuar?")) return;

  const alimentos = [
    { nome: "Arroz branco", categoria: "Grãos", calorias: 130, carboidrato: 28, proteina: 2.5, gordura: 0.3, fibra: 0.4, colesterol: 0, porcao: "100g", classificacao: "moderado" },
    { nome: "Feijão", categoria: "Leguminosas", calorias: 76, carboidrato: 14, proteina: 5, gordura: 0.5, fibra: 8, colesterol: 0, porcao: "100g", classificacao: "bom" },
    { nome: "Frango grelhado", categoria: "Carnes", calorias: 165, carboidrato: 0, proteina: 31, gordura: 3.6, fibra: 0, colesterol: 85, porcao: "100g", classificacao: "bom" },
    { nome: "Carne bovina", categoria: "Carnes", calorias: 250, carboidrato: 0, proteina: 26, gordura: 15, fibra: 0, colesterol: 90, porcao: "100g", classificacao: "moderado" },
    { nome: "Ovo", categoria: "Proteínas", calorias: 155, carboidrato: 1.1, proteina: 13, gordura: 11, fibra: 0, colesterol: 373, porcao: "100g", classificacao: "moderado" },
    { nome: "Leite integral", categoria: "Laticínios", calorias: 60, carboidrato: 5, proteina: 3.2, gordura: 3.3, fibra: 0, colesterol: 10, porcao: "100ml", classificacao: "moderado" },
    { nome: "Maçã", categoria: "Frutas", calorias: 52, carboidrato: 14, proteina: 0.3, gordura: 0.2, fibra: 2.4, colesterol: 0, porcao: "100g", classificacao: "bom" },
    { nome: "Banana", categoria: "Frutas", calorias: 89, carboidrato: 23, proteina: 1.1, gordura: 0.3, fibra: 2.6, colesterol: 0, porcao: "100g", classificacao: "bom" },
    { nome: "Batata", categoria: "Tubérculos", calorias: 77, carboidrato: 17, proteina: 2, gordura: 0.1, fibra: 2.2, colesterol: 0, porcao: "100g", classificacao: "moderado" },
    { nome: "Brócolis", categoria: "Vegetais", calorias: 34, carboidrato: 7, proteina: 2.8, gordura: 0.4, fibra: 2.6, colesterol: 0, porcao: "100g", classificacao: "bom" },

    { nome: "Cenoura", categoria: "Vegetais", calorias: 41, carboidrato: 10, proteina: 0.9, gordura: 0.2, fibra: 2.8, colesterol: 0, porcao: "100g", classificacao: "bom" },
    { nome: "Alface", categoria: "Vegetais", calorias: 15, carboidrato: 3, proteina: 1.4, gordura: 0.2, fibra: 1.3, colesterol: 0, porcao: "100g", classificacao: "bom" },
    { nome: "Tomate", categoria: "Vegetais", calorias: 18, carboidrato: 4, proteina: 0.9, gordura: 0.2, fibra: 1.2, colesterol: 0, porcao: "100g", classificacao: "bom" },
    { nome: "Queijo", categoria: "Laticínios", calorias: 402, carboidrato: 1.3, proteina: 25, gordura: 33, fibra: 0, colesterol: 105, porcao: "100g", classificacao: "evitar" },
    { nome: "Manteiga", categoria: "Gorduras", calorias: 717, carboidrato: 0, proteina: 0.9, gordura: 81, fibra: 0, colesterol: 215, porcao: "100g", classificacao: "evitar" },
    { nome: "Azeite", categoria: "Gorduras", calorias: 884, carboidrato: 0, proteina: 0, gordura: 100, fibra: 0, colesterol: 0, porcao: "100g", classificacao: "moderado" },
    { nome: "Pão francês", categoria: "Padaria", calorias: 265, carboidrato: 49, proteina: 9, gordura: 3.2, fibra: 2.7, colesterol: 0, porcao: "100g", classificacao: "moderado" },
    { nome: "Macarrão", categoria: "Massas", calorias: 131, carboidrato: 25, proteina: 5, gordura: 1.1, fibra: 1.8, colesterol: 0, porcao: "100g", classificacao: "moderado" },
    { nome: "Chocolate", categoria: "Doces", calorias: 546, carboidrato: 61, proteina: 4.9, gordura: 31, fibra: 7, colesterol: 8, porcao: "100g", classificacao: "evitar" },
    { nome: "Refrigerante", categoria: "Bebidas", calorias: 41, carboidrato: 10, proteina: 0, gordura: 0, fibra: 0, colesterol: 0, porcao: "100ml", classificacao: "evitar" },

    { nome: "Suco natural", categoria: "Bebidas", calorias: 45, carboidrato: 11, proteina: 0.5, gordura: 0.1, fibra: 0.5, colesterol: 0, porcao: "100ml", classificacao: "bom" },
    { nome: "Iogurte", categoria: "Laticínios", calorias: 59, carboidrato: 3.6, proteina: 10, gordura: 0.4, fibra: 0, colesterol: 5, porcao: "100g", classificacao: "bom" },
    { nome: "Peixe", categoria: "Carnes", calorias: 206, carboidrato: 0, proteina: 22, gordura: 12, fibra: 0, colesterol: 63, porcao: "100g", classificacao: "bom" },
    { nome: "Atum", categoria: "Carnes", calorias: 132, carboidrato: 0, proteina: 28, gordura: 1, fibra: 0, colesterol: 47, porcao: "100g", classificacao: "bom" },
    { nome: "Presunto", categoria: "Carnes", calorias: 145, carboidrato: 1.5, proteina: 21, gordura: 6, fibra: 0, colesterol: 53, porcao: "100g", classificacao: "evitar" },
    { nome: "Salsicha", categoria: "Carnes", calorias: 300, carboidrato: 2, proteina: 12, gordura: 27, fibra: 0, colesterol: 80, porcao: "100g", classificacao: "evitar" },

    { nome: "Milho", categoria: "Grãos", calorias: 86, carboidrato: 19, proteina: 3.2, gordura: 1.2, fibra: 2.7, colesterol: 0, porcao: "100g", classificacao: "moderado" },
    { nome: "Aveia", categoria: "Grãos", calorias: 389, carboidrato: 66, proteina: 17, gordura: 7, fibra: 11, colesterol: 0, porcao: "100g", classificacao: "bom" },
    { nome: "Granola", categoria: "Grãos", calorias: 471, carboidrato: 64, proteina: 10, gordura: 20, fibra: 7, colesterol: 0, porcao: "100g", classificacao: "moderado" },
    { nome: "Mel", categoria: "Doces", calorias: 304, carboidrato: 82, proteina: 0.3, gordura: 0, fibra: 0.2, colesterol: 0, porcao: "100g", classificacao: "moderado" },
    { nome: "Açúcar", categoria: "Doces", calorias: 387, carboidrato: 100, proteina: 0, gordura: 0, fibra: 0, colesterol: 0, porcao: "100g", classificacao: "evitar" }
  ];

  for (const item of alimentos) {
    await db.collection("alimentos").add(item);
  }

  alert("🔥 Base carregada com sucesso!");
  carregarAlimentos();
}


