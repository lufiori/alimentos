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
  if(!lista) return;

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

      lista.appendChild(tr);
    });

  } catch (e) {
    console.error(e);
    alert("Erro ao carregar dados 😢");
  }
}

// 🔥 IMPORTAR BANCO (AGORA FUNCIONA)
document.getElementById("btnImportar").addEventListener("click", async () => {
  try {
    const snap = await getDocs(collection(db, "alimentos"));

    const dados = [];
    snap.forEach(docSnap => {
      dados.push(docSnap.data());
    });

    // 🔥 joga no sistema principal (HTML)
    window.setBaseAtual(dados);

    document.getElementById("statusBase").className = "status ok";
    document.getElementById("statusBase").textContent =
      "Banco carregado do Firebase com sucesso 🚀";

  } catch (e) {
    console.error(e);

    document.getElementById("statusBase").className = "status error";
    document.getElementById("statusBase").textContent =
      "Erro ao carregar banco ❌";
  }
});

// 🔥 START
window.addEventListener("load", () => {
  console.log("🔥 App iniciado");

  if (!window.db) {
    console.error("❌ Firebase NÃO carregou!");
    return;
  }

  carregarAlimentos();
});