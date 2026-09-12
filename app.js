/**
 * J SALON UNISEX — ANANTAPUR
 * Client Engine & Appointment System (V2.0)
 */

(function () {
  'use strict';

  // --- Services Master Database ---
  const SERVICES_DATA = [
    { id: 'men_cut', name: "Men's Precision Haircut + Wash", category: 'haircut grooming', price: 350, duration: '35 mins' },
    { id: 'beard_sculpt', name: 'Razor Beard Sculpting', category: 'grooming', price: 250, duration: '25 mins' },
    { id: 'royal_combo', name: 'Royal Gentleman Combo (Cut+Beard+Massage)', category: 'grooming haircut', price: 699, duration: '55 mins' },
    { id: 'women_cut', name: "Women's Couture Cut & Blowout", category: 'haircut', price: 650, duration: '50 mins' },
    { id: 'keratin', name: 'Keratin Silk Infusion Treatment', category: 'color', price: 3999, duration: '150 mins' },
    { id: 'balayage', name: 'French Balayage & Gloss Highlights', category: 'color', price: 3800, duration: '180 mins' },
    { id: 'hair_spa', name: 'Kérastase Fusio-Dose Luxury Spa', category: 'spa', price: 1200, duration: '45 mins' },
    { id: 'hydrafacial', name: '7-Step Medical HydraFacial Glow', category: 'skin', price: 2999, duration: '60 mins' },
    { id: 'mani_pedi', name: 'Aromatherapy Mani & Pedi Deluxe', category: 'bridal skin', price: 1400, duration: '60 mins' },
    { id: 'bridal_makeover', name: 'HD Royal Bridal Makeover', category: 'bridal', price: 12000, duration: '240 mins' },
  ];

  const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM',
    '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
    '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'
  ];

  // --- Application State ---
  const bookingState = {
    step: 1,
    selectedService: SERVICES_DATA[0],
    selectedStylist: 'any',
    stylistLabel: 'Any Available Master Stylist',
    genderPref: 'unisex',
    selectedDate: '',
    selectedTime: '10:30 AM',
    clientName: '',
    clientPhone: '',
    clientNotes: '',
    bookingId: ''
  };

  // --- DOM Elements ---
  const mainHeader = document.getElementById('mainHeader');
  const serviceTabsNav = document.getElementById('serviceTabsNav');
  const servicesGrid = document.getElementById('servicesGrid');
  const bookingModalOverlay = document.getElementById('bookingModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const wizardBackBtn = document.getElementById('wizardBackBtn');
  const wizardNextBtn = document.getElementById('wizardNextBtn');
  const wizardSummaryText = document.getElementById('wizardSummaryText');
  const modalServicesList = document.getElementById('modalServicesList');
  const slotsChipsGrid = document.getElementById('slotsChipsGrid');
  const bookingDateInput = document.getElementById('bookingDateInput');
  const stylistSelect = document.getElementById('stylistSelect');
  const modalFinishBtn = document.getElementById('modalFinishBtn');

  // --- Initialize Application ---
  function init() {
    setupHeaderScroll();
    setupServiceFiltering();
    setupBeforeAfterSlider();
    setupBookingModal();
    setupPreselectedBookingTriggers();
    setDefaultBookingDate();
    populateModalServices();
    populateTimeSlots();
  }

  // 1. Header Scroll Blur & Elevation
  function setupHeaderScroll() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        mainHeader.classList.add('header-scrolled');
      } else {
        mainHeader.classList.remove('header-scrolled');
      }
    }, { passive: true });
  }

  // 2. Service Category Filter Tabs
  function setupServiceFiltering() {
    if (!serviceTabsNav) return;
    const tabBtns = serviceTabsNav.querySelectorAll('.service-tab-btn');
    const cards = servicesGrid ? servicesGrid.querySelectorAll('.service-luxury-card') : [];

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-category');
        cards.forEach(card => {
          const cardCats = card.getAttribute('data-category') || '';
          if (cat === 'all' || cardCats.includes(cat)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 3. Interactive Before/After Comparison Slider
  function setupBeforeAfterSlider() {
    const stage = document.getElementById('baSliderStage');
    const beforeLayer = document.getElementById('baBeforeLayer');
    const handleDivider = document.getElementById('baHandleDivider');
    if (!stage || !beforeLayer || !handleDivider) return;

    let isDragging = false;

    function updateSlider(clientX) {
      const rect = stage.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const pct = (offsetX / rect.width) * 100;
      beforeLayer.style.width = pct + '%';
      handleDivider.style.left = pct + '%';
    }

    stage.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    stage.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // 4. Booking Wizard Flow
  function setupBookingModal() {
    if (!bookingModalOverlay) return;

    // Open booking modal
    document.querySelectorAll('[data-action="open-booking"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    // Close modal
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalFinishBtn) {
      modalFinishBtn.addEventListener('click', closeModal);
    }

    bookingModalOverlay.addEventListener('click', (e) => {
      if (e.target === bookingModalOverlay) closeModal();
    });

    // Wizard Next Button
    if (wizardNextBtn) {
      wizardNextBtn.addEventListener('click', handleNextStep);
    }

    // Wizard Back Button
    if (wizardBackBtn) {
      wizardBackBtn.addEventListener('click', handlePrevStep);
    }
  }

  function openModal() {
    bookingModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setWizardStep(1);
  }

  function closeModal() {
    bookingModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function setWizardStep(stepNum) {
    bookingState.step = stepNum;

    // Toggle panes
    document.querySelectorAll('.booking-step-pane').forEach((pane, idx) => {
      if (idx + 1 === stepNum) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Update Progress Indicator
    document.querySelectorAll('.wizard-step-node').forEach((node, idx) => {
      const stepVal = idx + 1;
      node.classList.remove('active', 'completed');
      if (stepVal === stepNum) {
        node.classList.add('active');
      } else if (stepVal < stepNum) {
        node.classList.add('completed');
      }
    });

    // Update Footer buttons
    if (stepNum === 1) {
      wizardBackBtn.style.visibility = 'hidden';
      wizardNextBtn.style.display = 'inline-flex';
      wizardNextBtn.textContent = 'Next: Stylist ➔';
      wizardSummaryText.textContent = `Selected: ${bookingState.selectedService.name} (₹${bookingState.selectedService.price})`;
    } else if (stepNum === 2) {
      wizardBackBtn.style.visibility = 'visible';
      wizardNextBtn.style.display = 'inline-flex';
      wizardNextBtn.textContent = 'Next: Time Slot ➔';
      wizardSummaryText.textContent = `Step 2 of 4: Stylist`;
    } else if (stepNum === 3) {
      wizardBackBtn.style.visibility = 'visible';
      wizardNextBtn.style.display = 'inline-flex';
      wizardNextBtn.textContent = 'Next: Your Details ➔';
      wizardSummaryText.textContent = `Date: ${bookingState.selectedDate} @ ${bookingState.selectedTime}`;
    } else if (stepNum === 4) {
      wizardBackBtn.style.visibility = 'visible';
      wizardNextBtn.style.display = 'inline-flex';
      wizardNextBtn.textContent = 'Confirm Booking ✓';
      wizardSummaryText.textContent = `Total Payable: ₹${bookingState.selectedService.price}`;
    } else if (stepNum === 5) {
      // Completed Confirmation
      document.getElementById('wizardFooter').style.display = 'none';
    }
  }

  function handleNextStep() {
    if (bookingState.step === 1) {
      if (!bookingState.selectedService) {
        alert('Please choose a service to proceed.');
        return;
      }
      setWizardStep(2);
    } else if (bookingState.step === 2) {
      const stylistVal = stylistSelect ? stylistSelect.value : 'any';
      const stylistTxt = stylistSelect ? stylistSelect.options[stylistSelect.selectedIndex].text : 'Any Available Master Stylist';
      bookingState.selectedStylist = stylistVal;
      bookingState.stylistLabel = stylistTxt;
      setWizardStep(3);
    } else if (bookingState.step === 3) {
      const dateVal = bookingDateInput ? bookingDateInput.value : '';
      if (!dateVal) {
        alert('Please select an appointment date.');
        return;
      }
      bookingState.selectedDate = dateVal;
      setWizardStep(4);
    } else if (bookingState.step === 4) {
      const name = document.getElementById('clientNameInput').value.trim();
      const phone = document.getElementById('clientPhoneInput').value.trim();
      const notes = document.getElementById('clientNotesInput').value.trim();

      if (!name || name.length < 2) {
        alert('Please enter your full name.');
        document.getElementById('clientNameInput').focus();
        return;
      }
      if (!phone || phone.length < 10) {
        alert('Please enter a valid 10-digit mobile number.');
        document.getElementById('clientPhoneInput').focus();
        return;
      }

      bookingState.clientName = name;
      bookingState.clientPhone = phone;
      bookingState.clientNotes = notes;

      // Finalize and save booking
      saveAndConfirmBooking();
    }
  }

  function handlePrevStep() {
    if (bookingState.step > 1) {
      setWizardStep(bookingState.step - 1);
    }
  }

  function setDefaultBookingDate() {
    if (!bookingDateInput) return;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const defaultDate = `${yyyy}-${mm}-${dd}`;
    bookingDateInput.value = defaultDate;
    bookingDateInput.min = defaultDate;
    bookingState.selectedDate = defaultDate;
  }

  function populateModalServices() {
    if (!modalServicesList) return;
    modalServicesList.innerHTML = '';

    SERVICES_DATA.forEach((svc, index) => {
      const item = document.createElement('div');
      item.className = 'modal-service-option' + (index === 0 ? ' selected' : '');
      item.innerHTML = `
        <div>
          <div class="opt-title">${svc.name}</div>
          <div style="font-size: 0.76rem; color: var(--text-dim); margin-top: 2px;">⏱ ${svc.duration}</div>
        </div>
        <div class="opt-price">₹${svc.price}</div>
      `;

      item.addEventListener('click', () => {
        document.querySelectorAll('.modal-service-option').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        bookingState.selectedService = svc;
        if (wizardSummaryText) {
          wizardSummaryText.textContent = `Selected: ${svc.name} (₹${svc.price})`;
        }
      });

      modalServicesList.appendChild(item);
    });
  }

  function populateTimeSlots() {
    if (!slotsChipsGrid) return;
    slotsChipsGrid.innerHTML = '';

    TIME_SLOTS.forEach((slot, idx) => {
      const chip = document.createElement('div');
      chip.className = 'slot-chip' + (slot === bookingState.selectedTime ? ' selected' : '');
      chip.textContent = slot;

      chip.addEventListener('click', () => {
        document.querySelectorAll('.slot-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        bookingState.selectedTime = slot;
      });

      slotsChipsGrid.appendChild(chip);
    });
  }

  // 5. Preselected service booking from cards
  function setupPreselectedBookingTriggers() {
    document.querySelectorAll('[data-action="book-service"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-service-id');
        const match = SERVICES_DATA.find(s => s.id === id);
        if (match) {
          bookingState.selectedService = match;
          populateModalServices();
        }
        openModal();
      });
    });
  }

  // 6. Save Booking to Local Storage & Update Step 5
  function saveAndConfirmBooking() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const refId = `JS-ATP-${randomNum}`;
    bookingState.bookingId = refId;

    const newBooking = {
      id: refId,
      serviceName: bookingState.selectedService.name,
      price: bookingState.selectedService.price,
      stylist: bookingState.stylistLabel,
      date: bookingState.selectedDate,
      time: bookingState.selectedTime,
      clientName: bookingState.clientName,
      clientPhone: bookingState.clientPhone,
      notes: bookingState.clientNotes,
      status: 'Confirmed',
      timestamp: new Date().toISOString()
    };

    // Save into LocalStorage shared with Admin Portal
    try {
      const existing = JSON.parse(localStorage.getItem('JS_SALON_STORAGE_V2') || '[]');
      existing.unshift(newBooking);
      localStorage.setItem('JS_SALON_STORAGE_V2', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // Populate confirmation pane
    document.getElementById('confirmRefId').textContent = '#' + refId;
    document.getElementById('confirmServiceText').textContent = `${bookingState.selectedService.name} (₹${bookingState.selectedService.price})`;
    document.getElementById('confirmDateTimeText').textContent = `${bookingState.selectedDate} at ${bookingState.selectedTime}`;
    document.getElementById('confirmStylistText').textContent = bookingState.stylistLabel;

    // Generate WhatsApp reminder link
    const waText = encodeURIComponent(
      `Hello J Salon Anantapur! I have booked an appointment.\nRef ID: #${refId}\nClient: ${bookingState.clientName}\nService: ${bookingState.selectedService.name}\nDate: ${bookingState.selectedDate}\nTime: ${bookingState.selectedTime}\nLocation: Court Road, Beside Max Mall.`
    );
    const waLink = `https://wa.me/917901236700?text=${waText}`;
    const waAnchor = document.getElementById('confirmWaLink');
    if (waAnchor) {
      waAnchor.href = waLink;
    }

    setWizardStep(5);
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
