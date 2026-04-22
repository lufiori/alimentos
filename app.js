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

// cor bolinha
function corClassificacao(c){
  if(c==="bom") return "green";
  if(c==="moderado") return "orange";
  if(c==="evitar") return "red";
  return "gray";
}

// 🔥 CARREGAR (BLINDADO)
async function carregarAlimentos(){
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  try {
    const snap = await db.collection("alimentos").get();

    snap.forEach(doc=>{
      const i = doc.data() || {};

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><span class="bolinha" style="background:${corClassificacao(i.classificacao)}"></span></td>
        <td>${i.nome || "-"}</td>
        <td>${i.categoria || "-"}</td>
        <td>${i.energia_kcal ?? "-"}</td>
        <td>${i.carboidrato ?? "-"}</td>
        <td>${i.proteina ?? "-"}</td>
        <td>${i.gordura ?? "-"}</td>
        <td>${i.fibra ?? "-"}</td>
        <td>${i.colesterol ?? "-"}</td>
        <td>${i.calcio ?? "-"}</td>
        <td>${i.sodio ?? "-"}</td>
        <td>${i.magnesio ?? "-"}</td>
        <td>${i.porcao || "-"}</td>
      `;

      tr.onclick = () => {
        idSelecionado = doc.id;
        preencherCampos(i);
        mostrarDetalhe(i);
      };

      lista.appendChild(tr);
    });

  } catch (e) {
    alert("Erro ao carregar dados 😢");
    console.error(e);
  }
}

// DETALHE
function mostrarDetalhe(i){
  document.getElementById("detNome").innerText = i.nome || "-";

  document.getElementById("detInfo").innerHTML = `
    Categoria: ${i.categoria || "-"}<br>
    Porção: ${i.porcao || "-"}<br><br>

    Kcal: ${i.energia_kcal ?? "-"}<br>
    Carboidrato: ${i.carboidrato ?? "-"}<br>
    Proteína: ${i.proteina ?? "-"}<br>
    Gordura: ${i.gordura ?? "-"}<br>
    Fibra: ${i.fibra ?? "-"}<br>
    Colesterol: ${i.colesterol ?? "-"}<br><br>

    Cálcio: ${i.calcio ?? "-"}<br>
    Sódio: ${i.sodio ?? "-"}<br>
    Magnésio: ${i.magnesio ?? "-"}
  `;
}

// PEGAR FORM
function pegarCampos(){
  return {
    nome: nome.value || "",
    categoria: categoria.value || "",
    porcao: porcao.value || "100g",
    energia_kcal: Number(energia_kcal.value) || 0,
    carboidrato: Number(carboidrato.value) || 0,
    proteina: Number(proteina.value) || 0,
    gordura: Number(gordura.value) || 0,
    fibra: Number(fibra.value) || 0,
    colesterol: Number(colesterol.value) || 0,
    calcio: Number(calcio.value) || 0,
    sodio: Number(sodio.value) || 0,
    magnesio: Number(magnesio.value) || 0,
    classificacao: classificacao.value || "moderado"
  };
}

// PREENCHER
function preencherCampos(i){
  nome.value = i.nome || "";
  categoria.value = i.categoria || "";
  porcao.value = i.porcao || "";
  energia_kcal.value = i.energia_kcal || 0;
  carboidrato.value = i.carboidrato || 0;
  proteina.value = i.proteina || 0;
  gordura.value = i.gordura || 0;
  fibra.value = i.fibra || 0;
  colesterol.value = i.colesterol || 0;
  calcio.value = i.calcio || 0;
  sodio.value = i.sodio || 0;
  magnesio.value = i.magnesio || 0;
}

// CRUD
async function incluir(){
  const d = pegarCampos();
  const id = d.nome.toLowerCase().replace(/\s+/g,"_");
  await db.collection("alimentos").doc(id).set(d, { merge:true });
  limpar();
  carregarAlimentos();
}

async function alterar(){
  if(!idSelecionado) return alert("Selecione!");
  await db.collection("alimentos").doc(idSelecionado).update(pegarCampos());
  limpar();
  carregarAlimentos();
}

async function excluir(){
  if(!idSelecionado) return alert("Selecione!");
  await db.collection("alimentos").doc(idSelecionado).delete();
  limpar();
  carregarAlimentos();
}

function limpar(){
  document.querySelectorAll("input").forEach(i=>i.value="");
  idSelecionado=null;
}

// BUSCAR (SEGURA)
async function buscar(){
  const t = (busca.value || "").toLowerCase();
  const lista = document.getElementById("lista");
  lista.innerHTML="";

  const snap = await db.collection("alimentos").get();

  snap.forEach(doc=>{
    const i = doc.data() || {};

    if((i.nome || "").toLowerCase().includes(t)){
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td></td>
        <td>${i.nome || "-"}</td>
        <td>${i.energia_kcal ?? "-"}</td>
      `;
      lista.appendChild(tr);
    }
  });
}

