document.addEventListener('DOMContentLoaded', () => {

    const coffeeContainer = document.getElementById('coffee-container');
    const coffeeModalElement = document.getElementById('coffeeModal');
    const coffeeModal = new bootstrap.Modal(coffeeModalElement);
    const orderSummaryModal = new bootstrap.Modal(document.getElementById('orderSummaryModal'));
    const receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'));
    const searchBar = document.getElementById('search-bar');

    let allItems = [];
    let currentOrder = JSON.parse(localStorage.getItem('coffeeOrder')) || [];


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
        "Black": { name: "Midnight Roast Black", price: 120, desc: "A robust and full-bodied classic brew." },
        "Latte": { name: "Silk Velvety Latte", price: 150, desc: "Our signature espresso softened with silky milk." },
        "Espresso": { name: "Pure Heritage Espresso", price: 100, desc: "A concentrated masterpiece with rich crema." },
        "Cappuccino": { name: "Classic Cloud Cappuccino", price: 155, desc: "Perfectly balanced layers of espresso and foam." },
        "Americano": { name: "Smooth Heritage Americano", price: 130, desc: "Bold espresso shots gently diluted with hot water." },
        "Mocha": { name: "Dark Cocoa Fusion Mocha", price: 165, desc: "Marriage of espresso and premium dark chocolate." }
    };

    const pastryLibrary = [
        { title: "Croissant", name: "Artisanal Butter Croissant", price: 95, desc: "Hand-rolled French pastry.", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600", category: "pastry" },
        { title: "Muffin", name: "Wild Blueberry Muffin", price: 85, desc: "Tender muffin packed with blueberries.", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600", category: "pastry" },
        { title: "Donut", name: "Signature Glazed Ring", price: 65, desc: "Classic melt-in-your-mouth yeast donut.", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600", category: "pastry" },
        { title: "Chocolate Cake", name: "Decadent Truffle Slice", price: 180, desc: "Moist chocolate sponge and dark ganache.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600", category: "pastry" },
        { title: "Cheesecake", name: "NY Classic Cheesecake", price: 195, desc: "Rich cheesecake on a buttery graham crust.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600", category: "pastry" }
    ];

    const juiceItems = [
        { title: "Frozen Lemonade", name: "Zesty Frost Lemonade", price: 140, desc: "Cold-pressed lemons blended with crushed ice.", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600", category: "juice" },
        { title: "Lemonade", name: "Hand-Pressed Lemonade", price: 120, desc: "Pure, chilled lemonade.", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600", category: "juice" }
    ];


    async function fetchData() {
        try {
            const res = await fetch('https://api.sampleapis.com/coffee/hot');
            const data = await res.json();

            const processedAPIData = data.map(item => {
                let category = 'coffee';
                if (item.title.toLowerCase().includes('juice') || item.title.toLowerCase().includes('lemonad')) {
                    category = "juice";
                }
                return { ...item, category: category };
            });

            allItems = [...processedAPIData, ...juiceItems, ...pastryLibrary];
            renderItems(allItems);
        } catch (e) {
            console.error("Fetch Error:", e);
            allItems = [...juiceItems, ...pastryLibrary];
            renderItems(allItems);
        }
    }


    function renderItems(items) {
        coffeeContainer.innerHTML = '';
        if (items.length === 0) {
            coffeeContainer.innerHTML = '<div class="col-12 text-center text-muted py-5">No items found..</div>';
            return;
        }

        const fragment = document.createDocumentFragment();
        items.forEach(item => {
            const info = getProductInfo(item);
            const col = document.createElement('div');
            col.className = 'col-6 col-md-4 col-lg-3 mb-4';
            col.innerHTML = `
                <div class="card h-100 coffee-card text-white border-0 shadow-sm" style="background: #1e293b; border-radius: 15px; cursor: pointer;">
                    <div style="height:160px; overflow:hidden; border-radius: 15px 15px 0 0;">
                        <img src="${item.image}" class="w-100 h-100" style="object-fit:cover;" 
                             onerror="this.src='https://placehold.co/400?text=Coffee+House'" loading="lazy">
                    </div>
                    <div class="card-body d-flex flex-column p-3">
                        <h6 class="fw-bold mb-1" style="font-size: 0.9rem;">${info.name}</h6>
                        <p class="text-accent fw-bold mb-3 small">₱${info.price.toFixed(2)}</p>
                        <button class="btn btn-accent mt-auto rounded-pill fw-bold py-1 view-btn" style="font-size: 0.75rem;">VIEW</button>
                    </div>
                </div>`;

            col.addEventListener('click', () => displayModal(item, info));
            fragment.appendChild(col);
        });
        coffeeContainer.appendChild(fragment);
    }

    function getProductInfo(item) {
        if (item.category === "pastry" || item.category === "juice") {
            return {
                name: item.name || item.title,
                price: item.price || 135,
                desc: item.desc || "Refreshing selection for your day."
            };
        }
        const lib = drinkLibrary[item.title];
        return {
            name: lib ? lib.name : item.title,
            price: lib ? lib.price : 140,
            desc: lib ? lib.desc : "Expertly crafted specialty coffee brew."
        };
    }


    function displayModal(item, info) {
        const modalBody = document.querySelector('.modal-body');
        const headerImg = document.getElementById('modalHeaderImg');

        headerImg.style.backgroundImage = `url(${item.image})`;
        const isDrink = item.category === 'coffee' || item.category === 'juice';

        let optionsHTML = `
            <h3 class="fw-bold mb-1">${info.name}</h3>
            <p class="text-secondary mb-3 small">${info.desc}</p>
        `;

        if (isDrink) {
            optionsHTML += `
                <div class="custom-options mb-4">
                    <label class="small fw-bold text-accent mb-1 d-block">SIZE</label>
                    <select id="size-select" class="form-select bg-dark text-white border-secondary mb-3">
                        ${customizations.sizes.map(s => `<option value="${s.price}">${s.name} (+₱${s.price})</option>`).join('')}
                    </select>
                    ${item.category === 'coffee' ? `
                        <label class="small fw-bold text-accent mb-1 d-block">MILK OPTION</label>
                        <select id="milk-select" class="form-select bg-dark text-white border-secondary mb-3">
                            ${customizations.milk.map(m => `<option value="${m}">${m}</option>`).join('')}
                        </select>
                    ` : `
                        <label class="small fw-bold text-accent mb-1 d-block">SWEETNESS LEVEL</label>
                        <select id="sweetness-select" class="form-select bg-dark text-white border-secondary mb-3">
                            ${customizations.sweetness.map(sw => `<option value="${sw}">${sw}</option>`).join('')}
                        </select>
                    `}
                </div>
            `;
        }

        optionsHTML += `
            <p id="modalPriceLabel" class="text-accent fw-bold fs-4 mb-3">₱${info.price.toFixed(2)}</p>
            <button class="btn btn-accent w-100 rounded-pill fw-bold py-2" id="confirm-add-btn">ADD TO TRAY</button>
        `;

        modalBody.innerHTML = optionsHTML;


        const szSelect = document.getElementById('size-select');
        if (szSelect) {
            szSelect.addEventListener('change', () => {
                const currentTotal = info.price + parseFloat(szSelect.value);
                document.getElementById('modalPriceLabel').innerText = `₱${currentTotal.toFixed(2)}`;
            });
        }

        document.getElementById('confirm-add-btn').onclick = () => {
            let finalPrice = info.price;
            let orderDetails = "";

            if (isDrink) {
                const sz = document.getElementById('size-select');
                finalPrice += parseFloat(sz.value);
                const sizeLabel = sz.options[sz.selectedIndex].text.split(' ')[0];
                const opt = item.category === 'coffee' ?
                    document.getElementById('milk-select').value :
                    document.getElementById('sweetness-select').value;
                orderDetails = `${sizeLabel} | ${opt}`;
            } else {
                orderDetails = "Fresh Pastry";
            }

            currentOrder.push({ name: info.name, details: orderDetails, price: finalPrice, qty: 1 });
            saveAndUpdate();
            coffeeModal.hide();
        };

        coffeeModal.show();
    }


    window.removeItem = (i) => {
        currentOrder.splice(i, 1);
        saveAndUpdate();
    };

    window.filterMenu = (cat) => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));

        if (event) event.target.classList.add('active');

        const filtered = cat === 'all' ? allItems : allItems.filter(i => i.category === cat);
        renderItems(filtered);
    };

    window.checkout = () => {
        if (currentOrder.length === 0) {
            alert("Empty tray!");
            return;
        }

        const receiptContent = document.getElementById('receipt-content');
        let total = 0;
        let html = '<div class="text-center mb-3"><h5 class="fw-bold">THE COFFEE HOUSE</h5><hr></div><table class="table table-sm borderless"><tbody>';

        currentOrder.forEach(item => {
            total += item.price;
            html += `<tr><td><strong>${item.name}</strong><br><small>${item.details}</small></td><td class="text-end">₱${item.price.toFixed(2)}</td></tr>`;
        });

        html += `</tbody></table><hr><div class="d-flex justify-content-between fw-bold"><span>TOTAL:</span><span>₱${total.toFixed(2)}</span></div>`;
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
                const name = (item.title || item.name || "").toLowerCase();
                return name.includes(term);
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
        let total = 0;
        list.innerHTML = '';
        currentOrder.forEach((item, index) => {
            total += item.price;
            list.innerHTML += `
                <div class="d-flex justify-content-between align-items-center bg-dark p-2 rounded mb-2 text-white">
                    <div style="flex:1"><small class="fw-bold">${item.name}</small><br><small class="text-muted" style="font-size:0.65rem;">${item.details}</small></div>
                    <div class="text-end"><small class="text-accent me-2">₱${item.price.toFixed(2)}</small> <button class="btn btn-sm text-danger" onclick="removeItem(${index})">✕</button></div>
                </div>`;
        });
        document.getElementById('order-count').innerText = currentOrder.length;
        document.getElementById('total-price-display').innerText = `₱${total.toFixed(2)}`;
    }

    fetchData();
    updateOrderUI();
});