async function loadHotDeals() {
  const hotDealsContainer = document.getElementById("hot-deals-container");
  if (!hotDealsContainer) return;

  const snapshot = await getDocs(collection(db, "products"));
  const hotDeals = [];

  snapshot.forEach(doc => {
    const product = doc.data();
    if (product.isHotDeal) {
      product.id = doc.id;
      hotDeals.push(product);
    }
  });

  hotDealsContainer.innerHTML = "";

  hotDeals.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("hot-deals-card");

    card.innerHTML = `
      <a href="product-page.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}">
      </a>
      <p class="deals-product-name">${product.name}</p>
      <p class="deals-product-price">${formatCurrency(product.price)}</p>
    `;

    hotDealsContainer.appendChild(card);
  });
}
