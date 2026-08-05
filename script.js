document.addEventListener('DOMContentLoaded', function() {
    // Dropdown menu script
    const dropdowns = document.querySelectorAll('.has-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.parentElement === this) {
                e.preventDefault();
                const subMenu = this.querySelector('.sub-menu');
                const icon = this.querySelector('.dropdown-icon');
                subMenu.classList.toggle('active');
                icon.classList.toggle('rotate');
            }
        });
    });

    // Sidebar toggle (collapse/expand)
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    function setSidebarCollapsed(collapsed){
        if(!sidebar) return;
        if(collapsed){
            sidebar.classList.add('collapsed');
            sidebarToggle && (sidebarToggle.innerHTML = '<i class="fas fa-angle-double-right"></i>');
        } else {
            sidebar.classList.remove('collapsed');
            sidebarToggle && (sidebarToggle.innerHTML = '<i class="fas fa-angle-double-left"></i>');
        }
        localStorage.setItem('sidebarCollapsed', collapsed ? '1' : '0');
    }
    if(sidebarToggle){
        sidebarToggle.addEventListener('click', function(e){
            e.stopPropagation();
            const collapsed = !sidebar.classList.contains('collapsed');
            setSidebarCollapsed(collapsed);
        });
    }
    // initialize from storage
    if(localStorage.getItem('sidebarCollapsed') === '1') setSidebarCollapsed(true);

    // Product data (sample)
    const products = [
        {
            id: 'p1',
            title: 'Akun Level 60',
            price: 'Rp 150.000',
            description: 'Akun siap pakai dengan progress tinggi dan item langka. Cocok untuk pemain kompetitif.',
            image: 'images/qiqi1.png',
            rating: '4.9 ★',
            sold: 'Terjual 120+',
            badge: 'Popular',
            category: 'rawat'
        },
        {
            id: 'p2',
            title: 'Rawat Akun Profesional',
            price: 'Rp 75.000',
            description: 'Maintenance akun termasuk security check, optimasi, dan backup data penting.',
            image: 'images/qiqi1.png',
            rating: '4.8 ★',
            sold: 'Terjual 80+',
            category: 'rawat'
        },
        {
            id: 'p3',
            title: 'Paket Material Lengkap',
            price: 'Rp 45.000',
            description: 'Bundle material untuk leveling dan upgrade, hemat dan efektif.',
            image: 'images/qiqi1.png',
            rating: '4.7 ★',
            sold: 'Terjual 60+',
            category: 'material'
        },
        {
            id: 'p4',
            title: 'Topup Paket Bronze',
            price: 'Rp 25.000',
            description: 'Topup cepat untuk berbagai metode pembayaran.',
            image: 'images/qiqi1.png',
            rating: '4.6 ★',
            sold: 'Terjual 200+',
            category: 'topup'
        }
    ];

    // Render product cards with optional filtering
    const container = document.getElementById('produk-container');
    let currentFilter = 'all';
    function renderProducts(filter = 'all') {
        currentFilter = filter;
        const filtered = (filter === 'all') ? products : products.filter(p => p.category === filter);
        if (filtered.length === 0) {
            container.innerHTML = '<p class="no-products">Tidak ada produk di kategori ini.</p>';
            return;
        }

        container.innerHTML = filtered.map(p => `
            <article class="produk-item" data-id="${p.id}" tabindex="0">
                ${p.badge ? `<span class="popular-badge">${p.badge}</span>` : ''}
                <img src="${p.image}" alt="${p.title}">
                <div class="produk-info">
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                    <div class="produk-meta">
                        <span class="rating">${p.rating}</span>
                        <span class="sold">${p.sold}</span>
                    </div>
                    <span class="harga">${p.price}</span>
                    <button class="beli-btn" data-id="${p.id}">Beli Sekarang</button>
                </div>
            </article>
        `).join('');

        // Attach click handlers for opening modal
        container.querySelectorAll('.produk-item').forEach(card => {
            card.addEventListener('click', openModalFromCard);
            card.addEventListener('keydown', function(e){ if(e.key === 'Enter') openModalFromCard.call(this, e); });
        });
        // Prevent card click when pressing buy button
        container.querySelectorAll('.beli-btn').forEach(btn => {
            btn.addEventListener('click', function(e){
                e.stopPropagation();
                const id = this.dataset.id;
                // Here could trigger checkout flow; for now show modal
                openModal(id);
            });
        });
    }

    // Menu filtering logic
    const menuLinks = document.querySelectorAll('.menu a[data-category]');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e){
            e.preventDefault();
            const cat = this.dataset.category || 'all';
            // set active class
            document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            // close dropdown if open
            const parent = this.closest('.has-dropdown');
            if (parent) {
                const sub = parent.querySelector('.sub-menu');
                const icon = parent.querySelector('.dropdown-icon');
                if (sub) sub.classList.remove('active');
                if (icon) icon.classList.remove('rotate');
            }
            renderProducts(cat);
        });
    });

    // initial render
    renderProducts();

    // Modal logic
    const modalOverlay = document.getElementById('product-modal');
    const modalClose = document.getElementById('modal-close');
    function openModalFromCard(e){
        const id = this.dataset.id;
        openModal(id);
    }

    function openModal(id){
        const p = products.find(x => x.id === id);
        if(!p) return;
        document.getElementById('modal-title').textContent = p.title;
        const img = document.getElementById('modal-image'); img.src = p.image; img.alt = p.title;
        document.getElementById('modal-description').textContent = p.description;
        document.getElementById('modal-rating').textContent = p.rating;
        document.getElementById('modal-sold').textContent = p.sold;
        document.getElementById('modal-price').textContent = p.price;
        modalOverlay.classList.remove('hidden');
        modalOverlay.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(){
        modalOverlay.classList.add('hidden');
        modalOverlay.setAttribute('aria-hidden','true');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e){ if(e.target === this) closeModal(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

    renderProducts();
});