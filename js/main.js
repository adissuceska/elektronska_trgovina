// ============================================
// E-COMMERCE TOUR GUIDE BOOKING (REAL-TIME)
// ============================================

// ============================================
// ZADATAK 1: VALIDNI KUPONI
// ============================================
const VALID_COUPONS = ["SAVE10", "SAVE15", "FREESHIP"]; 

// ============================================
// ZADATAK 5 DORADA: ASOCIJATIVNI NIZ allProducts (NIJE IZ HTML-a)
//    - IZMENA: Kreiran kompletan niz objekata direktno u JS-u sa svim podacima
// ============================================
const allProducts = [ // allProducts
    { id: "paris", name: "City Break in Paris", price: 299, qty: 25 },
    { id: "london", name: "London Weekend Escape", price: 349, qty: 18 },
    { id: "rome", name: "Rome Historical Tour", price: 399, qty: 12 },
    { id: "barcelona", name: "Barcelona City Adventure", price: 289, qty: 8 },
    { id: "amsterdam", name: "Amsterdam Canal Tour", price: 329, qty: 22 },
    { id: "prague", name: "Prague Cultural Walk", price: 279, qty: 15 },
    { id: "berlin", name: "Berlin City Break", price: 319, qty: 9 },
    { id: "vienna", name: "Vienna Classical Tour", price: 359, qty: 14 },
    { id: "lisbon", name: "Lisbon Old Town Walk", price: 269, qty: 31 },
    { id: "budapest", name: "Budapest Thermal Baths", price: 299, qty: 7 },
    { id: "flower", name: "Amsterdam Flower Markets", price: 199, qty: 42 },
    { id: "edinburgh", name: "Edinburgh Castle Visit", price: 389, qty: 11 },
    { id: "venice", name: "Venice Gondola Ride", price: 449, qty: 6 },
    { id: "athens", name: "Athens Ancient Sights", price: 339, qty: 19 },
    { id: "nice", name: "Nice Riviera Tour", price: 409, qty: 13 },
    { id: "florence", name: "Florence Art Walk", price: 379, qty: 5 }
];

// ============================================
// HTML MAPPING - za real-time table (sync sa allProducts)
//    - IZMENA: Sada koristi allProducts umesto statičkog mappinga
// ============================================
const productMapping = allProducts.map(p => ({ id: p.id, name: p.name })); // allProducts

// ============================================
// HELPER FUNCTIONS (bez izmena)
// ============================================
function normalizeCoupon(code) {
    return code.toUpperCase().trim();
}

function parseQuantity(element) {
    return parseInt(element.textContent.trim()) || 0;
}

function parsePrice(element) {
    return parseFloat(element.textContent.trim().replace(/[$,]/g, '')) || 0;
}

function formatCurrency(amount) {
    return `$${amount.toLocaleString()}`;
}

function formatPrice(amount) {
    return `$${amount.toFixed(2)}`;
}

function getProductElements(productId) {
    const qtyElement = document.getElementById(`${productId}-qty`);
    const priceElement = qtyElement?.closest('tr')?.querySelector('.price');
    const subtotalElement = document.getElementById(`${productId}-subtotal`);
    return { qtyElement, priceElement, subtotalElement };
}

// ============================================
// ZADATAK 2: FUNKCIJA isValidCoupon(code) (bez izmena)
// ============================================
function isValidCoupon(code) {
    return VALID_COUPONS.includes(code);
}

// ============================================
// ZADACI 3-4: validateAndNotify() (bez izmena)
// ============================================
function validateAndNotify() {
    const input = document.getElementById('promo-input');
    if (!input) return;
    
    const code = normalizeCoupon(input.value);
    
    if (isValidCoupon(code)) {
        if (code === "SAVE10") {
            alert("Vaš kupon donosi 10% popusta.");
        } else if (code === "SAVE15") {
            alert("Vaš kupon donosi 15% popusta.");
        } else if (code === "FREESHIP") {
            alert("Vaš kupon donosi besplatnu dostavu.");
        }
    } else {
        alert("Nevažeći kupon. Pokušajte: SAVE10, SAVE15 ili FREESHIP");
    }
}

// ============================================
// ZADATAK 6 DORADA: UKUPNA VREDNOST LAGERA
//    - IZMENA: Sada koristi reduce() NA allProducts nizu (NE ČITA IZ HTML-a)
// ============================================
function calculateInventoryValue() {
    const totalValue = allProducts.reduce((total, product) => { // reduce() NA allProducts
        return total + (product.price * product.qty);
    }, 0);
    console.log(`Ukupna vrednost lagera: ${formatCurrency(totalValue)} USD`);
    return totalValue;
}

