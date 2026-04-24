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
	<td>${i.carboidrato ?? i.carboidrato_g ?? "-"}</td>
	<td>${i.proteina ?? i.proteina_g ?? "-"}</td>
	<td>${i.gordura ?? i.lipideos_g ?? "-"}</td>
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
    const response = await fetch("base500.json"); // seu arquivo
    const dados = await response.json();

    console.log("🔥 Importando...", dados.length);

    for (const item of dados) {

      const id = (item.descricao_alimento || item.nome || "sem_nome")
        .toLowerCase()
        .replace(/\s+/g,"_");

      await setDoc(doc(db, "alimentos", id), {

        nome: item.descricao_alimento || item.nome || "",

        categoria: item.grupo || item.categoria || "",

        porcao: "100g",

        energia_kcal: item.energia_kcal || 0,

        // 🔥 AQUI É A CORREÇÃO
        carboidrato: item.carboidrato_g || item.carboidrato || 0,
        proteina: item.proteina_g || item.proteina || 0,
        gordura: item.lipideos_g || item.gordura || 0,

        fibra: item.fibra_alimentar_g || item.fibra || 0,

        calcio: item.calcio_mg || item.calcio || 0,
        sodio: item.sodio_mg || item.sodio || 0,
        magnesio: item.magnesio_mg || item.magnesio || 0,

        colesterol: item.colesterol_mg || item.colesterol || 0,

        classificacao: "moderado"

      });

    }

    alert("🔥 IMPORTAÇÃO CONCLUÍDA!");

    carregarAlimentos(); // atualiza tela

  } catch (e) {
    console.error(e);
    alert("Erro ao importar 😢");
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