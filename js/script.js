/**
 * BJ VISA CONSULTANCY - MAIN JAVASCRIPT
 * Tagline: "Your Trusted Visa Partner"
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year in Footer
  const yearSpans = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(el => el.textContent = currentYear || '2026');

  // 2. Sticky Navbar Compact Scroll Effect
  const navbar = document.querySelector('.navbar-bj');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Navbar compact styling
    if (navbar) {
      if (scrollPos > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    }
  });

  // Back to top click handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Highlight Active Navigation Item Based on URL
  const navLinks = document.querySelectorAll('.navbar-bj .nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (currentPath !== 'index.html' && href !== currentPath) {
      link.classList.remove('active');
    }
  });

  // Mobile nav auto-close when clicking links
  const navbarCollapse = document.querySelector('.navbar-collapse');
  if (navbarCollapse) {
    const mobileNavLinks = navbarCollapse.querySelectorAll('.nav-link, .btn-nav-enquire');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse && window.innerWidth < 992) {
          bsCollapse.hide();
        }
      });
    });
  }

  // 4. Destinations Filtering Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const destinationItems = document.querySelectorAll('.destination-filter-item');

  if (filterBtns.length > 0 && destinationItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        destinationItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 5. Pre-fill Universal Enquiry Modal
  const enquiryModal = document.getElementById('enquiryModal');
  if (enquiryModal) {
    enquiryModal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      if (button) {
        const visaType = button.getAttribute('data-visa-type');
        const destination = button.getAttribute('data-destination');
        
        const visaSelect = enquiryModal.querySelector('#modalVisaType');
        const countryInput = enquiryModal.querySelector('#modalCountry');

        if (visaSelect && visaType) {
          visaSelect.value = visaType;
        }
        if (countryInput && destination) {
          countryInput.value = destination;
        }
      }
    });
  }

  // 6. Generic Form Submission & Validation Simulation
  const handleFormSubmit = (form, successMessage) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...`;
      }

      // Simulate prompt and professional verification
      setTimeout(() => {
        // Hide modal if form was inside modal
        if (enquiryModal && form.closest('#enquiryModal')) {
          const bsModal = bootstrap.Modal.getInstance(enquiryModal);
          if (bsModal) bsModal.hide();
        }

        // Show toast
        showToast(successMessage || 'Thank you! Your enquiry has been received. Our visa consultancy team in Hyderabad will contact you shortly.');

        // Reset form
        form.reset();
        form.classList.remove('was-validated');

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }, 900);
    });
  };

  // Attach submission handlers to various forms
  const heroEnquiryForm = document.getElementById('heroEnquiryForm');
  if (heroEnquiryForm) {
    handleFormSubmit(heroEnquiryForm, 'Thank you! Your visa enquiry has been received. Our specialists will reach out via WhatsApp/Phone shortly.');
  }

  const modalEnquiryForm = document.getElementById('modalEnquiryForm');
  if (modalEnquiryForm) {
    handleFormSubmit(modalEnquiryForm, 'Thank you! Your consultation request has been submitted successfully.');
  }

  const contactPageForm = document.getElementById('contactPageForm');
  if (contactPageForm) {
    handleFormSubmit(contactPageForm, 'Thank you for reaching out to BJ Visa Consultancy. Our Hyderabad team will contact you shortly.');
  }

  const b2bPartnerForm = document.getElementById('b2bPartnerForm');
  if (b2bPartnerForm) {
    handleFormSubmit(b2bPartnerForm, 'Thank you for your B2B Partner registration. Our partner management team will review your application and contact you within 24 hours.');
  }

  const careersForm = document.getElementById('careersForm');
  if (careersForm) {
    handleFormSubmit(careersForm, 'Thank you! Your application and resume have been submitted to our HR department.');
  }

  const subpageEnquiryForm = document.getElementById('subpageEnquiryForm');
  if (subpageEnquiryForm) {
    handleFormSubmit(subpageEnquiryForm, 'Your enquiry has been received. Our team will get in touch with you shortly.');
  }

  // 7. Toast Notification Helper
  function showToast(message) {
    let toastContainer = document.querySelector('.bj-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'bj-toast-container';
      document.body.appendChild(toastContainer);
    }

    const toastId = 'toast-' + Date.now();
    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center text-white bg-navy border-0 shadow-lg';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.id = toastId;

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi bi-check-circle-fill text-gold fs-5"></i>
          <span>${message}</span>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    toastContainer.appendChild(toastEl);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 6000 });
    bsToast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  }
});