// ============================================
// ZADATAK 7 DORADA: LOW STOCK NIZ  
//    - IZMENA: Sada koristi filter() NA allProducts nizu (NE ČITA IZ HTML-a)
// ============================================
function generateLowStockReport() {
    const lowStock = allProducts.filter(product => product.qty < 10); // filter() NA allProducts
    console.log("LOW STOCK PROIZVODI:", lowStock);
    return lowStock;
}

// ============================================
// ZADATAK 8 DORADA: findProductByName(LIST, searchName)
//    - IZMENA: Generička funkcija koja prima LIST kao parametar
//    - IZMENA: Ne traži u HTML-u, radi samo sa prosleđenim nizom objekata
// ============================================
function findProductByName(list, searchName) { // prima LIST kao parametar
    const normalizedSearch = searchName.toLowerCase().trim();
    return list.find(product => 
        product.name.toLowerCase().includes(normalizedSearch)
    );
}

// ============================================
// LOW STOCK FUNCTIONS (ažurirano)
//    - IZMENA: generateLowStockReport() sada vraća podatke iz allProducts
// ============================================
function isLowStock(qty) {
    return qty < 10;
}

function updateSubtotalClass(subtotalElement, qty) {
    if (isLowStock(qty)) {
        subtotalElement.classList.add('low-stock');
    } else {
        subtotalElement.classList.remove('low-stock');
    }
}

function updateLowStockSection() {
    const lowStockSection = document.getElementById('lowStockSection');
    const lowStockList = document.getElementById('lowStockList');
    
    if (!lowStockSection || !lowStockList) return;
    
    const lowStockItems = generateLowStockReport(); // sada vraća podatke iz allProducts
    
    if (lowStockItems.length === 0) {
        lowStockSection.style.display = 'none';
    } else {
        lowStockSection.style.display = 'block';
        lowStockList.innerHTML = lowStockItems.map(createLowStockItem).join('');
    }
}

function createLowStockItem(product) {
    return `<li><strong>${product.name}:</strong> ${product.qty} units</li>`;
}

// ============================================
// FUNKCIJA: REAL-TIME RAČUNANJE + LOW STOCK (bez izmena)
// ============================================
function processProductRow(product, grandTotal, totalQuantity) {
    const { qtyElement, priceElement, subtotalElement } = getProductElements(product.id);
    
    if (!qtyElement || !priceElement || !subtotalElement) return { grandTotal, totalQuantity };
    
    const qty = parseQuantity(qtyElement);
    const price = parsePrice(priceElement);
    const subtotal = price * qty;
    
    subtotalElement.textContent = formatCurrency(subtotal);
    updateSubtotalClass(subtotalElement, qty);
    
    return {
        grandTotal: grandTotal + subtotal,
        totalQuantity: totalQuantity + qty
    };
}

function updateInventoryTable() {
    let { grandTotal, totalQuantity } = { grandTotal: 0, totalQuantity: 0 };
    
    productMapping.forEach(product => {
        const result = processProductRow(product, grandTotal, totalQuantity);
        grandTotal = result.grandTotal;
        totalQuantity = result.totalQuantity;
    });
    
    updateTotals(grandTotal, totalQuantity);
    updateLowStockSection();
    
    console.log(`REAL-TIME TOTAL: ${formatCurrency(grandTotal)}`);
}

function updateTotals(grandTotal, totalQuantity) {
    const totalQtyElement = document.getElementById('total-quantity');
    const grandTotalElement = document.getElementById('grand-total');
    const finalTotalElement = document.getElementById('finalTotal');
    
    if (totalQtyElement) totalQtyElement.textContent = totalQuantity;
    if (grandTotalElement) grandTotalElement.innerHTML = `<strong>${formatCurrency(grandTotal)} USD</strong>`;
    if (finalTotalElement) finalTotalElement.textContent = `${formatCurrency(grandTotal)} USD`;
}

// ============================================
// REAL-TIME EDITING HELPERS DORADA
//    - IZMENA: Editovanje HTML-a sada sinhronizuje PODATKE NAZAD u allProducts niz
// ============================================
function setupQuantityEditing(qtyElement, productId) {
    ['input', 'blur', 'keyup', 'change'].forEach(event => {
        qtyElement.addEventListener(event, function() {
            const num = parseQuantity(qtyElement);
            qtyElement.textContent = num;
            // sinhronizuje PODATKE NAZAD u allProducts niz
            const product = allProducts.find(p => p.id === productId);
            if (product) product.qty = num;
            updateInventoryTable();
        });
    });
}

