// ==========================================
// FANCY WORLD - HIGH PERFORMANCE JS ENGINE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SMART ACTIVE LINK HIGHLIGHTING
    const highlightActiveNav = () => {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-links a, .category-item, .bottom-nav__item').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/home' && href === '/home')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    highlightActiveNav();

    // 2. IMAGE LAZY LOADING (PREMIUM SPEED)
    // VIVA: Only loads images when they are about to enter the viewport.
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));

    // 3. SMOOTH PAGE TRANSITIONS
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease-in-out';
    setTimeout(() => document.body.style.opacity = '1', 50);

    // 4. OPTIMIZED ADD TO CART (AJAX)
    window.addToCart = function(event, name, price, image) {
        event.preventDefault();
        event.stopPropagation();
        
        const btn = event.currentTarget;
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        btn.disabled = true;

        fetch('/api/add_to_cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, image })
        })
        .then(res => res.json())
        .then(data => {
            updateCartBadge(data.count);
            btn.innerHTML = '<i class="fas fa-check"></i> Added';
            btn.style.background = '#2ecc71';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 1500);
        })
        .catch(() => {
            btn.innerHTML = 'Error';
            btn.disabled = false;
        });
    };

    function updateCartBadge(count) {
        document.querySelectorAll('.cart-badge').forEach(badge => {
            badge.innerText = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        });
    }

    // 5. AJAX CATEGORY FILTERING (INSTANT FEEL)
    window.filterCategory = function(category) {
        const container = document.getElementById('products-container');
        if (!container) return;

        // Show Loading Spinner
        container.style.opacity = '0.3';
        const loader = document.createElement('div');
        loader.id = 'category-loader';
        loader.innerHTML = '<div class="spinner-gold"></div>';
        container.parentElement.appendChild(loader);

        fetch(`/api/category/${category}`)
            .then(res => res.json())
            .then(data => {
                renderProducts(data.products);
                highlightActiveNav(); // Re-highlight if needed
            })
            .finally(() => {
                container.style.opacity = '1';
                document.getElementById('category-loader')?.remove();
            });
    };

    function renderProducts(products) {
        const container = document.getElementById('products-container');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = '<div class="no-results">No pieces found in this category.</div>';
            return;
        }

        container.innerHTML = products.map(p => `
            <div class="product-card" onclick="window.location.href='/customize/${p._id}'">
                <div class="product-img-wrapper">
                    <img src="placeholder.jpg" data-src="${p.image_url}" alt="${p.name}" class="product-img lazy">
                </div>
                <div class="product-info">
                    <h4 class="product-title">${p.name}</h4>
                    <p class="product-price">₹${parseFloat(p.price).toFixed(2)}</p>
                    <button class="cta-btn" onclick="addToCart(event, '${p.name}', ${p.price}, '${p.image_url}')">
                        Add to Bag
                    </button>
                </div>

            </div>
        `).join('');

        // Re-initialize lazy loading for new items
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
});
