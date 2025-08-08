import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD3DTgFZWgT0J4gYhiyUon9v9qlVdxYHlM",
  authDomain: "lucastrend-f695b.firebaseapp.com",
  projectId: "lucastrend-f695b",
  storageBucket: "lucastrend-f695b.appspot.com",
  messagingSenderId: "431451296314",
  appId: "1:431451296314:web:18f1bdd2624828b327db03",
  measurementId: "G-8CRRTDERQP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");
let editMode = false;
let editId = "";

// Load products
async function loadProducts() {
  productList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));

  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.classList.add("product-item");
    div.style.border = "1px solid #ddd";
    div.style.padding = "10px";
    div.style.marginBottom = "10px";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "10px";

    // Main product image
    const img = document.createElement("img");
    img.src = data.image || "";
    img.alt = data.name;
    img.style.width = "80px";
    img.style.height = "80px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "5px";

    // Details
    const details = document.createElement("div");
    details.innerHTML = `
      <h3 style="margin:0;">${data.name}</h3>
      <p style="margin:0;">₦${data.price}</p>
      <p style="margin:0;">Category: ${data.category}</p>
      <p style="margin:0;">Sizes: ${data.sizes ? data.sizes.join(", ") : "None"}</p>
    `;

    // Actions
    const actions = document.createElement("div");
    actions.style.marginLeft = "auto";
    actions.innerHTML = `
      <button onclick="editProduct('${docSnap.id}', '${data.name}', '${data.category}', ${data.price}, '${data.hotdeal}', '${data.image}', '${data.images?.join(",")}', '${data.sizes?.join(",")}')">Edit</button>
      <button onclick="deleteProduct('${docSnap.id}')">Delete</button>
    `;

    div.appendChild(img);
    div.appendChild(details);
    div.appendChild(actions);
    productList.appendChild(div);
  });
}

window.editProduct = function (id, name, category, price, hotdeal, image, images, sizes) {
  document.getElementById("product-id").value = id;
  document.getElementById("name").value = name;
  document.getElementById("category").value = category;
  document.getElementById("price").value = price;
  document.getElementById("hotdeal").value = hotdeal;
  document.getElementById("image").value = image;
  document.getElementById("images").value = images;
  document.getElementById("sizes").value = sizes;
  editMode = true;
  editId = id;
}

window.deleteProduct = async function (id) {
  await deleteDoc(doc(db, "products", id));
  loadProducts();
}

// Add / Update product
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const price = parseFloat(document.getElementById("price").value);
  const hotdeal = document.getElementById("hotdeal").value === "true";
  const image = document.getElementById("image").value;
  const images = document.getElementById("images").value.split(",").map(i => i.trim()).filter(i => i);
  const sizes = document.getElementById("sizes").value.split(",").map(s => s.trim()).filter(s => s);

  const productData = { name, category, price, hotdeal, image, images, sizes };

  if (editMode) {
    await updateDoc(doc(db, "products", editId), productData);
    editMode = false;
    editId = "";
  } else {
    await addDoc(collection(db, "products"), productData);
  }
  
  productForm.reset();
  loadProducts();
});

document.addEventListener("DOMContentLoaded", loadProducts);