function setupPriceEditing(priceElement, productId) {
    ['input', 'blur', 'keyup', 'change'].forEach(event => {
        priceElement.addEventListener(event, function() {
            const num = parsePrice(priceElement);
            priceElement.textContent = formatPrice(num);
            // sinhronizuje PODATKE NAZAD u allProducts niz
            const product = allProducts.find(p => p.id === productId);
            if (product) product.price = num;
            updateInventoryTable();
        });
    });
}

function setupRealTimeUpdates() {
    allProducts.forEach(product => {  // Koristi allProducts umesto productMapping
        const { qtyElement, priceElement } = getProductElements(product.id);
        
        if (qtyElement) {
            qtyElement.contentEditable = true;
            setupQuantityEditing(qtyElement, product.id);
        }
        
        if (priceElement) {
            setupPriceEditing(priceElement, product.id);
        }
    });
    
    updateLowStockSection();
}

// ============================================
// EVENT HANDLERS
// ============================================
function setupCouponValidation() {
    const promoBtn = document.getElementById('promo-apply');
    if (promoBtn) {
        promoBtn.addEventListener('click', validateAndNotify);
    }
}

function setupCheckoutButton() {
    const checkoutBtn = document.getElementById('submit-button');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Booking confirmed! Thank you for your purchase.');
        });
    }
}

function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
}

// IZMENA: handleSearch() Sada koristi findProductByName(allProducts, searchTerm)
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput || !searchInput.value.trim()) {
        alert('Unesite naziv ture za pretragu.');
        return;
    }
    
    const searchTerm = searchInput.value.trim();
    const found = findProductByName(allProducts, searchTerm);  // Generička pretraga
    
    if (found) {
        alert(`📋 Lager:\n` +
              `${found.name}\n` +
              `Cijena: ${formatPrice(found.price)}\n` +
              `Stanje/Količina: ${found.qty}\n` +
              `Subtotal: ${formatCurrency(found.price * found.qty)}`);
    } else {
        alert(`Nema rezultata za "${searchTerm}"`);
    }
}

function setupQuantityButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-btn')) {
            const tour = e.target.dataset.tour;
            const input = document.getElementById(`qty-${tour}`);
            if (!input) return;
            
            let qty = parseInt(input.value) || 1;
            
            if (e.target.classList.contains('qty-plus') && qty < 10) {
                input.value = qty + 1;
            } else if (e.target.classList.contains('qty-minus') && qty > 1) {
                input.value = qty - 1;
            }
        }
    });
}

// ============================================
// INICIJALIZACIJA - DORADA
//    - IZMENA: Inicijalno popunjava HTML tabelu PODACIMA IZ allProducts
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("E-COMMERCE LOADED! ZADACI:");
    console.log("Z1-4: KUPONI - #promo-apply dugme");
    console.log("Z5: allProducts NIZ KREIRAN (16 proizvoda)");
    console.log("Z6: calculateInventoryValue() - IZ allProducts reduce()");
    console.log("Z7: generateLowStockReport() - IZ allProducts filter()");
    console.log("Z8: findProductByName(LIST, searchName) - GENERIČKA");
    
    // TEST ZADATAKA U KONZOLI
    console.log("\n=== ZADACI TEST ===");
    console.log("Z5 - allProducts:", allProducts.length, "proizvoda");
    console.log("Z6 - Ukupna vrednost:", calculateInventoryValue());
    console.log("Z7 - Low stock (<10):", generateLowStockReport().length, "proizvoda");
    console.log("Z8 - Pretraga 'Paris':", findProductByName(allProducts, "Paris"));
    
    setupCouponValidation();
    setupCheckoutButton();
    setupSearch();
    setupQuantityButtons();
    
    if (document.getElementById('inventoryTable')) {
        // IZMENA: Inicijalno popunjava HTML tabelu PODACIMA IZ allProducts
        allProducts.forEach(product => {
            const qtyEl = document.getElementById(`${product.id}-qty`);
            const priceEl = document.querySelector(`#${product.id}-row .price`);
            if (qtyEl) qtyEl.textContent = product.qty;
            if (priceEl) priceEl.textContent = formatPrice(product.price);
        });
        updateInventoryTable();
        setupRealTimeUpdates();  // Sa sync-om u allProducts
    }
    
    console.log("\nFUNCIONALNOSTI + ZADACI");
});
