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

function corClassificacao(c){
  if(c==="bom") return "green";
  if(c==="moderado") return "orange";
  if(c==="evitar") return "red";
  return "gray";
}

// LISTAR
async function carregarAlimentos(){
  const lista = document.getElementById("lista");
  lista.innerHTML="";

  const snap = await db.collection("alimentos").get();

  snap.forEach(doc=>{
    const i = doc.data();

    const tr = document.createElement("tr");

    tr.innerHTML=`
      <td><span class="bolinha" style="background:${corClassificacao(i.classificacao)}"></span></td>
      <td>${i.nome||""}</td>
      <td>${i.categoria||""}</td>
      <td>${i.energia_kcal||0}</td>
      <td>${i.carboidrato||0}</td>
      <td>${i.proteina||0}</td>
      <td>${i.gordura||0}</td>
      <td>${i.fibra||0}</td>
      <td>${i.colesterol||0}</td>
      <td>${i.calcio||0}</td>
      <td>${i.sodio||0}</td>
      <td>${i.magnesio||0}</td>
      <td>${i.porcao||""}</td>
    `;

    tr.onclick=()=>{
      idSelecionado = doc.id;
      preencherCampos(i);
      mostrarDetalhe(i);
    };

    lista.appendChild(tr);
  });
}

// DETALHE
function mostrarDetalhe(i){
  const d = document.getElementById("detalhe");
  d.style.display="block";

  d.innerHTML=`
    <h2>${i.nome}</h2>
    <p><b>Categoria:</b> ${i.categoria}</p>
    <hr>
    <div class="grid-detalhe">
      <div>Kcal: ${i.energia_kcal}</div>
      <div>Carboidrato: ${i.carboidrato}</div>
      <div>Proteína: ${i.proteina}</div>
      <div>Gordura: ${i.gordura}</div>
      <div>Fibra: ${i.fibra}</div>
      <div>Colesterol: ${i.colesterol}</div>
      <div>Cálcio: ${i.calcio}</div>
      <div>Sódio: ${i.sodio}</div>
      <div>Magnésio: ${i.magnesio}</div>
    </div>
  `;
}

// FORM
function pegarCampos(){
  return{
    nome:nome.value,
    categoria:categoria.value,
    porcao:porcao.value,
    energia_kcal:Number(energia_kcal.value),
    carboidrato:Number(carboidrato.value),
    proteina:Number(proteina.value),
    gordura:Number(gordura.value),
    fibra:Number(fibra.value),
    colesterol:Number(colesterol.value),
    calcio:Number(calcio.value),
    sodio:Number(sodio.value),
    magnesio:Number(magnesio.value),
    classificacao:classificacao.value
  };
}

function preencherCampos(i){
  nome.value=i.nome||"";
  categoria.value=i.categoria||"";
  porcao.value=i.porcao||"";
  energia_kcal.value=i.energia_kcal||0;
  carboidrato.value=i.carboidrato||0;
  proteina.value=i.proteina||0;
  gordura.value=i.gordura||0;
  fibra.value=i.fibra||0;
  colesterol.value=i.colesterol||0;
  calcio.value=i.calcio||0;
  sodio.value=i.sodio||0;
  magnesio.value=i.magnesio||0;
}

// CRUD
async function incluir(){
  await db.collection("alimentos").add(pegarCampos());
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

// BUSCA
async function buscar(){
  const t = busca.value.toLowerCase();
  const lista = document.getElementById("lista");
  lista.innerHTML="";

  const snap = await db.collection("alimentos").get();

  snap.forEach(doc=>{
    const i = doc.data();
    if(i.nome.toLowerCase().includes(t)){
      const tr=document.createElement("tr");
      tr.innerHTML=`<td></td><td>${i.nome}</td><td>${i.energia_kcal}</td>`;
      lista.appendChild(tr);
    }
  });
}

// IMPORTAR BASE
async function importarBaseGrande() {
  const r = await fetch("base500.json");
  const dados = await r.json();

  const chunkSize = 50;

  for (let i = 0; i < dados.length; i += chunkSize) {
    const batch = db.batch();

    dados.slice(i, i + chunkSize).forEach(item => {
      const ref = db.collection("alimentos").doc();
      batch.set(ref, item);
    });

    await batch.commit();
  }

  alert("Base grande importada!");
  carregarAlimentos();
}

// INIT
carregarAlimentos();
