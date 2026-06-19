document.addEventListener('DOMContentLoaded', () => {
    // --- STICKY HEADER & BACK TO TOP ---
    const header = document.querySelector('header');
    const backToTopBtn = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        highlightNavOnScroll();
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- MOBILE MENU TOGGLE ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isActive = navLinks.classList.contains('active');
            mobileToggle.innerHTML = isActive 
                ? '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>'
                : '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>';
        });

        // Close menu when clicking nav link
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.innerHTML = '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>';
            });
        });
    }

    // --- NAVIGATION HIGHLIGHT ON SCROLL (SCROLL SPY) ---
    const sections = document.querySelectorAll('section');
    
    function highlightNavOnScroll() {
        let scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // --- VEHICLE AUTO-SELECT FROM FLEET ---
    const vehicleSelect = document.getElementById('vehicle-select');
    const bookButtons = document.querySelectorAll('.fleet-btn');

    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const vehicleName = e.currentTarget.getAttribute('data-vehicle');
            if (vehicleSelect && vehicleName) {
                vehicleSelect.value = vehicleName;
                
                // Smooth scroll to contact/booking section
                const bookingSection = document.getElementById('contact');
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth' });
                }

                showToast(`Selected ${vehicleName.replace('-', ' ')}! Fill in details to book.`, 'success');
            }
        });
    });

    // --- MODAL POPUP LOGIC ---
    const modalOverlay = document.getElementById('enquiry-modal');
    const modalClose = document.querySelector('.modal-close');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const modalForm = document.getElementById('modal-booking-form');

    function openModal() {
        if (modalOverlay) modalOverlay.classList.add('active');
    }

    function closeModal() {
        if (modalOverlay) modalOverlay.classList.remove('active');
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // --- TOAST NOTIFICATIONS ---
    function showToast(message, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconSvg = type === 'success' 
            ? '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            : '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
            
        toast.innerHTML = `${iconSvg} <span>${message}</span>`;
        container.appendChild(toast);

        // Show toast animation frame
        setTimeout(() => toast.classList.add('show'), 50);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // Make showToast accessible globally
    window.showToast = showToast;

    // --- WHATSAPP FORM SUBMISSION LOGIC ---
    const contactForm = document.getElementById('booking-form');

    function handleBookingSubmit(form, isModal = false) {
        const name = form.querySelector('[name="name"]').value.trim();
        const phone = form.querySelector('[name="phone"]').value.trim();
        const whatsapp = form.querySelector('[name="whatsapp"]')?.value.trim() || phone;
        const date = form.querySelector('[name="date"]').value;
        const vehicle = form.querySelector('[name="vehicle"]').value;
        const service = form.querySelector('[name="service"]').value;
        const message = form.querySelector('[name="message"]').value.trim();

        if (!name || !phone || !date || !vehicle || !service) {
            showToast('Please fill in all required fields.', 'warning');
            return;
        }

        // Format Vehicle name for display
        const vehicleLabel = vehicle.replace('-', ' ').toUpperCase();

        // Build WhatsApp message content
        const waNumber = '919443542066'; // Owner's phone number +91 9443542066
        const waMessage = 
`✨ *KUMAR TRAVELS - BOOKING ENQUIRY* ✨
----------------------------------------
👤 *Customer Name:* ${name}
📞 *Phone Number:* ${phone}
💬 *WhatsApp Number:* ${whatsapp}
🗓️ *Journey Date:* ${date}
🚗 *Vehicle Chosen:* ${vehicleLabel}
💼 *Service Category:* ${service}
📝 *Journey Details:* ${message ? message : 'No additional requirements specified.'}
----------------------------------------
_Sent via website booking portal._`;

        const encodedText = encodeURIComponent(waMessage);
        const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;

        showToast('Form verified! Redirecting to WhatsApp for instant confirmation...', 'success');

        if (isModal) {
            closeModal();
        }
        
        form.reset();

        // Delay redirect to let user see successful toast
        setTimeout(() => {
            window.open(waUrl, '_blank');
        }, 1500);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleBookingSubmit(contactForm, false);
        });
    }

    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleBookingSubmit(modalForm, true);
        });
    }
});
