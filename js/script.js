/**
 * BJ VISA CONSULTANCY - MAIN JAVASCRIPT
 * Tagline: "Your Trusted Visa Partner"
 */

// ============================================================================
// 0. Session Navigation & Logo Preloader Controller
// ============================================================================
(function initNavigationAndPreloader() {
  const currentFileName = window.location.pathname.split('/').pop() || 'index.html';

  // Track internal link navigation across all pages
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href')) {
      const href = link.getAttribute('href').trim();
      // Internal navigation (not external, mailto, tel, or fragment anchor)
      if (
        !href.startsWith('http://') &&
        !href.startsWith('https://') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.startsWith('#') &&
        !href.startsWith('javascript:')
      ) {
        try {
          sessionStorage.setItem('bj_nav_source', 'internal');
          sessionStorage.setItem('bj_last_page', currentFileName);
        } catch (err) {}
      }
    }
  }, true);

  // Handle BFCache (back-forward cache) restoration
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      const preloader = document.getElementById('bj-preloader');
      if (preloader) {
        preloader.style.display = 'none';
        document.body.classList.remove('preloader-active');
      }
    }
  });

  // Home Page Preloader Logic
  const preloader = document.getElementById('bj-preloader');
  if (preloader) {
    if (document.documentElement.classList.contains('no-preloader')) {
      // Suppressed because of redirect/navigation from another page
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      } else {
        preloader.style.display = 'none';
      }
      try {
        sessionStorage.setItem('bj_site_opened', 'true');
        sessionStorage.setItem('bj_last_page', 'index.html');
        sessionStorage.removeItem('bj_nav_source');
      } catch (err) {}
      return;
    }

    // Active Preloader: Lock scroll and coordinate animation
    document.body.classList.add('preloader-active');

    const startTime = Date.now();
    const minDisplayTime = 1100; // minimum duration (ms) for luxury animation
    let dismissed = false;

    const dismissPreloader = () => {
      if (dismissed) return;
      dismissed = true;

      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.remove('preloader-active');

        try {
          sessionStorage.setItem('bj_site_opened', 'true');
          sessionStorage.setItem('bj_last_page', 'index.html');
          sessionStorage.removeItem('bj_nav_source');
        } catch (err) {}

        setTimeout(() => {
          if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          } else {
            preloader.style.display = 'none';
          }
        }, 700);
      }, delay);
    };

    if (document.readyState === 'complete') {
      dismissPreloader();
    } else {
      window.addEventListener('load', dismissPreloader);
      // Safety timeout in case heavy media takes too long
      setTimeout(dismissPreloader, 2400);
    }
  } else {
    // On subpages: record current page in sessionStorage
    try {
      sessionStorage.setItem('bj_last_page', currentFileName);
    } catch (err) {}
  }
})();

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
  const navLinks = document.querySelectorAll('.navbar-bj .nav-link, .navbar-bj .btn-nav-b2b');
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
    const mobileNavLinks = navbarCollapse.querySelectorAll('.nav-link, .btn-nav-enquire, .btn-nav-b2b');
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
    const activateFilter = (filterValue) => {
      filterBtns.forEach(b => {
        if (b.getAttribute('data-filter') === filterValue) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

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
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activateFilter(btn.getAttribute('data-filter'));
      });
    });

    // Check URL parameters or hash on page load
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter') || (window.location.hash ? window.location.hash.replace('#', '') : null);
    if (filterParam) {
      const matchBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === filterParam);
      if (matchBtn) {
        activateFilter(filterParam);
      }
    }

    // Smooth scroll to target card if hash is provided
    if (window.location.hash) {
      setTimeout(() => {
        const targetCard = document.querySelector(window.location.hash);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }

  // 5. Pre-fill Universal Enquiry Modal
  const enquiryModal = document.getElementById('enquiryModal');
  if (enquiryModal) {
    enquiryModal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      if (button) {
        const visaType = button.getAttribute('data-visa-type');
        const destination = button.getAttribute('data-destination');
        const customMessage = button.getAttribute('data-message');
        
        const visaSelect = enquiryModal.querySelector('#modalVisaType');
        const countryInput = enquiryModal.querySelector('#modalCountry');
        const messageTextarea = enquiryModal.querySelector('textarea');

        if (visaSelect && visaType) {
          visaSelect.value = visaType;
        }
        if (countryInput && destination) {
          countryInput.value = destination;
        }
        if (messageTextarea && customMessage) {
          messageTextarea.value = customMessage;
        } else if (messageTextarea && destination && (destination.includes('Jet') || destination.includes('Helicopter'))) {
          messageTextarea.value = `Enquiring about ${destination}. Please share private charter options tailored to my itinerary.`;
        }
      }
    });
  }

  // 5.5 Travel Date Range Picker Initialization (Flatpickr)
  const initTravelDateRangePickers = () => {
    const pickers = document.querySelectorAll('.travel-range-picker');
    if (!pickers.length) return;

    if (typeof flatpickr === 'undefined') {
      console.warn('Flatpickr library not loaded.');
      return;
    }

    const formatISO = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    pickers.forEach((pickerInput) => {
      const form = pickerInput.closest('form');
      const startInput = form ? form.querySelector('input[name="travelStartDate"]') : null;
      const endInput = form ? form.querySelector('input[name="travelEndDate"]') : null;
      const clearBtn = form ? form.querySelector('.date-range-clear-btn') : null;

      const updateStatusBar = (instance, count, f1, f2) => {
        const statusBar = instance.calendarContainer ? instance.calendarContainer.querySelector('.fp-range-status-bar') : null;
        if (!statusBar) return;
        if (count === 2) {
          statusBar.className = 'fp-range-status-bar completed';
          statusBar.innerHTML = '<span class="fp-badge"><i class="bi bi-check2"></i> Confirmed</span> ' + f1 + ' – ' + f2;
        } else if (count === 1) {
          statusBar.className = 'fp-range-status-bar waiting-end';
          statusBar.innerHTML = '<span class="fp-badge">Step 2</span> Departure: <strong>' + f1 + '</strong> ➔ <em>Select Return Date</em>';
        } else {
          statusBar.className = 'fp-range-status-bar';
          statusBar.innerHTML = '<span class="fp-badge">Step 1</span> Select Departure Date (From)';
        }
      };

      const fpInstance = flatpickr(pickerInput, {
        mode: 'range',
        minDate: 'today',
        dateFormat: 'd M Y',
        locale: {
          rangeSeparator: ' – '
        },
        disableMobile: true,
        showMonths: 1,
        prevArrow: '<i class="bi bi-chevron-left"></i>',
        nextArrow: '<i class="bi bi-chevron-right"></i>',
        onReady: function(selectedDates, dateStr, instance) {
          if (!instance.calendarContainer.querySelector('.fp-range-status-bar')) {
            const bar = document.createElement('div');
            bar.className = 'fp-range-status-bar';
            instance.calendarContainer.insertBefore(bar, instance.calendarContainer.firstChild);
          }
          // Support selecting same-day return trip by clicking the same date twice
          instance.calendarContainer.addEventListener('click', (e) => {
            const dayElem = e.target.closest('.flatpickr-day');
            if (!dayElem || dayElem.classList.contains('flatpickr-disabled')) return;
            if (instance.selectedDates.length === 1 && dayElem.dateObj) {
              const firstDate = instance.selectedDates[0];
              const clickedDate = dayElem.dateObj;
              if (firstDate.getFullYear() === clickedDate.getFullYear() &&
                  firstDate.getMonth() === clickedDate.getMonth() &&
                  firstDate.getDate() === clickedDate.getDate()) {
                e.stopPropagation();
                instance.setDate([firstDate, firstDate], true);
                setTimeout(() => instance.close(), 300);
              }
            }
          }, true);
        },
        onOpen: function(selectedDates, dateStr, instance) {
          pickerInput.classList.add('active');
          if (selectedDates.length === 2) {
            const f1 = instance.formatDate(selectedDates[0], 'd M Y');
            const f2 = instance.formatDate(selectedDates[1], 'd M Y');
            updateStatusBar(instance, 2, f1, f2);
          } else if (selectedDates.length === 1) {
            const f1 = instance.formatDate(selectedDates[0], 'd M Y');
            updateStatusBar(instance, 1, f1);
          } else {
            updateStatusBar(instance, 0);
          }
        },
        onClose: function(selectedDates, dateStr, instance) {
          pickerInput.classList.remove('active');
          if (selectedDates.length === 1) {
            const f1 = instance.formatDate(selectedDates[0], 'd M Y');
            pickerInput.value = `${f1} – Select return date`;
            pickerInput.classList.add('is-invalid');
          } else if (selectedDates.length === 2) {
            pickerInput.classList.remove('is-invalid');
          } else {
            pickerInput.classList.remove('is-invalid');
          }
        },
        onChange: function(selectedDates, dateStr, instance) {
          if (selectedDates.length === 2) {
            pickerInput.classList.remove('is-invalid');
            const f1 = instance.formatDate(selectedDates[0], 'd M Y');
            const f2 = instance.formatDate(selectedDates[1], 'd M Y');
            pickerInput.value = `${f1} – ${f2}`;
            if (startInput) startInput.value = formatISO(selectedDates[0]);
            if (endInput) endInput.value = formatISO(selectedDates[1]);
            if (clearBtn) clearBtn.classList.remove('d-none');
            updateStatusBar(instance, 2, f1, f2);
          } else if (selectedDates.length === 1) {
            const f1 = instance.formatDate(selectedDates[0], 'd M Y');
            pickerInput.value = `${f1} – Select return date`;
            if (startInput) startInput.value = formatISO(selectedDates[0]);
            if (endInput) endInput.value = '';
            if (clearBtn) clearBtn.classList.remove('d-none');
            updateStatusBar(instance, 1, f1);
          } else {
            pickerInput.value = '';
            if (startInput) startInput.value = '';
            if (endInput) endInput.value = '';
            if (clearBtn) clearBtn.classList.add('d-none');
            pickerInput.classList.remove('is-invalid');
            updateStatusBar(instance, 0);
          }
        }
      });

      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          fpInstance.clear();
          pickerInput.value = '';
          if (startInput) startInput.value = '';
          if (endInput) endInput.value = '';
          clearBtn.classList.add('d-none');
          pickerInput.classList.remove('is-invalid');
          if (fpInstance.isOpen) {
            updateStatusBar(fpInstance, 0);
          }
        });
      }
    });
  };

  initTravelDateRangePickers();

  // 6. Generic Form Submission & Validation Simulation
  const handleFormSubmit = (form, successMessage) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Travel date range validation (if field exists in form)
      const travelPicker = form.querySelector('.travel-range-picker');
      if (travelPicker) {
        const startVal = form.querySelector('input[name="travelStartDate"]')?.value;
        const endVal = form.querySelector('input[name="travelEndDate"]')?.value;
        const hasText = travelPicker.value.trim().length > 0;

        if (travelPicker.hasAttribute('required') && (!startVal || !endVal)) {
          e.stopPropagation();
          travelPicker.classList.add('is-invalid');
          showToast('Please select your departure and return travel dates.');
          return;
        }

        if (hasText && (!startVal || !endVal)) {
          e.stopPropagation();
          travelPicker.classList.add('is-invalid');
          showToast('Please select both departure and return dates for your travel.');
          return;
        }
      }

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

      // Collect form payload including travel dates
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      console.log('Form submission payload:', payload);

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

        // Reset flatpickr instance and clear button if inside this form
        form.querySelectorAll('.travel-range-picker').forEach(input => {
          if (input._flatpickr) {
            input._flatpickr.clear();
          }
          input.classList.remove('is-invalid');
        });
        const clearBtn = form.querySelector('.date-range-clear-btn');
        if (clearBtn) clearBtn.classList.add('d-none');
        const startHidden = form.querySelector('input[name="travelStartDate"]');
        if (startHidden) startHidden.value = '';
        const endHidden = form.querySelector('input[name="travelEndDate"]');
        if (endHidden) endHidden.value = '';

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

  const b2bPartnerForm = document.getElementById('b2bPartnerRegistrationForm') || document.getElementById('b2bPartnerForm');
  if (b2bPartnerForm) {
    handleFormSubmit(b2bPartnerForm, 'Thank you for your B2B Partner enquiry. Our team will review your enquiry and contact you regarding the available services and partnership process.');
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

  // 8. Hero Background Video Autoplay Assurance
  const heroVideo = document.querySelector('.hero-bg-video');
  if (heroVideo) {
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback (e.g. low-power mode); fallback poster stays visible
      });
    }
  }

  // 9. Scroll Reveal Animation for Interactive Showcase & Premium Elements
  const revealElements = document.querySelectorAll('.aviation-reveal, .reveal-on-scroll');
  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible', 'is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('is-visible', 'is-revealed'));
    }
  }

  // 11. B2B Read More / Read Less Independent Toggle Handler
  const b2bToggleButtons = document.querySelectorAll('.btn-b2b-toggle');
  b2bToggleButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('aria-controls');
      const targetContent = document.getElementById(targetId);
      if (!targetContent) return;

      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const textSpan = this.querySelector('.toggle-text');

      if (isExpanded) {
        // Collapse
        targetContent.classList.remove('is-expanded');
        this.setAttribute('aria-expanded', 'false');
        if (textSpan) textSpan.textContent = 'Read More';
      } else {
        // Expand
        targetContent.classList.add('is-expanded');
        this.setAttribute('aria-expanded', 'true');
        if (textSpan) textSpan.textContent = 'Read Less';
      }
    });
  });


  // 10. Careers Job Apply Button Smooth Scroll & Position Selection
  const jobApplyButtons = document.querySelectorAll('.btn-job-apply');
  jobApplyButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const position = this.getAttribute('data-position');
      const select = document.getElementById('positionSelect') || document.querySelector('#careersForm select');
      if (select && position) {
        select.value = position;
      }
      const applySection = document.getElementById('applySection');
      if (applySection) {
        e.preventDefault();
        applySection.scrollIntoView({ behavior: 'smooth' });
        const nameInput = document.querySelector('#careersForm input[type="text"]');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 500);
        }
      }
    });
  });
});

