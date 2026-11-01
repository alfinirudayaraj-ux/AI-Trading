// AURA - Premium Free Fire Community Hub JavaScript
// Navigation and View Management
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

// Create Action Button and Modal
const createActionBtn = document.getElementById('createActionBtn');
const createModal = document.getElementById('createModal');
const modalClose = document.getElementById('modalClose');

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Update active view
        const viewName = item.getAttribute('data-view');
        views.forEach(view => view.classList.remove('active'));
        document.getElementById(`view-${viewName}`).classList.add('active');
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Create Action Modal
createActionBtn.addEventListener('click', () => {
    createModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close Modal
modalClose.addEventListener('click', () => {
    createModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
createModal.addEventListener('click', (e) => {
    if (e.target === createModal) {
        createModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Modal action cards
const modalActionCards = document.querySelectorAll('.modal-action-card');
modalActionCards.forEach(card => {
    card.addEventListener('click', () => {
        const actionTitle = card.querySelector('h3').textContent;
        console.log(`Action: ${actionTitle}`);
        
        // Add ripple effect
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'translateX(6px) scale(1.02)';
        }, 150);
        
        // Close modal after selection
        setTimeout(() => {
            createModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }, 300);
    });
});

// Filter tabs
const filterTabs = document.querySelectorAll('.filter-tab');
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Wishlist buttons
const wishlistBtns = document.querySelectorAll('.wishlist-btn');
wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const icon = btn.querySelector('i');
        if (icon.classList.contains('ri-heart-line')) {
            icon.classList.remove('ri-heart-line');
            icon.classList.add('ri-heart-fill');
            btn.style.color = '#ff3b30';
            btn.style.background = 'rgba(255, 59, 48, 0.1)';
        } else {
            icon.classList.remove('ri-heart-fill');
            icon.classList.add('ri-heart-line');
            btn.style.color = 'var(--text-tertiary)';
            btn.style.background = 'var(--bg-tertiary)';
        }
    });
});

// Join buttons
const joinBtns = document.querySelectorAll('.join-btn');
joinBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (btn.textContent.includes('FREE')) {
            btn.textContent = 'Joined';
            btn.style.background = '#34c759';
            btn.style.boxShadow = '0 4px 12px rgba(52, 199, 89, 0.3)';
        } else {
            btn.textContent = 'Request Sent';
            btn.style.background = '#007aff';
            btn.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.3)';
        }
        btn.disabled = true;
    });
});

// Buy buttons
const buyBtns = document.querySelectorAll('.buy-btn');
buyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.textContent = 'Processing...';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Contact Seller';
            btn.style.background = '#34c759';
        }, 1000);
    });
});

// Community buttons
const commBtns = document.querySelectorAll('.comm-btn');
commBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const btnText = btn.querySelector('span').textContent;
        console.log(`Community action: ${btnText}`);
    });
});

// Content cards interaction
const contentCards = document.querySelectorAll('.content-card');
contentCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('.content-title, p')?.textContent || 'Content';
        console.log(`Opening: ${title}`);
    });
});

// Post action buttons
const postActions = document.querySelectorAll('.post-actions button');
postActions.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const icon = btn.querySelector('i');
        if (icon.classList.contains('ri-heart-line')) {
            icon.classList.remove('ri-heart-line');
            icon.classList.add('ri-heart-fill');
            btn.style.color = '#ff3b30';
            const count = btn.textContent.match(/\d+/);
            if (count) {
                btn.innerHTML = `<i class="ri-heart-fill"></i> ${parseInt(count[0]) + 1}`;
            }
        }
    });
});

// Smooth scroll behavior for better UX
let lastScroll = 0;
const topBar = document.querySelector('.top-bar');
const bottomNav = document.querySelector('.bottom-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Auto-hide/show top bar on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
        topBar.style.transform = 'translateY(-100%)';
    } else {
        topBar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Add entrance animations on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('AURA - Free Fire Community Hub initialized');
    
    // Add stagger animation to elements
    const animatedElements = document.querySelectorAll('.section-block, .community-card.discover, .leaderboard-item, .content-card');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.05}s`;
    });
});

// Touch feedback for mobile
document.addEventListener('touchstart', function() {}, {passive: true});

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);
