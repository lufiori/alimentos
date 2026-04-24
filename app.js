// 🔥 NÃO PRECISA MAIS inicializar Firebase aqui!
// Ele já vem do HTML

let idSelecionado = null;

// cor bolinha
function corClassificacao(c){
  if(c==="bom") return "green";
  if(c==="moderado") return "orange";
  if(c==="evitar") return "red";
  return "gray";
}

// 🔥 CARREGAR
async function carregarAlimentos(){
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  try {
    const snap = await getDocs(collection(db, "alimentos"));

    snap.forEach(docSnap=>{
      const i = docSnap.data();

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

      tr.onclick = () => abrirDetalhe(i);

      lista.appendChild(tr);
    });

  } catch (e) {
    alert("Erro ao carregar dados 😢");
    console.error(e);
  }
}

// 🔥 DETALHE
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

// 🔥 PEGAR FORM
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

// 🔥 CRUD

async function incluir(){
  const d = pegarCampos();
  const id = d.nome.toLowerCase().replace(/\s+/g,"_");

  await setDoc(doc(db, "alimentos", id), d, { merge: true });

  limpar();
  carregarAlimentos();
}

async function alterar(){
  if(!idSelecionado) return alert("Selecione!");

  await updateDoc(doc(db, "alimentos", idSelecionado), pegarCampos());

  limpar();
  carregarAlimentos();
}

async function excluir(){
  if(!idSelecionado) return alert("Selecione!");

  await deleteDoc(doc(db, "alimentos", idSelecionado));

  limpar();
  carregarAlimentos();
}

function limpar(){
  document.querySelectorAll("input").forEach(i=>i.value="");
  idSelecionado=null;
}

// 🔥 BUSCAR
async function buscar(){
  const t = (busca.value || "").toLowerCase();
  const lista = document.getElementById("lista");
  lista.innerHTML="";

  const snap = await getDocs(collection(db, "alimentos"));

  snap.forEach(docSnap=>{
    const i = docSnap.data();

    if((i.nome || "").toLowerCase().includes(t)){
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${i.nome}</td>
        <td>${i.energia_kcal ?? "-"}</td>
      `;

      lista.appendChild(tr);
    }
  });
}

// 🔥 CATEGORIA
let categoriaAtual = "";

function abrirCategoria(cat) {
  categoriaAtual = cat;

  document.getElementById("tela1").classList.remove("ativa");
  document.getElementById("tela2").classList.add("ativa");

  document.getElementById("tituloCategoria").innerText = cat;

  carregarCategoria();
}

function voltar() {
  document.getElementById("tela2").classList.remove("ativa");
  document.getElementById("tela1").classList.add("ativa");
}

async function carregarCategoria() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snap = await getDocs(collection(db, "alimentos"));

  snap.forEach(docSnap => {
    const item = docSnap.data();

    if (item.categoria === categoriaAtual) {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.energia_kcal || 0}</td>
        <td>${item.carboidrato || 0}</td>
        <td>${item.proteina || 0}</td>
        <td>${item.gordura || 0}</td>
      `;

      lista.appendChild(tr);
    }
  });
}

async function buscarCategoria() {
  const texto = document.getElementById("busca").value.toLowerCase();
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  const snap = await getDocs(collection(db, "alimentos"));

  snap.forEach(docSnap => {
    const item = docSnap.data();

    if (
      item.categoria === categoriaAtual &&
      item.nome.toLowerCase().includes(texto)
    ) {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.energia_kcal || 0}</td>
        <td>${item.carboidrato || 0}</td>
        <td>${item.proteina || 0}</td>
        <td>${item.gordura || 0}</td>
      `;

      lista.appendChild(tr);
    }
  });
}

// 🔥 DETALHE FINAL
function abrirDetalhe(item) {

  document.getElementById("tela2").classList.remove("ativa");
  document.getElementById("tela3").classList.add("ativa");

  document.getElementById("r_nome").innerText = item.nome;
  document.getElementById("r_porcao").innerText = item.porcao || "100g";

  document.getElementById("r_kcal").innerText = item.energia_kcal || 0;

  document.getElementById("r_carbo").innerText = item.carboidrato || 0;
  document.getElementById("r_prot").innerText = item.proteina || 0;
  document.getElementById("r_gord").innerText = item.gordura || 0;
  document.getElementById("r_fibra").innerText = item.fibra || 0;

  document.getElementById("r_va").innerText = item.vitamina_a || 0;
  document.getElementById("r_vc").innerText = item.vitamina_c || 0;
  document.getElementById("r_vb6").innerText = item.vitamina_b6 || 0;

  document.getElementById("r_calc").innerText = item.calcio || 0;
  document.getElementById("r_ferro").innerText = item.ferro || 0;
  document.getElementById("r_pot").innerText = item.potassio || 0;
  document.getElementById("r_sodio").innerText = item.sodio || 0;

  let texto = "MODERADO 🟡";
  let cor = "orange";

  if (item.classificacao === "bom") {
    texto = "BOM 🟢";
    cor = "green";
  }

  if (item.classificacao === "evitar") {
    texto = "EVITAR 🔴";
    cor = "red";
  }

  const el = document.getElementById("r_class");
  el.innerText = texto;
  el.style.color = cor;
}

// 🔥 START
carregarAlimentos();