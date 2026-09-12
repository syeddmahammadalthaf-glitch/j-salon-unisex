/**
 * J SALON UNISEX — ANANTAPUR
 * Admin & Staff Operations Engine (V2.0)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'JS_SALON_STORAGE_V2';
  const PASSCODE = 'admin123';

  // Seed default bookings if empty so the dashboard has rich data
  const DEFAULT_SEED_DATA = [
    {
      id: 'JS-ATP-9102',
      clientName: 'Sravani Chowdary',
      clientPhone: '9490123456',
      serviceName: 'French Balayage & Gloss',
      price: 3800,
      stylist: 'Vikram Sharma',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
      status: 'Confirmed',
      notes: 'Caramel tones preferred'
    },
    {
      id: 'JS-ATP-8834',
      clientName: 'Harish Reddy',
      clientPhone: '9848123987',
      serviceName: 'Royal Gentleman Combo',
      price: 699,
      stylist: 'Karthik Varma',
      date: new Date().toISOString().split('T')[0],
      time: '01:30 PM',
      status: 'In-Service',
      notes: 'Hot towel beard sculpt'
    },
    {
      id: 'JS-ATP-7721',
      clientName: 'Dr. Divya Teja',
      clientPhone: '9908123456',
      serviceName: '7-Step Medical HydraFacial',
      price: 2999,
      stylist: 'Pooja Mehta',
      date: new Date().toISOString().split('T')[0],
      time: '03:30 PM',
      status: 'Confirmed',
      notes: 'Sensitive skin serum'
    },
    {
      id: 'JS-ATP-6510',
      clientName: 'Priya Nandini',
      clientPhone: '9701122334',
      serviceName: 'Keratin Silk Infusion',
      price: 3999,
      stylist: 'Ananya Reddy',
      date: new Date().toISOString().split('T')[0],
      time: '05:00 PM',
      status: 'Confirmed',
      notes: 'Shoulder length hair'
    }
  ];

  let currentBookings = [];
  let currentFilter = 'all';
  let searchQuery = '';

  // DOM Elements
  const lockscreen = document.getElementById('lockscreen');
  const passcodeForm = document.getElementById('passcodeForm');
  const passcodeInput = document.getElementById('passcodeInput');
  const loginError = document.getElementById('loginError');
  const adminMainWrapper = document.getElementById('adminMainWrapper');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const appointmentsTableBody = document.getElementById('appointmentsTableBody');
  const kpiBookingsCount = document.getElementById('kpiBookingsCount');
  const kpiRevenueSum = document.getElementById('kpiRevenueSum');
  const searchClientInput = document.getElementById('searchClientInput');
  const filterPills = document.getElementById('filterPills');
  const btnManualWalkIn = document.getElementById('btnManualWalkIn');
  const manualBookingModal = document.getElementById('manualBookingModal');
  const closeManualModal = document.getElementById('closeManualModal');
  const manualBookingForm = document.getElementById('manualBookingForm');

  function init() {
    checkAuth();
    loadBookings();
    setupEventListeners();
  }

  // --- Authentication ---
  function checkAuth() {
    if (sessionStorage.getItem('JS_ADMIN_LOGGED_IN') === 'true') {
      unlockDashboard();
    }
  }

  function unlockDashboard() {
    if (lockscreen) lockscreen.style.display = 'none';
    if (adminMainWrapper) adminMainWrapper.style.display = 'block';
    renderDashboard();
  }

  function lockDashboard() {
    sessionStorage.removeItem('JS_ADMIN_LOGGED_IN');
    if (lockscreen) lockscreen.style.display = 'flex';
    if (adminMainWrapper) adminMainWrapper.style.display = 'none';
  }

  // --- Data Management ---
  function loadBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
        currentBookings = DEFAULT_SEED_DATA;
      } else {
        currentBookings = JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading storage:', e);
      currentBookings = DEFAULT_SEED_DATA;
    }
  }

  function saveBookings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentBookings));
    } catch (e) {
      console.warn('Error saving storage:', e);
    }
    renderDashboard();
  }

  // --- Render Functions ---
  function renderDashboard() {
    updateKPIs();
    renderTable();
  }

  function updateKPIs() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayList = currentBookings.filter(b => b.date === todayStr);

    if (kpiBookingsCount) {
      kpiBookingsCount.textContent = todayList.length || currentBookings.length;
    }

    if (kpiRevenueSum) {
      const totalRev = currentBookings
        .filter(b => b.status !== 'Cancelled')
        .reduce((sum, item) => sum + (Number(item.price) || 0), 0);
      kpiRevenueSum.textContent = '₹' + totalRev.toLocaleString('en-IN');
    }
  }

  function renderTable() {
    if (!appointmentsTableBody) return;
    appointmentsTableBody.innerHTML = '';

    let list = currentBookings;

    // Apply Filter Pill
    if (currentFilter !== 'all') {
      list = list.filter(item => item.status.toLowerCase() === currentFilter.toLowerCase());
    }

    // Apply Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        (item.clientName && item.clientName.toLowerCase().includes(q)) ||
        (item.clientPhone && item.clientPhone.includes(q)) ||
        (item.id && item.id.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      appointmentsTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 32px; color: var(--text-dim);">
            No appointments found matching this criteria.
          </td>
        </tr>
      `;
      return;
    }

    list.forEach(item => {
      const tr = document.createElement('tr');

      // WhatsApp link
      const waMsg = encodeURIComponent(
        `Hello ${item.clientName}! Greetings from J Salon Unisex, Court Road Anantapur.\nYour appointment #${item.id} for ${item.serviceName} is scheduled for ${item.date} at ${item.time}.\nLocation: Beside Max Mall, Court Road. Need any assistance? Call 079012 36700.`
      );
      const waHref = `https://wa.me/91${item.clientPhone.replace(/\D/g, '')}?text=${waMsg}`;

      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--js-gold);">${item.id}</td>
        <td style="font-weight: 600; color: #fff;">${item.clientName}</td>
        <td><a href="tel:${item.clientPhone}" style="color: var(--text-muted);">${item.clientPhone}</a></td>
        <td>
          <div style="font-weight: 600;">${item.serviceName}</div>
          <div style="font-size: 0.78rem; color: var(--js-gold-light);">₹${item.price}</div>
        </td>
        <td style="color: var(--text-muted);">${item.stylist || 'Any Stylist'}</td>
        <td>
          <div>${item.date}</div>
          <div style="font-size: 0.78rem; color: var(--text-dim);">${item.time}</div>
        </td>
        <td>
          <span class="status-badge status-${item.status.replace(/\s+/g, '-')}">${item.status}</span>
        </td>
        <td>
          <div class="action-btn-group">
            <a href="${waHref}" target="_blank" rel="noopener" class="btn-wa-ping" title="Send WhatsApp Confirmation">
              <span>WA Alert</span>
            </a>
            <select class="btn-status-toggle" data-id="${item.id}">
              <option value="Confirmed" ${item.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="In-Service" ${item.status === 'In-Service' ? 'selected' : ''}>In-Service</option>
              <option value="Completed" ${item.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Cancelled" ${item.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>
        </td>
      `;

      // Status Change Listener
      const select = tr.querySelector('.btn-status-toggle');
      select.addEventListener('change', (e) => {
        const newStatus = e.target.value;
        const targetId = select.getAttribute('data-id');
        const match = currentBookings.find(b => b.id === targetId);
        if (match) {
          match.status = newStatus;
          saveBookings();
        }
      });

      appointmentsTableBody.appendChild(tr);
    });
  }

  // --- Event Listeners ---
  function setupEventListeners() {
    // Passcode Login
    if (passcodeForm) {
      passcodeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pin = passcodeInput.value.trim();
        if (pin === PASSCODE) {
          sessionStorage.setItem('JS_ADMIN_LOGGED_IN', 'true');
          loginError.style.display = 'none';
          unlockDashboard();
        } else {
          loginError.style.display = 'block';
          passcodeInput.value = '';
          passcodeInput.focus();
        }
      });
    }

    // Logout
    if (adminLogoutBtn) {
      adminLogoutBtn.addEventListener('click', lockDashboard);
    }

    // Filter pills
    if (filterPills) {
      filterPills.querySelectorAll('.filter-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterPills.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentFilter = btn.getAttribute('data-filter');
          renderTable();
        });
      });
    }

    // Search Input
    if (searchClientInput) {
      searchClientInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderTable();
      });
    }

    // Walk-In Modal
    if (btnManualWalkIn) {
      btnManualWalkIn.addEventListener('click', () => {
        manualBookingModal.classList.add('active');
      });
    }

    if (closeManualModal) {
      closeManualModal.addEventListener('click', () => {
        manualBookingModal.classList.remove('active');
      });
    }

    if (manualBookingModal) {
      manualBookingModal.addEventListener('click', (e) => {
        if (e.target === manualBookingModal) {
          manualBookingModal.classList.remove('active');
        }
      });
    }

    // Manual Booking Form Submit
    if (manualBookingForm) {
      manualBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('manualClientName').value.trim();
        const phone = document.getElementById('manualClientPhone').value.trim();
        const svcData = document.getElementById('manualServiceSelect').value.split('|');
        const stylist = document.getElementById('manualStylistSelect').value;
        const time = document.getElementById('manualTimeSelect').value;

        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const refId = `JS-ATP-${randomNum}`;

        const newEntry = {
          id: refId,
          clientName: name,
          clientPhone: phone,
          serviceName: svcData[0],
          price: Number(svcData[1]),
          stylist: stylist,
          date: new Date().toISOString().split('T')[0],
          time: time,
          status: 'Confirmed',
          notes: 'Walk-in desk entry'
        };

        currentBookings.unshift(newEntry);
        saveBookings();

        manualBookingForm.reset();
        manualBookingModal.classList.remove('active');
        alert(`Walk-In Appointment #${refId} created successfully!`);
      });
    }
  }

  // Run on ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
