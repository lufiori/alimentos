// 🔥 COLE AQUI SUA CONFIG DO FIREBASE
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>


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
