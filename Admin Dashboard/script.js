
const firebaseConfig = {
  apiKey: "AIzaSyAyVmUaG65jJZD4xbYafQLQwIaFKuBMx-o",
  authDomain: "admin-dashboard-23957.firebaseapp.com",
  projectId: "admin-dashboard-23957",
  storageBucket: "admin-dashboard-23957.firebasestorage.app",
  messagingSenderId: "914880545893",
  appId: "1:914880545893:web:57ae61cad9b490020f728c",
  measurementId: "G-NMVQBPL83E"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const form = document.getElementById("product-form");
const tableBody = document.querySelector("#product-table tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value;
  const price = Number(form.price.value);
  const description = form.description.value;

  try {
    await db.collection("products").add({
      name,
      price,
      description,
      dateAdded: firebase.firestore.Timestamp.now()
    });
    form.reset();
  } catch (err) {
    console.error("Error adding product:", err);
    alert("Error adding product. Check console.");
  }
});

db.collection("products").orderBy("dateAdded", "desc")
  .onSnapshot((snapshot) => {
    tableBody.innerHTML = "";
    snapshot.forEach((doc) => {
      const product = doc.data();
      const date = product.dateAdded 
        ? new Date(product.dateAdded.seconds * 1000).toLocaleString() 
        : '';
      const row = `
        <tr>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.description}</td>
          <td>${date}</td>
        </tr>`;
      tableBody.innerHTML += row;
    });
  });
