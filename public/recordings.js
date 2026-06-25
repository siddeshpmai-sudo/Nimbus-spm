/* ============================================================
   NimbusWiz Tech — Recordings Portal Client Script
   ============================================================ */

(function () {
  'use strict';

  // ── State ───────────────────────────────────────
  let allRecordings = [];
  let activeFilter  = 'all';
  let searchQuery   = '';

  // ── DOM refs ────────────────────────────────────
  const loadingState   = document.getElementById('loading-state');
  const videoGrid      = document.getElementById('video-grid');
  const gridInner      = document.getElementById('video-grid-inner');
  const gridHeading    = document.getElementById('grid-heading');
  const emptyState     = document.getElementById('empty-state');
  const topbarCount    = document.getElementById('topbar-count');
  const filterList     = document.getElementById('filter-list');
  const countAll       = document.getElementById('count-all');
  const searchInput    = document.getElementById('search-input');
  const modalOverlay   = document.getElementById('modal-overlay');
  const modalClose     = document.getElementById('modal-close');
  const modalPlayer    = document.getElementById('modal-player');
  const modalTitle     = document.getElementById('modal-title');
  const modalCourse    = document.getElementById('modal-course');
  const modalMeta      = document.getElementById('modal-meta');
  const modalDesc      = document.getElementById('modal-desc');
  const userAvatar     = document.getElementById('user-avatar');
  const userInitials   = document.getElementById('user-initials');
  const userNameEl     = document.getElementById('user-name');
  const userEmailEl    = document.getElementById('user-email');
  const mobileMenuBtn  = document.getElementById('mobile-menu-btn');
  const sidebarEl      = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  // ── Fetch current user ──────────────────────────
  async function loadUser() {
    try {
      const res  = await fetch('/api/me');
      if (!res.ok) { window.location.href = '/login'; return; }
      const user = await res.json();

      userNameEl.textContent  = user.name  || 'Student';
      userEmailEl.textContent = user.email || '';

      const initials = (user.name || 'S')
        .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

      if (user.avatar) {
        userAvatar.innerHTML = `<img src="${user.avatar}" alt="${escAttr(user.name)}" referrerpolicy="no-referrer">`;
      } else {
        userInitials.textContent = initials;
      }
    } catch {
      window.location.href = '/login';
    }
  }

  // ── Fetch recordings ────────────────────────────
  async function loadRecordings() {
    try {
      const res  = await fetch('/api/recordings');
      if (!res.ok) throw new Error('Failed to load');
      allRecordings = await res.json();
      buildFilters();
      render();
    } catch (err) {
      loadingState.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#6b7280;">
          <p style="font-size:14px;">⚠️ Could not load recordings. Please refresh.</p>
          <button onclick="location.reload()" style="margin-top:12px;padding:8px 16px;background:#4F63FF;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:13px;">Refresh</button>
        </div>`;
    } finally {
      loadingState.style.display = 'none';
      videoGrid.style.display    = 'block';
    }
  }

  // ── Build sidebar filters ────────────────────────
  function buildFilters() {
    const courses = {};
    allRecordings.forEach(r => {
      const c = r.course || 'Uncategorised';
      courses[c] = (courses[c] || 0) + 1;
    });

    countAll.textContent = allRecordings.length;

    // Remove old dynamic filters
    filterList.querySelectorAll('[data-course]:not([data-course="all"])').forEach(el => el.remove());

    Object.entries(courses).forEach(([course, count]) => {
      const btn = document.createElement('button');
      btn.className   = 'filter-btn';
      btn.dataset.course = course;
      btn.innerHTML   = `<span class="dot"></span>${escHtml(course)}<span class="filter-count">${count}</span>`;
      btn.addEventListener('click', () => setFilter(course));
      filterList.appendChild(btn);
    });
  }

  // ── Filter + search ─────────────────────────────
  function getFiltered() {
    return allRecordings.filter(r => {
      const matchesCourse = activeFilter === 'all' || r.course === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        (r.title       || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        (r.course      || '').toLowerCase().includes(q);
      return matchesCourse && matchesSearch;
    });
  }

  // ── Render grid ─────────────────────────────────
  function render() {
    const filtered = getFiltered();
    gridInner.innerHTML = '';

    topbarCount.textContent = `— ${filtered.length} video${filtered.length !== 1 ? 's' : ''}`;
    gridHeading.textContent = activeFilter === 'all' ? 'All Recordings' : activeFilter;

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    filtered.forEach((rec, idx) => {
      const card = document.createElement('div');
      card.className = 'video-card';
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Play: ${rec.title}`);
      card.style.animationDelay = `${idx * 40}ms`;

      card.innerHTML = `
        <div class="video-thumb">
          <div class="thumb-icon">
            <div class="play-btn-thumb" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
          </div>
          <span class="video-index">#${String(idx + 1).padStart(2, '0')}</span>
          ${rec.duration ? `<span class="video-duration">${escHtml(rec.duration)}</span>` : ''}
        </div>
        <div class="video-body">
          <span class="video-course-tag">${escHtml(rec.course || 'General')}</span>
          <h3 class="video-title">${escHtml(rec.title)}</h3>
          <p class="video-desc">${escHtml(rec.description || '')}</p>
          <div class="video-meta">
            <span>📅 ${formatDate(rec.date)}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openModal(rec));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(rec); });
      gridInner.appendChild(card);
    });
  }

  // ── Set active filter ───────────────────────────
  function setFilter(course) {
    activeFilter = course;
    filterList.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.course === course);
    });
    render();
    closeSidebar();
  }

  // ── Open video modal ─────────────────────────────
  function openModal(rec) {
    if (!rec.driveFileId || rec.driveFileId === 'REPLACE_WITH_YOUR_DRIVE_FILE_ID') {
      alert('⚠️ This video has no Drive file ID configured yet.\n\nAdd the file ID to recordings.json to enable playback.');
      return;
    }

    modalCourse.textContent = rec.course || 'General';
    modalTitle.textContent  = rec.title  || 'Untitled';
    modalMeta.textContent   = [formatDate(rec.date), rec.duration].filter(Boolean).join('  ·  ');
    modalDesc.textContent   = rec.description || '';

    // Embed using Google Drive preview URL
    modalPlayer.innerHTML = `
      <iframe
        src="https://drive.google.com/file/d/${encodeURIComponent(rec.driveFileId)}/preview"
        allow="autoplay; fullscreen"
        allowfullscreen
        loading="lazy"
        title="${escAttr(rec.title)}"
      ></iframe>`;

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  // ── Close video modal ────────────────────────────
  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    modalPlayer.innerHTML = ''; // stop video playback
    document.body.style.overflow = '';
  }

  // ── Mobile sidebar ───────────────────────────────
  function openSidebar() {
    sidebarEl.classList.add('open');
    sidebarOverlay.classList.add('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebarEl.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  // ── Helpers ─────────────────────────────────────
  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escAttr(str) {
    return String(str || '').replace(/"/g, '&quot;');
  }
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  }

  // ── Event listeners ──────────────────────────────
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  mobileMenuBtn.addEventListener('click', () => {
    sidebarEl.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  sidebarOverlay.addEventListener('click', closeSidebar);

  document.getElementById('filter-all').addEventListener('click', () => setFilter('all'));

  let searchTimer;
  searchInput.addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = e.target.value.trim();
      render();
    }, 200);
  });

  // ── Init ─────────────────────────────────────────
  loadUser();
  loadRecordings();

})();
