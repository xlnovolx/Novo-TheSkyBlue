// ---- CARRUSEL ----
const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel img");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
let index = 0;

function showSlide(i) {
  index = (i + slides.length) % slides.length;
  track.style.transform = `translateX(${-index * 100}%)`;
}
prevBtn.onclick = () => showSlide(index - 1);
nextBtn.onclick = () => showSlide(index + 1);
setInterval(() => showSlide(index + 1), 4000);

// ---- NAV ----
const buttons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll("main section");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.dataset.target;
    sections.forEach(s => {
      s.classList.remove("active");
      if (s.id === target) s.classList.add("active");
    });
  });
});

// ---- CARRITO ----
const cart = document.getElementById("cart");
const cartToggle = document.getElementById("cart-toggle");
const closeCart = document.getElementById("close-cart");
const cartList = document.querySelector("#cart ul");
const cartTotal = document.getElementById("cart-total");
let carrito = JSON.parse(localStorage.getItem("carrito")) || {};

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;
  Object.values(carrito).forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div><strong>${item.name}</strong><br>$${item.price}</div>
      <div class="qty-controls">
        <button class="decrease">-</button>
        <span>${item.qty}</span>
        <button class="increase">+</button>
      </div>`;
    li.querySelector(".decrease").onclick = () => {
      item.qty--; if (item.qty <= 0) delete carrito[item.name];
      saveCart(); renderCart();
    };
    li.querySelector(".increase").onclick = () => { item.qty++; saveCart(); renderCart(); };
    cartList.appendChild(li);
    total += item.price * item.qty;
  });
  cartTotal.textContent = "$" + total.toLocaleString();
}
function saveCart() { localStorage.setItem("carrito", JSON.stringify(carrito)); }

document.body.addEventListener("click", e => {
  if (e.target.classList.contains("btn-add")) {
    const card = e.target.closest(".card");
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    if (price > 0) {
      if (!carrito[name]) carrito[name] = { name, price, qty: 0 };
      carrito[name].qty++;
      saveCart(); renderCart();
      cart.classList.add("open");
    }
  }
});
cartToggle.onclick = () => cart.classList.toggle("open");
closeCart.onclick = () => cart.classList.remove("open");
renderCart();

// ---- FINALIZAR COMPRA ----
const finalizarBtn = document.getElementById("finalizar-compra");
const cambiarNombreBtn = document.getElementById("cambiar-nombre");

// Guardar datos del cliente
let nombreCliente = localStorage.getItem("nombreCliente") || "";
let numeroCliente = localStorage.getItem("numeroCliente") || "";

// Evento finalizar compra
finalizarBtn.addEventListener("click", () => {
  if (Object.keys(carrito).length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  if (!nombreCliente) {
    nombreCliente = prompt("Por favor, ingresa tu nombre:");
    if (!nombreCliente) {
      alert("Debes ingresar un nombre para continuar.");
      return;
    }
    localStorage.setItem("nombreCliente", nombreCliente);
  }

  if (!numeroCliente) {
    numeroCliente = prompt("Por favor, ingresa tu número de contacto:");
    if (!numeroCliente) {
      alert("Debes ingresar un número de contacto para continuar.");
      return;
    }
    localStorage.setItem("numeroCliente", numeroCliente);
  }

    // Armamos el mensaje
    let mensaje = `Hola, soy ${nombreCliente}.\nMi número de contacto es: ${numeroCliente}\n\nQuiero realizar la siguiente compra:\n\n`;
    let total = 0;
    Object.values(carrito).forEach(item => {
    // Buscar la tarjeta correspondiente para obtener detalles
    const card = document.querySelector(`.card[data-name="${item.name}"]`);
    const detalle = card ? card.querySelector("h3").textContent : item.name;

    mensaje += `- ${detalle} (x${item.qty}) = $${(item.price * item.qty).toLocaleString()}\n`;
    total += item.price * item.qty;
    });
    mensaje += `\nTOTAL: $${total.toLocaleString()}`;

  // Número de WhatsApp del vendedor
  const numero = "573186365553"; // 👈 cámbialo por el tuyo con código de país
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  // Redirigir a WhatsApp en la misma pestaña
  window.location.href = url;

  // Vaciar carrito después de la compra
  carrito = {};
  saveCart();
  renderCart();
});

// Evento cambiar nombre
cambiarNombreBtn.addEventListener("click", () => {
  const nuevoNombre = prompt("Ingresa tu nombre:");
  if (nuevoNombre) {
    nombreCliente = nuevoNombre;
    localStorage.setItem("nombreCliente", nuevoNombre);
    alert("Nombre actualizado correctamente ✅");
  }

  const nuevoNumero = prompt("Ingresa tu número de contacto:");
  if (nuevoNumero) {
    numeroCliente = nuevoNumero;
    localStorage.setItem("numeroCliente", nuevoNumero);
    alert("Número de contacto actualizado correctamente ✅");
  }
});
