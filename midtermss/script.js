function startCoffeeApp() {

    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap failed to load. Check your internet connection.');
        return;
    }

    const IMAGE_BASE = 'images/';
    const PROMO_CODES = { WELCOME10: 10 };
    const ADMIN_PASS = 'coffee2024';

    const coffeeContainer = document.getElementById('coffee-container');
    const coffeeModalElement = document.getElementById('coffeeModal');
    const coffeeModal = new bootstrap.Modal(coffeeModalElement);
    const orderSummaryModal = new bootstrap.Modal(document.getElementById('orderSummaryModal'));
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    const receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'));
    const searchBar = document.getElementById('search-bar');

    let allItems = [];
    let currentFilter = 'all';
    let currentSort = 'default';
    let appliedPromo = null;
    let currentOrder = JSON.parse(localStorage.getItem('coffeeOrder')) || [];
    let favorites = JSON.parse(localStorage.getItem('coffeeFavorites')) || [];
    currentOrder = currentOrder.map(item => ({ ...item, qty: item.qty || 1, instructions: item.instructions || '' }));

    const customizations = {
        sizes: [
            { name: 'Tall', price: 0 },
            { name: 'Grande', price: 15 },
            { name: 'Venti', price: 30 }
        ],
        milk: ['Full Cream', 'Oatmilk (+₱30)', 'Soy Milk (+₱20)', 'Almond Milk (+₱25)'],
        sweetness: ['Normal Sweet', 'Less Sugar', 'No Sugar', 'Extra Honey (+₱15)']
    };

    const CATEGORY_LABELS = {
        coffee: 'Coffee', tea: 'Tea', juice: 'Juice', dessert: 'Dessert', breakfast: 'Breakfast'
    };

    const DIETARY_LABELS = {
        dairy: 'Dairy', vegan: 'Vegan', caffeine: 'Caffeine', 'gluten-free': 'Gluten-Free', nuts: 'Contains Nuts'
    };

    const FALLBACK_IMAGES = {
        coffee: IMAGE_BASE + 'latte.jpg', tea: IMAGE_BASE + 'green-tea.jpg',
        juice: IMAGE_BASE + 'lemonade.jpg', dessert: IMAGE_BASE + 'croissant.jpg', breakfast: IMAGE_BASE + 'panini.jpg'
    };

    const defaultMenuData = [
        { title: "Latte", name: "Silk Velvety Latte", price: 150, desc: "Signature espresso softened with silky steamed milk and microfoam.", image: "latte.jpg", category: "coffee", tag: "bestseller", rating: 4.9 },
        { title: "Caramel Latte", name: "Golden Caramel Latte", price: 165, desc: "Rich espresso with steamed milk and buttery caramel drizzle.", image: "caramel-latte.jpg", category: "coffee", tag: "bestseller", rating: 4.8 },
        { title: "Macchiato", name: "Classic Cloud Macchiato", price: 145, desc: "Bold espresso marked with a dollop of velvety foam.", image: "macchiato.jpg", category: "coffee", rating: 4.7 },
        { title: "Cappuccino", name: "Classic Cloud Cappuccino", price: 155, desc: "Perfectly balanced layers of espresso, milk, and foam.", image: "cappuccino.jpg", category: "coffee", tag: "bestseller", rating: 4.9 },
        { title: "Matcha Latte", name: "Ceremonial Matcha Latte", price: 170, desc: "Stone-ground matcha whisked with creamy steamed milk.", image: "matcha.jpg", category: "coffee", tag: "new", rating: 4.8 },
        { title: "Iced Latte", name: "Iced Silk Latte", price: 160, desc: "Chilled espresso and milk poured over crystal ice.", image: "iced-latte.jpg", category: "coffee", tag: "bestseller", rating: 4.8 },
        { title: "Iced Mocha", name: "Iced Dark Cocoa Mocha", price: 175, desc: "Iced latte blended with rich dark chocolate.", image: "iced-mocha.jpg", category: "coffee", rating: 4.7 },
        { title: "Frapino Caramel", name: "Caramel Frost Frapino", price: 185, desc: "Blended iced coffee topped with whipped cream and caramel.", image: "frapino-caramel.jpg", category: "coffee", rating: 4.6 },
        { title: "Frapino Mocha", name: "Mocha Frost Frapino", price: 185, desc: "Chocolatey blended coffee with whipped cream on top.", image: "frapino-mocha.jpg", category: "coffee", rating: 4.6 },
        { title: "Flat White", name: "Velvet Flat White", price: 155, desc: "Double ristretto shots with microfoam steamed milk.", image: "flat-white.jpg", category: "coffee", rating: 4.8 },
        { title: "Caramel Macchiato", name: "Layered Caramel Macchiato", price: 170, desc: "Vanilla milk layered with espresso and caramel crosshatch.", image: "caramel-macchiato.jpg", category: "coffee", tag: "bestseller", rating: 4.9 },
        { title: "Black Coffee", name: "Midnight Roast Black", price: 120, desc: "A robust and full-bodied classic brew.", image: "black-coffee.jpg", category: "coffee", rating: 4.5, dietary: ["caffeine", "vegan"] },
        { title: "Espresso", name: "Pure Heritage Espresso", price: 100, desc: "A concentrated masterpiece with rich crema.", image: "espresso.jpg", category: "coffee", rating: 4.7, dietary: ["caffeine", "vegan"] },
        { title: "Americano", name: "Smooth Heritage Americano", price: 130, desc: "Bold espresso shots gently diluted with hot water.", image: "americano.jpg", category: "coffee", rating: 4.6, dietary: ["caffeine", "vegan"] },
        { title: "Mocha", name: "Dark Cocoa Fusion Mocha", price: 165, desc: "Marriage of espresso and premium dark chocolate.", image: "mocha.jpg", category: "coffee", rating: 4.8 },
        { title: "Cold Brew", name: "Slow-Drip Cold Brew", price: 145, desc: "Steeped 18 hours for a smooth, low-acid finish.", image: "cold-brew.jpg", category: "coffee", tag: "bestseller", rating: 4.8, dietary: ["caffeine", "vegan"] },
        { title: "Spanish Latte", name: "Creamy Spanish Latte", price: 175, desc: "Espresso with condensed milk — sweet, bold, and indulgent.", image: "spanish-latte.jpg", category: "coffee", tag: "new", rating: 4.9 },
        { title: "Cortado", name: "Balanced Cortado", price: 140, desc: "Equal parts espresso and warm milk in a small glass.", image: "cortado.jpg", category: "coffee", rating: 4.7 },
        { title: "Pour Over", name: "Hand Pour Over", price: 155, desc: "Single-origin beans brewed by hand for clarity and aroma.", image: "pour-over.jpg", category: "coffee", rating: 4.8, dietary: ["caffeine", "vegan"] },
        { title: "Nitro Cold Brew", name: "Nitro Cold Brew", price: 195, desc: "Velvety nitrogen-infused cold brew with a cascading finish.", image: "nitro-cold-brew.jpg", category: "coffee", tag: "new", rating: 4.9, dietary: ["caffeine", "vegan"] },
        { title: "Vietnamese Coffee", name: "Saigon Drip Coffee", price: 160, desc: "Strong dark roast over sweetened condensed milk.", image: "vietnamese-coffee.jpg", category: "coffee", rating: 4.8 },
        { title: "White Mocha", name: "White Chocolate Mocha", price: 175, desc: "Espresso with white chocolate and steamed milk.", image: "white-mocha.jpg", category: "coffee", rating: 4.7 },
        { title: "Honey Lavender Latte", name: "Honey Lavender Latte", price: 180, desc: "Floral lavender syrup with wild honey and espresso.", image: "honey-latte.jpg", category: "coffee", tag: "new", rating: 4.8 },
        { title: "Hot Chocolate", name: "Belgian Hot Chocolate", price: 150, desc: "Rich cocoa with steamed milk and whipped cream.", image: "hot-chocolate.jpg", category: "coffee", rating: 4.7 },
        { title: "Black Tea", name: "Heritage Black Tea", price: 110, desc: "A warm, aromatic black tea brewed to perfection.", image: "black-tea.jpg", category: "tea", rating: 4.5, dietary: ["caffeine", "vegan"] },
        { title: "Green Tea", name: "Jasmine Green Tea", price: 115, desc: "Light and fragrant green tea with jasmine notes.", image: "green-tea.jpg", category: "tea", rating: 4.6, dietary: ["caffeine", "vegan"] },
        { title: "Chai Latte", name: "Spiced Chai Latte", price: 155, desc: "Warming blend of black tea, spices, and steamed milk.", image: "chai-latte.jpg", category: "tea", tag: "bestseller", rating: 4.8 },
        { title: "Chamomile", name: "Calm Chamomile Tea", price: 105, desc: "Soothing herbal infusion perfect for unwinding.", image: "chamomile.jpg", category: "tea", rating: 4.5, dietary: ["vegan", "gluten-free"] },
        { title: "Iced Matcha Tea", name: "Iced Matcha Green Tea", price: 145, desc: "Refreshing chilled matcha with a clean, grassy finish.", image: "iced-matcha.jpg", category: "tea", rating: 4.7, dietary: ["caffeine", "vegan"] },
        { title: "Frozen Lemonade", name: "Zesty Frost Lemonade", price: 140, desc: "Cold-pressed lemons blended with crushed ice.", image: "lemonade-frozen.jpg", category: "juice", rating: 4.6, dietary: ["vegan", "gluten-free"] },
        { title: "Lemonade", name: "Hand-Pressed Lemonade", price: 120, desc: "Pure, chilled lemonade with a bright citrus finish.", image: "lemonade.jpg", category: "juice", rating: 4.5, dietary: ["vegan", "gluten-free"] },
        { title: "Orange Juice", name: "Fresh Squeezed Orange", price: 130, desc: "Sweet and tangy juice from ripe Valencia oranges.", image: "orange-juice.jpg", category: "juice", rating: 4.6, dietary: ["vegan", "gluten-free"] },
        { title: "Mango Smoothie", name: "Tropical Mango Smoothie", price: 155, desc: "Blended ripe mangoes with yogurt and honey.", image: "mango-smoothie.jpg", category: "juice", tag: "bestseller", rating: 4.8 },
        { title: "Berry Blast", name: "Mixed Berry Smoothie", price: 165, desc: "Strawberry, blueberry, and raspberry blend.", image: "berry-smoothie.jpg", category: "juice", tag: "new", rating: 4.7, dietary: ["vegan", "gluten-free"] },
        { title: "Watermelon Cooler", name: "Watermelon Mint Cooler", price: 135, desc: "Fresh watermelon juice with a hint of mint.", image: "watermelon.jpg", category: "juice", rating: 4.6, dietary: ["vegan", "gluten-free"] },
        { title: "Avocado Smoothie", name: "Creamy Avocado Smoothie", price: 170, desc: "Silky avocado blended with milk and condensed cream.", image: "avocado-smoothie.jpg", category: "juice", rating: 4.7 },
        { title: "Croissant", name: "Artisanal Butter Croissant", price: 95, desc: "Flaky, hand-rolled French pastry with golden layers.", image: "croissant.jpg", category: "dessert", tag: "bestseller", rating: 4.8, dietary: ["dairy"] },
        { title: "Muffin", name: "Wild Blueberry Muffin", price: 85, desc: "Tender muffin packed with fresh blueberries.", image: "muffin.jpg", category: "dessert", rating: 4.5, dietary: ["dairy"] },
        { title: "Donut", name: "Signature Glazed Ring", price: 65, desc: "Classic melt-in-your-mouth glazed yeast donut.", image: "donut.jpg", category: "dessert", rating: 4.6, dietary: ["dairy"] },
        { title: "Chocolate Cake", name: "Decadent Truffle Slice", price: 180, desc: "Moist chocolate sponge with dark ganache frosting.", image: "chocolate-cake.jpg", category: "dessert", tag: "bestseller", rating: 4.9, dietary: ["dairy", "nuts"] },
        { title: "Cheesecake", name: "NY Classic Cheesecake", price: 195, desc: "Rich cheesecake on a buttery graham cracker crust.", image: "cheesecake.jpg", category: "dessert", rating: 4.8, dietary: ["dairy"] },
        { title: "Tiramisu", name: "Espresso Tiramisu Cup", price: 175, desc: "Mascarpone, espresso-soaked ladyfingers, and cocoa.", image: "tiramisu.jpg", category: "dessert", rating: 4.8, dietary: ["dairy", "caffeine"] },
        { title: "Brownie", name: "Fudge Walnut Brownie", price: 120, desc: "Dense chocolate brownie with crunchy walnut pieces.", image: "brownie.jpg", category: "dessert", rating: 4.7, dietary: ["dairy", "nuts"] },
        { title: "Macaron", name: "French Macaron Trio", price: 145, desc: "Delicate almond meringue cookies in assorted flavors.", image: "macaron.jpg", category: "dessert", rating: 4.7, dietary: ["dairy", "nuts"] },
        { title: "Affogato", name: "Affogato al Caffè", price: 165, desc: "Vanilla gelato drowned in a hot double espresso shot.", image: "affogato.jpg", category: "dessert", tag: "new", rating: 4.9, dietary: ["dairy", "caffeine"] },
        { title: "Gelato", name: "Vanilla Bean Gelato Scoop", price: 110, desc: "Creamy gelato with real vanilla bean specks.", image: "gelato.jpg", category: "dessert", rating: 4.6, dietary: ["dairy"] },
        { title: "Cinnamon Roll", name: "Warm Cinnamon Roll", price: 125, desc: "Soft roll with cinnamon sugar and cream cheese glaze.", image: "cinnamon-roll.jpg", category: "dessert", tag: "new", rating: 4.8, dietary: ["dairy"] },
        { title: "Cookie", name: "Chocolate Chip Cookie", price: 75, desc: "Baked fresh daily with Belgian chocolate chips.", image: "cookie.jpg", category: "dessert", rating: 4.5, dietary: ["dairy", "nuts"] },
        { title: "Banana Bread", name: "Homestyle Banana Bread", price: 90, desc: "Moist loaf with ripe bananas and walnut crunch.", image: "banana-bread.jpg", category: "dessert", rating: 4.6, dietary: ["dairy", "nuts"] },
        { title: "Cupcake", name: "Red Velvet Cupcake", price: 105, desc: "Velvety sponge topped with cream cheese frosting.", image: "cupcake.jpg", category: "dessert", rating: 4.7, dietary: ["dairy"] },
        { title: "Panini", name: "Ham & Cheese Panini", price: 185, desc: "Toasted sourdough with ham, mozzarella, and pesto.", image: "panini.jpg", category: "breakfast", tag: "bestseller", rating: 4.7, dietary: ["dairy"] },
        { title: "Avocado Toast", name: "Smashed Avocado Toast", price: 175, desc: "Sourdough with avocado, cherry tomatoes, and feta.", image: "avocado-toast.jpg", category: "breakfast", tag: "new", rating: 4.8, dietary: ["dairy"] },
        { title: "French Toast", name: "Cinnamon French Toast", price: 165, desc: "Thick brioche with maple syrup and powdered sugar.", image: "french-toast.jpg", category: "breakfast", rating: 4.7, dietary: ["dairy"] },
        { title: "Egg Sandwich", name: "Egg & Cheese Sandwich", price: 155, desc: "Fluffy eggs, cheddar, and spinach on a brioche bun.", image: "egg-sandwich.jpg", category: "breakfast", rating: 4.6, dietary: ["dairy"] }
    ];

    const testimonials = [
        { name: "Maria S.", role: "Regular Guest", text: "Best latte in Sto. Tomas! The cozy vibe makes it my go-to study spot every weekend.", stars: 5 },
        { name: "James R.", role: "Coffee Enthusiast", text: "Their cold brew is incredibly smooth. I love the Nitro — it feels like a premium café experience.", stars: 5 },
        { name: "Angelica T.", role: "DIT Student", text: "Affordable prices, beautiful presentation, and the desserts are always fresh. Highly recommend!", stars: 5 },
        { name: "Carlo M.", role: "Weekend Visitor", text: "The Spanish Latte is a must-try. Warm staff, great music, and the perfect place to unwind.", stars: 5 }
    ];

    function img(path) { return IMAGE_BASE + path; }

    function getItemImage(item) {
        if (item.image) return img(item.image);
        return FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES.coffee;
    }

    function applyDietaryDefaults(item) {
        if (item.dietary && item.dietary.length) return item.dietary;
        const d = [];
        if (item.category === 'juice' && !item.title.includes('Avocado') && !item.title.includes('Mango')) d.push('vegan', 'gluten-free');
        if (['coffee', 'tea'].includes(item.category)) { d.push('caffeine'); if (!['Espresso', 'Black Coffee', 'Americano', 'Cold Brew', 'Pour Over', 'Nitro Cold Brew'].includes(item.title)) d.push('dairy'); }
        if (item.category === 'dessert') d.push('dairy');
        if (item.category === 'breakfast') d.push('dairy');
        return d;
    }

    function loadMenuData() {
        const saved = localStorage.getItem('coffeeMenuAdmin');
        let data = JSON.parse(JSON.stringify(defaultMenuData));
        if (saved) {
            const overrides = JSON.parse(saved);
            data = data.map(item => {
                const o = overrides.find(x => x.title === item.title);
                return o ? { ...item, name: o.name ?? item.name, price: o.price ?? item.price, desc: o.desc ?? item.desc } : item;
            });
        }
        return data;
    }

    function saveMenuAdmin(overrides) {
        localStorage.setItem('coffeeMenuAdmin', JSON.stringify(overrides));
    }

    function showToast(title, message) {
        const toast = document.getElementById('order-toast');
        document.getElementById('toast-title').textContent = title;
        document.getElementById('toast-message').textContent = message;
        toast.classList.add('show');
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
    }

    function getSubtotal() {
        return currentOrder.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    function getDiscount() {
        if (!appliedPromo) return 0;
        return getSubtotal() * (appliedPromo.percent / 100);
    }

    function getOrderTotals() {
        const itemCount = currentOrder.reduce((sum, item) => sum + item.qty, 0);
        const subtotal = getSubtotal();
        const discount = getDiscount();
        return { itemCount, subtotal, discount, total: subtotal - discount };
    }

    function findMatchingOrderIndex(name, details, instructions) {
        return currentOrder.findIndex(item =>
            item.name === name && item.details === details && (item.instructions || '') === (instructions || '')
        );
    }

    function addToOrder(name, details, price, qty = 1, instructions = '') {
        const existingIndex = findMatchingOrderIndex(name, details, instructions);
        if (existingIndex >= 0) {
            currentOrder[existingIndex].qty += qty;
        } else {
            currentOrder.push({ name, details, price, qty, instructions });
        }
        saveAndUpdate();
    }

    function isFavorite(title) { return favorites.includes(title); }

    function toggleFavorite(title, e) {
        if (e) e.stopPropagation();
        const idx = favorites.indexOf(title);
        if (idx >= 0) favorites.splice(idx, 1);
        else favorites.push(title);
        localStorage.setItem('coffeeFavorites', JSON.stringify(favorites));
        renderItems(getFilteredItems());
        showToast(idx >= 0 ? 'Removed' : 'Saved!', idx >= 0 ? 'Removed from favorites' : 'Added to your favorites');
    }

    function sortItems(items) {
        const list = [...items];
        switch (currentSort) {
            case 'price-low': return list.sort((a, b) => a.price - b.price);
            case 'price-high': return list.sort((a, b) => b.price - a.price);
            case 'name': return list.sort((a, b) => (a.name || a.title).localeCompare(b.name || b.title));
            case 'rating': return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default: return list;
        }
    }

    function getFilteredItems() {
        let items = allItems;
        if (currentFilter === 'favorites') items = items.filter(i => isFavorite(i.title));
        else if (currentFilter !== 'all') items = items.filter(i => i.category === currentFilter);
        const term = searchBar ? searchBar.value.toLowerCase().trim() : '';
        if (term) {
            items = items.filter(item => {
                const label = `${item.title || ''} ${item.name || ''} ${item.desc || ''}`.toLowerCase();
                return label.includes(term);
            });
        }
        return sortItems(items);
    }

    function initMenu() {
        const loader = document.getElementById('menu-loading');
        const container = document.getElementById('coffee-container');
        if (loader) loader.style.display = 'flex';
        if (container) container.style.opacity = '0';

        setTimeout(() => {
            allItems = loadMenuData().map(item => ({
                ...item,
                image: getItemImage(item),
                dietary: applyDietaryDefaults(item)
            }));
            if (loader) loader.style.display = 'none';
            if (container) container.style.opacity = '1';
            updateMenuCountLabel(allItems.length);
            renderItems(getFilteredItems());
            renderFeaturedItems();
            renderDailySpecial();
            initTestimonials();
            updateShopStatus();
            initScrollEffects();
            renderAdminPanel();
        }, 600);
    }

    function updateMenuCountLabel(count) {
        const label = document.getElementById('menu-count-label');
        if (label) label.textContent = `Showing ${count} handcrafted items`;
    }

    function renderTagBadge(tag) {
        if (!tag) return '';
        const labels = { bestseller: 'Bestseller', new: 'New' };
        return `<span class="product-tag tag-${tag}">${labels[tag] || tag}</span>`;
    }

    function renderDietaryTags(dietary) {
        if (!dietary || !dietary.length) return '';
        return `<div class="dietary-tags">${dietary.slice(0, 3).map(d =>
            `<span class="dietary-tag tag-${d.replace(/\s/g, '-')}">${DIETARY_LABELS[d] || d}</span>`
        ).join('')}</div>`;
    }

    function renderRating(rating) {
        if (!rating) return '';
        return `<span class="card-rating"><i class="bi bi-star-fill"></i> ${rating}</span>`;
    }

    function renderItems(items) {
        updateMenuCountLabel(items.length);
        coffeeContainer.innerHTML = '';
        if (items.length === 0) {
            coffeeContainer.innerHTML = '<div class="col-12 text-center text-muted py-5"><i class="bi bi-heart display-6 d-block mb-2 opacity-50"></i>No items found. Try a different search or filter.</div>';
            return;
        }

        const fragment = document.createDocumentFragment();
        items.forEach(item => {
            const info = getProductInfo(item);
            const catLabel = CATEGORY_LABELS[item.category] || 'Item';
            const fallback = FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES.coffee;
            const fav = isFavorite(item.title);
            const col = document.createElement('div');
            col.className = 'col-6 col-md-4 col-lg-3 mb-4 menu-card-col';
            col.innerHTML = `
                <div class="card h-100 coffee-card text-white border-0 shadow-sm">
                    <div class="card-img-wrap">
                        <img src="${item.image}" alt="${info.name}"
                             onerror="this.onerror=null;this.src='${fallback}'" loading="lazy">
                        <button type="button" class="fav-btn${fav ? ' active' : ''}" data-title="${item.title}" aria-label="Favorite">
                            <i class="bi bi-heart${fav ? '-fill' : ''}"></i>
                        </button>
                        <span class="category-badge">${catLabel}</span>
                        ${renderTagBadge(item.tag)}
                    </div>
                    <div class="card-body d-flex flex-column p-3">
                        <div class="d-flex justify-content-between align-items-start gap-1 mb-1">
                            <h6 class="fw-bold mb-0 card-title-name">${info.name}</h6>
                            ${renderRating(item.rating)}
                        </div>
                        ${renderDietaryTags(item.dietary)}
                        <p class="card-desc">${info.desc}</p>
                        <p class="text-accent fw-bold mb-3 small">₱${info.price.toFixed(2)}</p>
                        <button class="btn btn-accent mt-auto rounded-pill fw-bold py-2 add-order-btn">
                            <i class="bi bi-plus-circle me-1"></i>ADD TO ORDER
                        </button>
                    </div>
                </div>`;

            col.querySelector('.fav-btn').addEventListener('click', (e) => toggleFavorite(item.title, e));
            col.querySelector('.add-order-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openOrderModal(item, info, col.querySelector('.add-order-btn'));
            });
            fragment.appendChild(col);
        });
        coffeeContainer.appendChild(fragment);
    }

    function getProductInfo(item) {
        return { name: item.name || item.title, price: item.price || 140, desc: item.desc || "A delicious selection from our menu." };
    }

    function getFeaturedItems() { return allItems.filter(i => i.tag === 'bestseller').slice(0, 8); }

    function renderFeaturedItems() {
        const container = document.getElementById('featured-items');
        if (!container) return;
        container.innerHTML = getFeaturedItems().map(item => `
            <div class="featured-card" onclick="showOrderPage()">
                <div class="featured-img" style="background-image:url('${item.image}')"></div>
                <div class="featured-info">
                    <span class="featured-cat">${CATEGORY_LABELS[item.category]}</span>
                    <h6>${item.name}</h6>
                    <span class="featured-price">₱${item.price.toFixed(2)}</span>
                </div>
            </div>`).join('');
    }

    function renderDailySpecial() {
        const el = document.getElementById('daily-special-card');
        if (!el || allItems.length === 0) return;
        const special = allItems.filter(i => i.tag === 'bestseller' || i.tag === 'new')[new Date().getDate() % 12] || allItems[0];
        el.innerHTML = `
            <div class="special-img" style="background-image:url('${special.image}')"></div>
            <div class="special-body">
                <span class="special-badge"><i class="bi bi-lightning-fill"></i> Today's Special</span>
                <h4>${special.name}</h4>
                <p>${special.desc}</p>
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <span class="special-price">₱${special.price.toFixed(2)} <small class="text-decoration-line-through text-secondary ms-1">₱${(special.price + 25).toFixed(2)}</small></span>
                    <button class="btn btn-accent rounded-pill px-4" onclick="showOrderPage()">Order Now</button>
                </div>
            </div>`;
    }

    function initTestimonials() {
        const track = document.getElementById('testimonial-track');
        if (!track) return;
        track.innerHTML = testimonials.map(t => `
            <div class="testimonial-card">
                <div class="testimonial-stars">${'★'.repeat(t.stars)}</div>
                <p class="testimonial-text">"${t.text}"</p>
                <div class="testimonial-author">
                    <div class="author-avatar">${t.name.charAt(0)}</div>
                    <div><strong>${t.name}</strong><small class="d-block text-secondary">${t.role}</small></div>
                </div>
            </div>`).join('');
    }

    function updateShopStatus() {
        const badge = document.getElementById('shop-status');
        if (!badge) return;
        const now = new Date();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        const isOpen = now.getHours() >= (isWeekend ? 8 : 7) && now.getHours() < (isWeekend ? 22 : 21);
        badge.className = 'shop-status ' + (isOpen ? 'open' : 'closed');
        badge.innerHTML = isOpen ? '<i class="bi bi-circle-fill"></i> Open Now' : '<i class="bi bi-circle-fill"></i> Closed';
    }

    function initScrollEffects() {
        const nav = document.getElementById('mainNav');
        const backTop = document.getElementById('back-to-top');
        window.addEventListener('scroll', () => {
            if (nav) nav.classList.toggle('nav-scrolled', window.scrollY > 40);
            if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
        });
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
                });
            }, { threshold: 0.12 });
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        }
    }

    function switchPage(pageId) {
        document.querySelectorAll('.page-view').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });
        const target = document.getElementById(pageId);
        if (!target) return;
        target.style.display = 'block';
        requestAnimationFrame(() => target.classList.add('active'));
        window.scrollTo(0, 0);
    }

    window.showHomePage = () => switchPage('home-page');
    window.showOrderPage = () => switchPage('order-page');
    window.showAdminPage = () => {
        const pass = prompt('Admin password:');
        if (pass === ADMIN_PASS) switchPage('admin-page');
        else if (pass) showToast('Access Denied', 'Incorrect password.');
    };

    let brandClicks = 0;
    document.querySelector('.navbar-brand')?.addEventListener('click', (e) => {
        brandClicks++;
        if (brandClicks >= 5) { brandClicks = 0; window.showAdminPage(); e.preventDefault(); }
        setTimeout(() => { brandClicks = 0; }, 2000);
    });

    function getModalQuantity() {
        const qtyEl = document.getElementById('modal-qty');
        return qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
    }

    function getSelectedSizePrice() {
        const activePill = document.querySelector('#coffeeModal .size-pill.active');
        return activePill ? parseFloat(activePill.dataset.price) : 0;
    }

    function updateModalPrice(basePrice) {
        const qty = getModalQuantity();
        const unitPrice = basePrice + getSelectedSizePrice();
        document.getElementById('modalPriceLabel').textContent = `₱${(unitPrice * qty).toFixed(2)}`;
        document.getElementById('modalUnitPrice').textContent = qty > 1 ? `₱${unitPrice.toFixed(2)} each` : '';
    }

    function setupQuantityControls(basePrice) {
        const qtyEl = document.getElementById('modal-qty');
        document.getElementById('qty-minus').onclick = () => {
            if (getModalQuantity() > 1) { qtyEl.textContent = getModalQuantity() - 1; updateModalPrice(basePrice); }
        };
        document.getElementById('qty-plus').onclick = () => {
            qtyEl.textContent = getModalQuantity() + 1; updateModalPrice(basePrice);
        };
    }

    function openOrderModal(item, info, triggerBtn) {
        const modalBody = document.querySelector('#coffeeModal .modal-body');
        const headerImg = document.getElementById('modalHeaderImg');
        const isDrink = ['coffee', 'tea', 'juice'].includes(item.category);
        headerImg.style.backgroundImage = `url(${item.image})`;

        let optionsHTML = `<h3 class="fw-bold mb-1">${info.name}</h3><p class="text-secondary mb-3 small">${info.desc}</p>${renderDietaryTags(item.dietary)}`;

        if (isDrink) {
            optionsHTML += `<div class="custom-options mb-3">
                <div class="option-label">Choose Size</div>
                <div class="size-pills mb-3">${customizations.sizes.map((s, i) =>
                    `<button type="button" class="size-pill${i === 0 ? ' active' : ''}" data-price="${s.price}" data-name="${s.name}">${s.name}<br><small>+₱${s.price}</small></button>`
                ).join('')}</div>
                ${item.category === 'coffee' ? `<div class="option-label">Milk Option</div><select id="milk-select" class="form-select bg-dark text-white border-secondary mb-3">${customizations.milk.map(m => `<option value="${m}">${m}</option>`).join('')}</select>`
                    : `<div class="option-label">Sweetness Level</div><select id="sweetness-select" class="form-select bg-dark text-white border-secondary mb-3">${customizations.sweetness.map(sw => `<option value="${sw}">${sw}</option>`).join('')}</select>`}
            </div>`;
        }

        optionsHTML += `
            <div class="option-label">Special Instructions</div>
            <textarea id="item-instructions" class="form-control checkout-input mb-3" rows="2" placeholder="e.g. Less ice, no whipped cream, extra hot..."></textarea>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="option-label mb-0">Quantity</div>
                <div class="qty-control">
                    <button type="button" class="qty-btn" id="qty-minus">−</button>
                    <span class="qty-value" id="modal-qty">1</span>
                    <button type="button" class="qty-btn" id="qty-plus">+</button>
                </div>
            </div>
            <div class="modal-price-row mb-3">
                <p id="modalPriceLabel" class="text-accent fw-bold fs-4 mb-0">₱${info.price.toFixed(2)}</p>
                <small id="modalUnitPrice" class="text-secondary"></small>
            </div>
            <button class="btn btn-accent w-100 rounded-pill fw-bold py-3" id="confirm-add-btn">ADD TO ORDER</button>`;

        modalBody.innerHTML = optionsHTML;
        document.querySelectorAll('#coffeeModal .size-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('#coffeeModal .size-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                updateModalPrice(info.price);
            });
        });
        setupQuantityControls(info.price);

        document.getElementById('confirm-add-btn').onclick = () => {
            const qty = getModalQuantity();
            const finalPrice = info.price + getSelectedSizePrice();
            const instructions = (document.getElementById('item-instructions').value || '').trim();
            let orderDetails = '';
            if (isDrink) {
                const activeSize = document.querySelector('#coffeeModal .size-pill.active');
                const sizeLabel = activeSize ? activeSize.dataset.name : 'Tall';
                const opt = item.category === 'coffee' ? document.getElementById('milk-select').value : document.getElementById('sweetness-select').value;
                orderDetails = `${sizeLabel} | ${opt}`;
            } else {
                orderDetails = item.category === 'breakfast' ? 'Fresh Breakfast' : 'Fresh Dessert';
            }
            addToOrder(info.name, orderDetails, finalPrice, qty, instructions);
            showToast('Added to order!', `${qty}x ${info.name}`);
            coffeeModal.hide();
            if (triggerBtn) {
                triggerBtn.innerHTML = '<i class="bi bi-check-lg me-1"></i>ADDED';
                triggerBtn.classList.add('added');
                setTimeout(() => { triggerBtn.innerHTML = '<i class="bi bi-plus-circle me-1"></i>ADD TO ORDER'; triggerBtn.classList.remove('added'); }, 1200);
            }
        };
        coffeeModal.show();
    }

    window.removeItem = (i) => { currentOrder.splice(i, 1); saveAndUpdate(); };
    window.changeItemQty = (i, delta) => {
        if (!currentOrder[i]) return;
        currentOrder[i].qty += delta;
        if (currentOrder[i].qty <= 0) currentOrder.splice(i, 1);
        saveAndUpdate();
    };

    window.clearCart = () => {
        if (currentOrder.length === 0) return;
        if (confirm('Clear all items from your order?')) {
            currentOrder = [];
            appliedPromo = null;
            saveAndUpdate();
            showToast('Cart cleared', 'Your order has been reset.');
        }
    };

    window.filterMenu = (cat, evt) => {
        currentFilter = cat;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        const target = evt?.currentTarget || evt?.target;
        if (target) target.classList.add('active');
        renderItems(getFilteredItems());
    };

    window.sortMenu = (sort) => { currentSort = sort; renderItems(getFilteredItems()); };

    window.applyPromoCode = () => {
        const input = document.getElementById('promo-code-input');
        const msg = document.getElementById('promo-message');
        const code = (input?.value || '').trim().toUpperCase();
        if (PROMO_CODES[code]) {
            appliedPromo = { code, percent: PROMO_CODES[code] };
            if (msg) { msg.textContent = `${code} applied — ${PROMO_CODES[code]}% off!`; msg.className = 'promo-message success'; }
            saveAndUpdate();
            showToast('Promo applied!', `${PROMO_CODES[code]}% discount added.`);
        } else {
            appliedPromo = null;
            if (msg) { msg.textContent = 'Invalid promo code.'; msg.className = 'promo-message error'; }
            saveAndUpdate();
        }
    };

    window.openCheckout = () => {
        if (currentOrder.length === 0) { alert('Your order is empty. Add items first!'); return; }
        const preview = document.getElementById('checkout-total-preview');
        if (preview) preview.textContent = `₱${getOrderTotals().total.toFixed(2)}`;
        orderSummaryModal.hide();
        checkoutModal.show();
    };

    function generateOrderNumber() {
        const n = parseInt(localStorage.getItem('coffeeOrderNum') || '1000', 10) + 1;
        localStorage.setItem('coffeeOrderNum', String(n));
        return `CFH-${n}`;
    }

    function getEstimatedMinutes() {
        const items = currentOrder.reduce((s, i) => s + i.qty, 0);
        return Math.min(45, 10 + items * 3);
    }

    window.placeOrder = () => {
        const name = (document.getElementById('customer-name')?.value || '').trim();
        const phone = (document.getElementById('customer-phone')?.value || '').trim();
        const orderType = document.querySelector('input[name="order-type"]:checked')?.value || 'pickup';
        const orderNotes = (document.getElementById('order-instructions')?.value || '').trim();

        if (!name) { alert('Please enter your name.'); return; }
        if (!phone) { alert('Please enter your contact number.'); return; }

        const { subtotal, discount, total } = getOrderTotals();
        const orderNum = generateOrderNumber();
        const eta = getEstimatedMinutes();
        const orderTypeLabel = { pickup: 'Pickup', dinein: 'Dine-in' }[orderType];

        const receiptContent = document.getElementById('receipt-content');
        let html = `<div class="receipt-printable">
            <div class="text-center mb-3 receipt-header">
                <h5 class="fw-bold mb-1">THE COFFEE HOUSE</h5>
                <p class="mb-1 receipt-order-num">Order ${orderNum}</p>
                <p class="mb-1 small text-muted">${orderTypeLabel} · Ready in ~${eta} mins</p>
                <p class="mb-0 small"><strong>${name}</strong> · ${phone}</p>
                ${orderNotes ? `<p class="mb-0 small text-muted mt-1">Note: ${orderNotes}</p>` : ''}
                <hr>
            </div>
            <table class="table table-sm receipt-table"><tbody>`;

        currentOrder.forEach(item => {
            const lineTotal = item.price * item.qty;
            html += `<tr>
                <td><strong>${item.name}</strong> x${item.qty}<br>
                <small class="text-muted">${item.details}</small>
                ${item.instructions ? `<br><small class="text-muted"><i>Note:</i> ${item.instructions}</small>` : ''}</td>
                <td class="text-end align-middle">₱${lineTotal.toFixed(2)}</td>
            </tr>`;
        });

        html += `</tbody></table><hr class="receipt-divider">
            <div class="receipt-totals">
                <div class="d-flex justify-content-between small"><span>Subtotal</span><span>₱${subtotal.toFixed(2)}</span></div>`;
        if (discount > 0) {
            html += `<div class="d-flex justify-content-between small text-success"><span>Discount (${appliedPromo.code})</span><span>-₱${discount.toFixed(2)}</span></div>`;
        }
        html += `<div class="d-flex justify-content-between fw-bold fs-5 mt-2"><span>TOTAL</span><span>₱${total.toFixed(2)}</span></div>
            </div>
            <p class="text-center small text-muted mt-3 mb-0">Thank you for your order!</p>
        </div>`;

        receiptContent.innerHTML = html;
        checkoutModal.hide();
        receiptModal.show();
    };

    window.printReceipt = () => window.print();

    window.closeReceiptAndReset = () => {
        currentOrder = [];
        appliedPromo = null;
        const promoInput = document.getElementById('promo-code-input');
        if (promoInput) promoInput.value = '';
        const promoMsg = document.getElementById('promo-message');
        if (promoMsg) promoMsg.textContent = '';
        ['customer-name', 'customer-phone', 'order-instructions'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        saveAndUpdate();
        receiptModal.hide();
        window.showHomePage();
    };

    window.subscribeNewsletter = (e) => {
        e.preventDefault();
        const input = document.getElementById('newsletter-email');
        if (input?.value.trim()) { showToast('Welcome!', 'You\'re subscribed to our coffee updates.'); input.value = ''; }
    };

    function renderAdminPanel() {
        const tbody = document.getElementById('admin-menu-body');
        if (!tbody) return;
        tbody.innerHTML = allItems.map((item, i) => `
            <tr>
                <td><span class="badge bg-secondary">${CATEGORY_LABELS[item.category]}</span></td>
                <td class="small">${item.title}</td>
                <td><input type="text" class="form-control form-control-sm admin-input" data-field="name" data-idx="${i}" value="${item.name}"></td>
                <td><input type="number" class="form-control form-control-sm admin-input" data-field="price" data-idx="${i}" value="${item.price}" min="1"></td>
                <td><input type="text" class="form-control form-control-sm admin-input" data-field="desc" data-idx="${i}" value="${item.desc}"></td>
            </tr>`).join('');
    }

    window.saveAdminMenu = () => {
        const overrides = [];
        document.querySelectorAll('#admin-menu-body tr').forEach((row, i) => {
            if (!allItems[i]) return;
            overrides.push({
                title: allItems[i].title,
                name: row.querySelector('[data-field="name"]').value,
                price: parseFloat(row.querySelector('[data-field="price"]').value) || allItems[i].price,
                desc: row.querySelector('[data-field="desc"]').value
            });
        });
        saveMenuAdmin(overrides);
        initMenu();
        showToast('Menu saved!', 'Prices and details updated.');
    };

    window.resetAdminMenu = () => {
        if (confirm('Reset all menu items to defaults?')) {
            localStorage.removeItem('coffeeMenuAdmin');
            initMenu();
            showToast('Reset complete', 'Menu restored to defaults.');
        }
    };

    if (searchBar) searchBar.addEventListener('input', () => renderItems(getFilteredItems()));
    document.getElementById('sort-select')?.addEventListener('change', (e) => window.sortMenu(e.target.value));

    function saveAndUpdate() {
        localStorage.setItem('coffeeOrder', JSON.stringify(currentOrder));
        updateOrderUI();
    }

    function updateOrderUI() {
        const list = document.getElementById('order-list');
        const emptyState = document.getElementById('order-empty');
        const checkoutSection = document.getElementById('checkout-section');
        const { itemCount, subtotal, discount, total } = getOrderTotals();

        if (currentOrder.length === 0) {
            emptyState?.classList.remove('d-none');
            checkoutSection?.classList.add('d-none');
            list.innerHTML = '';
        } else {
            emptyState?.classList.add('d-none');
            checkoutSection?.classList.remove('d-none');
            list.innerHTML = currentOrder.map((item, index) => {
                const lineTotal = item.price * item.qty;
                return `<div class="order-item-row">
                    <div class="d-flex justify-content-between align-items-start gap-2">
                        <div style="flex:1">
                            <div class="fw-bold small">${item.name}</div>
                            <small class="text-secondary" style="font-size:0.7rem;">${item.details}</small>
                            ${item.instructions ? `<small class="d-block text-accent" style="font-size:0.68rem;"><i class="bi bi-chat-left-text me-1"></i>${item.instructions}</small>` : ''}
                            <div class="text-accent fw-bold small mt-1">₱${lineTotal.toFixed(2)}</div>
                        </div>
                        <div class="d-flex flex-column align-items-end gap-2">
                            <button class="btn btn-sm text-danger p-0" onclick="removeItem(${index})" title="Remove">✕</button>
                            <div class="qty-control" style="transform:scale(0.85);transform-origin:right center;">
                                <button type="button" class="qty-btn" onclick="changeItemQty(${index}, -1)">−</button>
                                <span class="qty-value">${item.qty}</span>
                                <button type="button" class="qty-btn" onclick="changeItemQty(${index}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }

        const subEl = document.getElementById('subtotal-display');
        const discRow = document.getElementById('discount-row');
        const discEl = document.getElementById('discount-display');
        if (subEl) subEl.textContent = `₱${subtotal.toFixed(2)}`;
        if (discount > 0 && discRow && discEl) {
            discRow.classList.remove('d-none');
            discEl.textContent = `-₱${discount.toFixed(2)}`;
        } else if (discRow) discRow.classList.add('d-none');

        document.getElementById('order-count').textContent = itemCount;
        document.getElementById('total-price-display').textContent = `₱${total.toFixed(2)}`;
        const cartBarTotal = document.getElementById('cart-bar-total');
        if (cartBarTotal) cartBarTotal.textContent = `₱${total.toFixed(2)}`;
        const navCount = document.getElementById('nav-order-count');
        if (navCount) navCount.textContent = itemCount;
        const checkoutPreview = document.getElementById('checkout-total-preview');
        if (checkoutPreview) checkoutPreview.textContent = `₱${total.toFixed(2)}`;
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(() => {});
        });
    }

    switchPage('home-page');
    initMenu();
    updateOrderUI();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCoffeeApp);
} else {
    startCoffeeApp();
}
