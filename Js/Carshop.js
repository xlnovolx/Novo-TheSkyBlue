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
      <div><strong>${item.name}</strong><br>$${item.price.toLocaleString('es-ES')}</div>
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
  cartTotal.textContent = "$" + total.toLocaleString('es-ES');
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

document.body.addEventListener("click", e => {

  if (e.target.classList.contains("btn-consultar")) {
    const card = e.target.closest(".card");
    const name = card.dataset.name;
    const descripcion = card.querySelector("h3").textContent;


    const numero = "573186365553";
 
    const mensaje = `Hola, quiero consultar informacio sobre el producto: ${descripcion} (${name})`;


    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;


    window.open(url, "_blank");
  }
});


cartToggle.onclick = () => cart.classList.toggle("open");
closeCart.onclick = () => cart.classList.remove("open");
renderCart();
 
const finalizarBtn = document.getElementById("finalizar-compra");
const cambiarNombreBtn = document.getElementById("cambiar-nombre");
 
let nombreCliente = localStorage.getItem("nombreCliente") || "";
let numeroCliente = localStorage.getItem("numeroCliente") || "";
 
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
 
    let mensaje = `Hola, Soy ${nombreCliente}.\nMi número de contacto es: ${numeroCliente}\n\nQuiero realizar la siguiente compra:\n\n`;
    let total = 0;
    Object.values(carrito).forEach(item => {
      
    const card = document.querySelector(`.card[data-name="${item.name}"]`);
    const detalle = card ? card.querySelector("h3").textContent : item.name;

    mensaje += `- ${detalle} (x${item.qty}) = $${(item.price * item.qty).toLocaleString()}\n`;
    total += item.price * item.qty;
    });
    mensaje += `\nTOTAL: $${total.toLocaleString()}`;

  const numero = "573186365553"; 
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
 
  window.location.href = url;
 
  carrito = {};
  saveCart();
  renderCart();
});
 
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

document.addEventListener('DOMContentLoaded', () => {
  const botonCarrito = document.getElementById('cart-toggle');
  const botonWhatsApp = document.getElementById('wa-toggle');
  const elementosOcultar = document.querySelectorAll('.ocultar');
  const cart = document.getElementById("cart"); 
  
  let carritoAbierto = false;

  if (!botonCarrito && !botonWhatsApp && elementosOcultar.length === 0) return;

  function manejarVisibilidad() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const estaEnFooter = (scrollTop + windowHeight) >= (documentHeight - 200);
    
    if (botonCarrito) {
      if (estaEnFooter || carritoAbierto) {
        botonCarrito.classList.add('hide-on-footer');
        botonCarrito.setAttribute('aria-hidden', 'true');
      } else {
        botonCarrito.classList.remove('hide-on-footer');
        botonCarrito.removeAttribute('aria-hidden');
      }
    }
    
    if (estaEnFooter) {
      if (botonWhatsApp) {
        botonWhatsApp.classList.add('hide-on-footer');
        botonWhatsApp.setAttribute('aria-hidden', 'true');
      }
      
      elementosOcultar.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.pointerEvents = 'none';
      });
    } else {
      if (botonWhatsApp) {
        botonWhatsApp.classList.remove('hide-on-footer');
        botonWhatsApp.removeAttribute('aria-hidden');
      }
      
      elementosOcultar.forEach(elemento => {
        elemento.style.opacity = '1';
        elemento.style.pointerEvents = 'auto';
      });
    }
  }

  function abrirCarrito() {
    carritoAbierto = true;
    
    if (cart) {
      cart.classList.add("open");
    }
    
    manejarVisibilidad();
  }

  function cerrarCarrito() {
    carritoAbierto = false;
    
    if (cart) {
      cart.classList.remove("open");
    }
    
    manejarVisibilidad();
  }

  function enviarMensajeSoporte() {
    const numero = "573186365553";
    const mensaje = "Hola, tengo una consulta sobre:\n• Precios y cotizaciones\n• Disponibilidad de productos\n• Soporte técnico\n• Otros\n\n¿Me podrían ayudar por favor?";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, "_blank");
  }

  function configurarBotonWhatsApp() {
    if (botonWhatsApp) {
      
      botonWhatsApp.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        enviarMensajeSoporte();
      });
    }
  }

  function sincronizarEstadoCarrito() {
    const estaAbierto = cart && cart.classList.contains("open");
    
    if (estaAbierto !== carritoAbierto) {
      carritoAbierto = estaAbierto;
      manejarVisibilidad();
    }
  }

  function configurarBotonCerrar() {
    const botonCerrar = document.getElementById('close-cart');
    
    if (botonCerrar) {
      
      botonCerrar.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cerrarCarrito();
      });
      
    } else {
    }
  }

  function iniciarObservador() {
    if (cart) {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.attributeName === 'class') {
            setTimeout(sincronizarEstadoCarrito, 50);
          }
        });
      });
      
      observer.observe(cart, { 
        attributes: true,
        attributeFilter: ['class']
      });
      
    }
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && carritoAbierto) {
      cerrarCarrito();
    }
  });

  window.addEventListener('scroll', manejarVisibilidad);
  
  setTimeout(configurarBotonCerrar, 100);
  setTimeout(configurarBotonCerrar, 500);
  setTimeout(configurarBotonWhatsApp, 100);
  
  setTimeout(iniciarObservador, 100);
  
  setTimeout(sincronizarEstadoCarrito, 200);
  
  manejarVisibilidad();

  window.controladorCarrito = {
    abrirCarrito: abrirCarrito,
    cerrarCarrito: cerrarCarrito,
    manejarVisibilidad: manejarVisibilidad,
    getEstado: () => carritoAbierto,
    sincronizarEstadoCarrito: sincronizarEstadoCarrito,
    enviarMensajeSoporte: enviarMensajeSoporte
  };
  
});