// IMPORTAR BASE
async function importarBaseGrande(){
  const r = await fetch("base500.json");
  const dados = await r.json();

  const chunk = 50;

  for(let i=0;i<dados.length;i+=chunk){
    const batch = db.batch();

    dados.slice(i,i+chunk).forEach(item=>{
      const id = item.nome.toLowerCase().replace(/\s+/g,"_");
      const ref = db.collection("alimentos").doc(id);
      batch.set(ref,item,{merge:true});
    });

    await batch.commit();
  }

  alert("Base importada!");
  carregarAlimentos();
}

// LIMPAR BASE
async function limparBase(){
  if (!confirm("Apagar tudo?")) return;

  const snap = await db.collection("alimentos").get();

  let batch = db.batch();
  let count = 0;

  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    count++;

    if (count === 50) {
      await batch.commit();
      batch = db.batch();
      count = 0;
    }
  }

  if (count > 0) await batch.commit();

  alert("Base limpa!");
  carregarAlimentos();
}


async function importarBase(nomeArquivo){
  try {

    const response = await fetch(nomeArquivo);

    if (!response.ok) {
      alert("❌ Não encontrou o arquivo: " + nomeArquivo);
      return;
    }

    const dados = await response.json();

    for (let i = 0; i < dados.length; i += 50) {
      const batch = db.batch();

      dados.slice(i, i + 50).forEach(item => {
        const id = (item.nome || "sem_nome")
          .toLowerCase()
          .replace(/\s+/g, "_");

        const ref = db.collection("alimentos").doc(id);
        batch.set(ref, item, { merge: true });
      });

      await batch.commit();
    }

    alert("✅ " + nomeArquivo + " importado!");
    carregarAlimentos();

  } catch (e) {
    console.error(e);
    alert("❌ Erro ao importar. Provável problema com arquivo JSON.");
  }
}



async function importarBaseFULL(){
  try {

    const url = "https://raw.githubusercontent.com/rafaeloliveira-nutri/taco-json/master/taco.json";

    const response = await fetch(url);

    if (!response.ok) {
      alert("Erro ao acessar a base online 😢");
      return;
    }

    const dados = await response.json();

    const chunk = 50;

    for (let i = 0; i < dados.length; i += chunk) {
      const batch = db.batch();

      dados.slice(i, i + chunk).forEach(item => {

        const nome = item.nome || item.descricao || "sem_nome";

        const id = nome.toLowerCase().replace(/\s+/g, "_");

        const ref = db.collection("alimentos").doc(id);

        batch.set(ref, {
          nome: nome,
          categoria: item.grupo || "Outros",
          porcao: "100g",
          energia_kcal: item.energia_kcal || 0,
          proteina: item.proteina_g || 0,
          gordura: item.lipideos_g || 0,
          carboidrato: item.carboidrato_g || 0,
          fibra: item.fibra_g || 0,
          colesterol: item.colesterol_mg || 0,
          calcio: item.calcio_mg || 0,
          ferro: item.ferro_mg || 0,
          sodio: item.sodio_mg || 0,
          potassio: item.potassio_mg || 0,
          classificacao: "moderado"
        }, { merge: true });

      });

      await batch.commit();
    }

    alert("🚀 BASE FULL IMPORTADA!");
    carregarAlimentos();

  } catch (e) {
    console.error(e);
    alert("Erro geral 😢 me chama que resolvo contigo");
  }
}



async function normalizarBanco() {
  const snapshot = await db.collection("alimentos").get();

  for (let i = 0; i < snapshot.docs.length; i += 50) {
    const batch = db.batch();

    snapshot.docs.slice(i, i + 50).forEach(doc => {
      const item = doc.data();

      const modelo = {
        nome: item.nome || "",
        categoria: item.categoria || "",
        porcao: item.porcao || "100g",

        energia_kcal: item.energia_kcal || item.calorias || 0,
        carboidrato: item.carboidrato || 0,
        proteina: item.proteina || 0,
        gordura: item.gordura || 0,
        fibra: item.fibra || 0,

        calcio: item.calcio || 0,
        ferro: item.ferro || 0,
        magnesio: item.magnesio || 0,
        fosforo: item.fosforo || 0,
        potassio: item.potassio || 0,
        sodio: item.sodio || 0,
        zinco: item.zinco || 0,

        vitamina_a: item.vitamina_a || 0,
        vitamina_c: item.vitamina_c || 0,
        vitamina_d: item.vitamina_d || 0,
        vitamina_e: item.vitamina_e || 0,
        vitamina_k: item.vitamina_k || 0,
        vitamina_b1: item.vitamina_b1 || 0,
        vitamina_b2: item.vitamina_b2 || 0,
        vitamina_b3: item.vitamina_b3 || 0,
        vitamina_b6: item.vitamina_b6 || 0,
        vitamina_b12: item.vitamina_b12 || 0,

        colesterol: item.colesterol || 0,

        classificacao: item.classificacao || "moderado"
      };

      batch.set(doc.ref, modelo, { merge: true });
    });

    await batch.commit();
  }

  alert("🔥 Banco normalizado com sucesso!");
  carregarAlimentos();
}




// START
carregarAlimentos();
