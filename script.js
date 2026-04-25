/* ===========================================
   Serdar Cengiz Kuyumculuk — Static JS
   =========================================== */

// ---------- WhatsApp config ----------
const WHATSAPP_NUMBER = "905012013807"; // change to real number
const WHATSAPP_DEFAULT_MSG =
  "Merhaba, Serdar Cengiz Kuyumculuk koleksiyonları hakkında bilgi almak istiyorum.";

function buildWhatsAppLink(message = WHATSAPP_DEFAULT_MSG) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Wire all [data-wa] links
document.querySelectorAll("[data-wa]").forEach((el) => {
  const customMsg = el.getAttribute("data-wa-msg");
  el.href = buildWhatsAppLink(customMsg || undefined);
  el.target = "_blank";
  el.rel = "noopener noreferrer";
});

// ---------- Navbar scroll state ----------
const navbar = document.getElementById("navbar");
const onScroll = () => {
  if (window.scrollY > 24) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Mobile menu toggle ----------
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});
mobileMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => mobileMenu.classList.remove("open"))
);

// ---------- Featured products (rendered from data) ----------
const products = [
  { name: "Roma Zincir Bilezik", category: "Bilezik", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80" },
  { name: "Solitaire Pırlanta Yüzük", category: "Yüzük", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80" },
  { name: "Zümrüt Taşlı Kolye", category: "Kolye", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80" },
  { name: "Pırlanta Halka Küpe", category: "Küpe", image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&q=80" },
  { name: "Çift Alyans Seti", category: "Alyans", image: "https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?w=800&q=80" },
  { name: "Osmanlı Motifli Bilezik", category: "Bilezik", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80" },
];

const grid = document.getElementById("productsGrid");
if (grid) {
  grid.innerHTML = products
    .map(
      (p) => `
      <article class="product-card reveal">
        <div class="img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="product-info">
          <p class="micro">${p.category}</p>
          <h3>${p.name}</h3>
          <p>Fiyat için iletişime geçin</p>
          <a class="micro-link" href="${buildWhatsAppLink(
            `Merhaba, "${p.name}" hakkında bilgi almak istiyorum.`
          )}" target="_blank" rel="noopener noreferrer">WhatsApp ile Sor</a>
        </div>
      </article>`
    )
    .join("");
}

// ---------- Reveal on scroll ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => {
  const delay = el.getAttribute("data-delay");
  if (delay) el.style.transitionDelay = `${delay}s`;
  observer.observe(el);
});

// ---------- Footer year ----------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Altın Fiyatları ----------
async function fetchGoldPrices() {
  try {
    // Ons fiyatı (USD)
    const resXAU = await fetch("https://api.gold-api.com/price/XAU");
    const dataXAU = await resXAU.json();
    const onsUSD = dataXAU.price;

    // USD/TRY kuru — ücretsiz API
    const resKur = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const dataKur = await resKur.json();
    const usdTry = dataKur.rates.TRY;

    // Hesaplamalar
    const gramAltin = (onsUSD / 31.1035) * usdTry;
    const onDortAyar = gramAltin * 0.585 * 1.11;

    // DOM güncelle
    const cells = document.querySelectorAll(".price-cell");

    cells[0].querySelector(".price-value span").textContent =
      gramAltin.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
    cells[0].querySelector(".micro-dim").textContent = "Az önce güncellendi";

    cells[1].querySelector(".price-value span").textContent =
      onDortAyar.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
    cells[1].querySelector(".micro-dim").textContent = "Az önce güncellendi";

    cells[2].querySelector(".price-value span").textContent =
      onsUSD.toLocaleString("en-US", { maximumFractionDigits: 0 });
    cells[2].querySelector(".micro-dim").textContent = "Az önce güncellendi";

  } catch (err) {
    console.error("Fiyat alınamadı:", err);
    document.querySelectorAll(".price-cell .micro-dim").forEach((el) => {
      el.textContent = "Şu an yüklenemiyor";
    });
  }
}

fetchGoldPrices();
setInterval(fetchGoldPrices, 30 * 60 * 1000);