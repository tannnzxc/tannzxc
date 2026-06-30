function startCoffeeApp() {

    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap failed to load. Check your internet connection.');
        return;
    }

    const coffeeContainer = document.getElementById('coffee-container');
    const coffeeModalElement = document.getElementById('coffeeModal');
    const coffeeModal = new bootstrap.Modal(coffeeModalElement);
    const orderSummaryModal = new bootstrap.Modal(document.getElementById('orderSummaryModal'));
    const receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'));
    const searchBar = document.getElementById('search-bar');

    let allItems = [];
    let currentOrder = JSON.parse(localStorage.getItem('coffeeOrder')) || [];
    currentOrder = currentOrder.map(item => ({ ...item, qty: item.qty || 1 }));

    const customizations = {
        sizes: [
            { name: 'Tall', price: 0 },
            { name: 'Grande', price: 15 },
            { name: 'Venti', price: 30 }
        ],
        milk: ['Full Cream', 'Oatmilk (+₱30)', 'Soy Milk (+₱20)', 'Almond Milk (+₱25)'],
        sweetness: ['Normal Sweet', 'Less Sugar', 'No Sugar', 'Extra Honey (+₱15)']
    };

    const drinkLibrary = {
        "Latte": {
            name: "Silk Velvety Latte",
            price: 150,
            desc: "Our signature espresso softened with silky steamed milk.",
            image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&auto=format&fit=crop&q=80"
        },
        "Caramel Latte": {
            name: "Golden Caramel Latte",
            price: 165,
            desc: "Rich espresso with steamed milk and buttery caramel drizzle.",
            image: "https://images.unsplash.com/photo-1599398054066-846f28917f38?w=600&auto=format&fit=crop&q=80"
        },
        "Macchiato": {
            name: "Classic Cloud Macchiato",
            price: 145,
            desc: "Bold espresso marked with a dollop of velvety foam.",
            image: "https://images.unsplash.com/photo-1557772611-722dabe20327?w=600&auto=format&fit=crop&q=80"
        },
        "Classic Cappuccino": {
            name: "Classic Cloud Cappuccino",
            price: 155,
            desc: "Perfectly balanced layers of espresso, milk, and foam.",
            image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80"
        },
        "Matcha Latte": {
            name: "Ceremonial Matcha Latte",
            price: 170,
            desc: "Stone-ground matcha whisked with creamy steamed milk.",
            image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80"
        },
        "Svart Te": {
            name: "Heritage Black Tea",
            price: 110,
            desc: "A warm, aromatic black tea brewed to perfection.",
            image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80"
        },
        "Islatte": {
            name: "Iced Silk Latte",
            price: 160,
            desc: "Chilled espresso and milk poured over crystal ice.",
            image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80"
        },
        "Islatte Mocha": {
            name: "Iced Dark Cocoa Mocha",
            price: 175,
            desc: "Iced latte blended with rich dark chocolate.",
            image: "https://images.unsplash.com/photo-1642647391072-6a2416f048e5?w=600&auto=format&fit=crop&q=80"
        },
        "Frapino Caramel": {
            name: "Caramel Frost Frapino",
            price: 185,
            desc: "Blended iced coffee topped with whipped cream and caramel.",
            image: "https://images.unsplash.com/photo-1662047102608-a6f2e492411f?w=600&auto=format&fit=crop&q=80"
        },
        "Frapino Mocka": {
            name: "Mocha Frost Frapino",
            price: 185,
            desc: "Chocolatey blended coffee with whipped cream on top.",
            image: "https://images.unsplash.com/photo-1530373239216-42518e6b4063?w=600&auto=format&fit=crop&q=80"
        },
        "Flat White": {
            name: "Velvet Flat White",
            price: 155,
            desc: "Double ristretto shots with microfoam steamed milk.",
            image: "https://images.unsplash.com/photo-1517701603999-fb35f3524741?w=600&auto=format&fit=crop&q=80"
        },
        "Caramel Macchiato": {
            name: "Layered Caramel Macchiato",
            price: 170,
            desc: "Vanilla milk layered with espresso and caramel crosshatch.",
            image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop&q=80"
        },
        "Black": {
            name: "Midnight Roast Black",
            price: 120,
            desc: "A robust and full-bodied classic brew.",
            image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
        },
        "Espresso": {
            name: "Pure Heritage Espresso",
            price: 100,
            desc: "A concentrated masterpiece with rich crema.",
            image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80"
        },
        "Americano": {
            name: "Smooth Heritage Americano",
            price: 130,
            desc: "Bold espresso shots gently diluted with hot water.",
            image: "https://images.unsplash.com/photo-1511920170033-f8396924c10f?w=600&auto=format&fit=crop&q=80"
        },
        "Mocha": {
            name: "Dark Cocoa Fusion Mocha",
            price: 165,
            desc: "Marriage of espresso and premium dark chocolate.",
            image: "https://images.unsplash.com/photo-1572490122748-2d42cdfffecb?w=600&auto=format&fit=crop&q=80"
        },
        "Cappuccino": {
            name: "Classic Cloud Cappuccino",
            price: 155,
            desc: "Perfectly balanced layers of espresso, milk, and foam.",
            image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80"
        },
        "Cold Brew": {
            name: "Slow-Drip Cold Brew",
            price: 145,
            desc: "Steeped 18 hours for a smooth, low-acid finish.",
            image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600&auto=format&fit=crop&q=80"
        }
    };

    const dessertLibrary = [
        {
            title: "Croissant",
            name: "Artisanal Butter Croissant",
            price: 95,
            desc: "Flaky, hand-rolled French pastry with golden layers.",
            image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
            category: "dessert"
        },
        {
            title: "Muffin",
            name: "Wild Blueberry Muffin",
            price: 85,
            desc: "Tender muffin packed with fresh blueberries.",
            image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=80",
            category: "dessert"
        },
        {
            title: "Donut",
            name: "Signature Glazed Ring",
            price: 65,
            desc: "Classic melt-in-your-mouth glazed yeast donut.",
            image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80",
            category: "dessert"
        },
        {
            title: "Chocolate Cake",
            name: "Decadent Truffle Slice",
            price: 180,
            desc: "Moist chocolate sponge with dark ganache frosting.",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
            category: "dessert"
        },
        {
            title: "Cheesecake",
            name: "NY Classic Cheesecake",
            price: 195,
            desc: "Rich cheesecake on a buttery graham cracker crust.",
            image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
            category: "dessert"
        },
        {
            title: "Tiramisu",
            name: "Espresso Tiramisu Cup",
            price: 175,
            desc: "Layers of mascarpone, espresso-soaked ladyfingers, and cocoa.",
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80",
            category: "dessert"
        },
        {
            title: "Brownie",
            name: "Fudge Walnut Brownie",
            price: 120,
            desc: "Dense chocolate brownie with crunchy walnut pieces.",
            image: "https://images.unsplash.com/photo-1606313564204-75d0bbf7c063?w=600&auto=format&fit=crop&q=80",
            category: "dessert"
        },
        {
            title: "Macaron",
            name: "French Macaron Trio",
            price: 145,
            desc: "Delicate almond meringue cookies in assorted flavors.",
            image: "https://images.unsplash.com/photo-1569860878811-88ee75141022?w=600&auto=format&fit=crop&q=80",
            category: "dessert"
        },
        {
            title: "Affogato",
            name: "Affogato al Caffè",
            price: 165,
            desc: "Vanilla gelato drowned in a hot double espresso shot.",
            image: "https://images.unsplash.com/photo-1540331547168-8b63109225b7?w=600&auto=format&fit=crop&q=80",
            category: "dessert"
        },
        {
            title: "Ice Cream",
            name: "Vanilla Bean Gelato Scoop",
            price: 110,
            desc: "Creamy gelato with real vanilla bean specks.",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80",
            category: "dessert"
        }
    ];

    const juiceItems = [
        {
            title: "Frozen Lemonade",
            name: "Zesty Frost Lemonade",
            price: 140,
            desc: "Cold-pressed lemons blended with crushed ice.",
            image: "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=600&auto=format&fit=crop&q=80",
            category: "juice"
        },
        {
            title: "Lemonade",
            name: "Hand-Pressed Lemonade",
            price: 120,
            desc: "Pure, chilled lemonade with a bright citrus finish.",
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80",
            category: "juice"
        },
        {
            title: "Orange Juice",
            name: "Fresh Squeezed Orange",
            price: 130,
            desc: "Sweet and tangy juice from ripe Valencia oranges.",
            image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop&q=80",
            category: "juice"
        },
        {
            title: "Mango Smoothie",
            name: "Tropical Mango Smoothie",
            price: 155,
            desc: "Blended ripe mangoes with yogurt and honey.",
            image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&auto=format&fit=crop&q=80",
            category: "juice"
        }
    ];

    function showToast(title, message) {
        const toast = document.getElementById('order-toast');
        document.getElementById('toast-title').textContent = title;
        document.getElementById('toast-message').textContent = message;
        toast.classList.add('show');
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
    }

    function getOrderTotals() {
        const itemCount = currentOrder.reduce((sum, item) => sum + item.qty, 0);
        const total = currentOrder.reduce((sum, item) => sum + (item.price * item.qty), 0);
        return { itemCount, total };
    }

    function findMatchingOrderIndex(name, details) {
        return currentOrder.findIndex(item => item.name === name && item.details === details);
    }

    function addToOrder(name, details, price, qty = 1) {
        const existingIndex = findMatchingOrderIndex(name, details);
        if (existingIndex >= 0) {
            currentOrder[existingIndex].qty += qty;
        } else {
            currentOrder.push({ name, details, price, qty });
        }
        saveAndUpdate();
    }
    const CATEGORY_LABELS = {
        coffee: 'Coffee',
        juice: 'Juice',
        dessert: 'Dessert'
    };

    const FALLBACK_IMAGES = {
        coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
        juice: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
        dessert: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80'
    };

    function getItemImage(item) {
        if (item.image && !item.image.includes('example.com')) return item.image;
        return FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES.coffee;
    }

    const coffeeMenu = Object.entries(drinkLibrary).map(([title, info]) => ({
        title,
        ...info,
        category: 'coffee'
    }));

    function initMenu() {
        allItems = [...coffeeMenu, ...juiceItems, ...dessertLibrary].map(item => ({
            ...item,
            image: getItemImage(item)
        }));

        const loader = document.getElementById('menu-loading');
        if (loader) loader.style.display = 'none';

        updateMenuCountLabel(allItems.length);
        renderItems(allItems);
    }

    function updateMenuCountLabel(count) {
        const label = document.getElementById('menu-count-label');
        if (label) label.textContent = `Showing ${count} handcrafted items`;
    }
    function renderItems(items) {
        updateMenuCountLabel(items.length);
        coffeeContainer.innerHTML = '';
        if (items.length === 0) {
            coffeeContainer.innerHTML = '<div class="col-12 text-center text-muted py-5"><i class="bi bi-search display-6 d-block mb-2 opacity-50"></i>No items found. Try a different search.</div>';
            return;
        }

        const fragment = document.createDocumentFragment();
        items.forEach(item => {
            const info = getProductInfo(item);
            const catLabel = CATEGORY_LABELS[item.category] || 'Item';
            const fallback = FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES.coffee;
            const col = document.createElement('div');
            col.className = 'col-6 col-md-4 col-lg-3 mb-4';
            col.innerHTML = `
                <div class="card h-100 coffee-card text-white border-0 shadow-sm">
                    <div class="card-img-wrap">
                        <img src="${item.image}" alt="${info.name}"
                             onerror="this.onerror=null;this.src='${fallback}'" loading="lazy">
                        <span class="category-badge">${catLabel}</span>
                    </div>
                    <div class="card-body d-flex flex-column p-3">
                        <h6 class="fw-bold mb-1" style="font-size: 0.9rem;">${info.name}</h6>
                        <p class="card-desc">${info.desc}</p>
                        <p class="text-accent fw-bold mb-3 small">₱${info.price.toFixed(2)}</p>
                        <button class="btn btn-accent mt-auto rounded-pill fw-bold py-2 add-order-btn">
                            <i class="bi bi-plus-circle me-1"></i>ADD TO ORDER
                        </button>
                    </div>
                </div>`;

            const addBtn = col.querySelector('.add-order-btn');
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openOrderModal(item, info, addBtn);
            });
            fragment.appendChild(col);
        });
        coffeeContainer.appendChild(fragment);
    }

    function getProductInfo(item) {
        return {
            name: item.name || item.title,
            price: item.price || 140,
            desc: item.desc || item.description || "A delicious selection from our menu."
        };
    }

    function getModalQuantity() {
        const qtyEl = document.getElementById('modal-qty');
        return qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
    }

    function getSelectedSizePrice() {
        const activePill = document.querySelector('.size-pill.active');
        return activePill ? parseFloat(activePill.dataset.price) : 0;
    }

    function updateModalPrice(basePrice) {
        const qty = getModalQuantity();
        const sizePrice = getSelectedSizePrice();
        const unitPrice = basePrice + sizePrice;
        const total = unitPrice * qty;
        document.getElementById('modalPriceLabel').textContent = `₱${total.toFixed(2)}`;
        document.getElementById('modalUnitPrice').textContent = qty > 1
            ? `₱${unitPrice.toFixed(2)} each`
            : '';
    }

    function setupQuantityControls(basePrice) {
        const qtyEl = document.getElementById('modal-qty');
        document.getElementById('qty-minus').onclick = () => {
            const current = getModalQuantity();
            if (current > 1) {
                qtyEl.textContent = current - 1;
                updateModalPrice(basePrice);
            }
        };
        document.getElementById('qty-plus').onclick = () => {
            qtyEl.textContent = getModalQuantity() + 1;
            updateModalPrice(basePrice);
        };
    }

    function openOrderModal(item, info, triggerBtn) {
        const modalBody = document.querySelector('#coffeeModal .modal-body');
        const headerImg = document.getElementById('modalHeaderImg');
        const isDrink = item.category === 'coffee' || item.category === 'juice';

        headerImg.style.backgroundImage = `url(${item.image})`;

        let optionsHTML = `
            <h3 class="fw-bold mb-1">${info.name}</h3>
            <p class="text-secondary mb-4 small">${info.desc}</p>
        `;

        if (isDrink) {
            optionsHTML += `
                <div class="custom-options mb-3">
                    <div class="option-label">Choose Size</div>
                    <div class="size-pills mb-3">
                        ${customizations.sizes.map((s, i) => `
                            <button type="button" class="size-pill${i === 0 ? ' active' : ''}"
                                data-price="${s.price}" data-name="${s.name}">
                                ${s.name}<br><small>+₱${s.price}</small>
                            </button>
                        `).join('')}
                    </div>
                    ${item.category === 'coffee' ? `
                        <div class="option-label">Milk Option</div>
                        <select id="milk-select" class="form-select bg-dark text-white border-secondary mb-3">
                            ${customizations.milk.map(m => `<option value="${m}">${m}</option>`).join('')}
                        </select>
                    ` : `
                        <div class="option-label">Sweetness Level</div>
                        <select id="sweetness-select" class="form-select bg-dark text-white border-secondary mb-3">
                            ${customizations.sweetness.map(sw => `<option value="${sw}">${sw}</option>`).join('')}
                        </select>
                    `}
                </div>
            `;
        }

        optionsHTML += `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="option-label mb-0">Quantity</div>
                <div class="qty-control">
                    <button type="button" class="qty-btn" id="qty-minus">−</button>
                    <span class="qty-value" id="modal-qty">1</span>
                    <button type="button" class="qty-btn" id="qty-plus">+</button>
                </div>
            </div>
            <div class="modal-price-row mb-3">
                <div>
                    <p id="modalPriceLabel" class="text-accent fw-bold fs-4 mb-0">₱${info.price.toFixed(2)}</p>
                    <small id="modalUnitPrice" class="text-secondary"></small>
                </div>
            </div>
            <button class="btn btn-accent w-100 rounded-pill fw-bold py-3" id="confirm-add-btn">ADD TO ORDER</button>
        `;

        modalBody.innerHTML = optionsHTML;

        document.querySelectorAll('.size-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                updateModalPrice(info.price);
            });
        });

        setupQuantityControls(info.price);

        document.getElementById('confirm-add-btn').onclick = () => {
            const qty = getModalQuantity();
            let finalPrice = info.price + getSelectedSizePrice();
            let orderDetails = "";

            if (isDrink) {
                const activeSize = document.querySelector('.size-pill.active');
                const sizeLabel = activeSize ? activeSize.dataset.name : 'Tall';
                const opt = item.category === 'coffee'
                    ? document.getElementById('milk-select').value
                    : document.getElementById('sweetness-select').value;
                orderDetails = `${sizeLabel} | ${opt}`;
            } else {
                orderDetails = "Fresh Dessert";
            }

            addToOrder(info.name, orderDetails, finalPrice, qty);
            showToast('Added to order!', `${qty}x ${info.name}`);
            coffeeModal.hide();

            if (triggerBtn) {
                triggerBtn.innerHTML = '<i class="bi bi-check-lg me-1"></i>ADDED';
                triggerBtn.classList.add('added');
                setTimeout(() => {
                    triggerBtn.innerHTML = '<i class="bi bi-plus-circle me-1"></i>ADD TO ORDER';
                    triggerBtn.classList.remove('added');
                }, 1200);
            }
        };

        coffeeModal.show();
    }

    window.removeItem = (i) => {
        currentOrder.splice(i, 1);
        saveAndUpdate();
    };

    window.changeItemQty = (i, delta) => {
        if (!currentOrder[i]) return;
        currentOrder[i].qty += delta;
        if (currentOrder[i].qty <= 0) {
            currentOrder.splice(i, 1);
        }
        saveAndUpdate();
    };

    window.filterMenu = (cat, evt) => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        const target = evt?.target || window.event?.target;
        if (target) target.classList.add('active');

        const filtered = cat === 'all' ? allItems : allItems.filter(i => i.category === cat);
        renderItems(filtered);
    };

    window.checkout = () => {
        if (currentOrder.length === 0) {
            alert("Your order is empty. Add items first!");
            return;
        }

        const receiptContent = document.getElementById('receipt-content');
        let total = 0;
        let html = '<div class="text-center mb-3"><h5 class="fw-bold">THE COFFEE HOUSE</h5><small class="text-muted">Thank you for your order!</small><hr></div><table class="table table-sm"><tbody>';

        currentOrder.forEach(item => {
            const lineTotal = item.price * item.qty;
            total += lineTotal;
            html += `<tr>
                <td><strong>${item.name}</strong> x${item.qty}<br><small class="text-muted">${item.details}</small></td>
                <td class="text-end align-middle">₱${lineTotal.toFixed(2)}</td>
            </tr>`;
        });

        html += `</tbody></table><hr><div class="d-flex justify-content-between fw-bold fs-5"><span>TOTAL</span><span>₱${total.toFixed(2)}</span></div>`;
        receiptContent.innerHTML = html;

        orderSummaryModal.hide();
        receiptModal.show();
    };

    window.closeReceiptAndReset = () => {
        currentOrder = [];
        saveAndUpdate();
        receiptModal.hide();
        window.showHomePage();
    };

    window.showHomePage = () => {
        document.getElementById('home-page').style.display = 'block';
        document.getElementById('order-page').style.display = 'none';
        window.scrollTo(0, 0);
    };

    window.showOrderPage = () => {
        document.getElementById('home-page').style.display = 'none';
        document.getElementById('order-page').style.display = 'block';
        window.scrollTo(0, 0);
    };

    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allItems.filter(item => {
                const label = `${item.title || ''} ${item.name || ''}`.toLowerCase();
                return label.includes(term);
            });
            renderItems(filtered);
        });
    }

    function saveAndUpdate() {
        localStorage.setItem('coffeeOrder', JSON.stringify(currentOrder));
        updateOrderUI();
    }

    function updateOrderUI() {
        const list = document.getElementById('order-list');
        const emptyState = document.getElementById('order-empty');
        const { itemCount, total } = getOrderTotals();

        list.innerHTML = '';
        if (currentOrder.length === 0) {
            emptyState.classList.remove('d-none');
        } else {
            emptyState.classList.add('d-none');
            currentOrder.forEach((item, index) => {
                const lineTotal = item.price * item.qty;
                list.innerHTML += `
                    <div class="order-item-row">
                        <div class="d-flex justify-content-between align-items-start gap-2">
                            <div style="flex:1">
                                <div class="fw-bold small">${item.name}</div>
                                <small class="text-secondary" style="font-size:0.7rem;">${item.details}</small>
                                <div class="text-accent fw-bold small mt-1">₱${lineTotal.toFixed(2)}</div>
                            </div>
                            <div class="d-flex flex-column align-items-end gap-2">
                                <button class="btn btn-sm text-danger p-0" onclick="removeItem(${index})" title="Remove">✕</button>
                                <div class="qty-control" style="transform: scale(0.85); transform-origin: right center;">
                                    <button type="button" class="qty-btn" onclick="changeItemQty(${index}, -1)">−</button>
                                    <span class="qty-value">${item.qty}</span>
                                    <button type="button" class="qty-btn" onclick="changeItemQty(${index}, 1)">+</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });
        }

        document.getElementById('order-count').textContent = itemCount;
        document.getElementById('total-price-display').textContent = `₱${total.toFixed(2)}`;
        const cartBarTotal = document.getElementById('cart-bar-total');
        if (cartBarTotal) cartBarTotal.textContent = `₱${total.toFixed(2)}`;
        const navCount = document.getElementById('nav-order-count');
        if (navCount) navCount.textContent = itemCount;
    }

    initMenu();
    updateOrderUI();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCoffeeApp);
} else {
    startCoffeeApp();
}
