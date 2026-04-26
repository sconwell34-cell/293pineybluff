/* =============================================================================
   293 PINEY BLUFF — APP LOGIC
   Reads content.yaml, populates the systems grid and the map pins.
   ========================================================================== */

// Inline SVG icons used by the systems grid
const ICONS = {
  bolt: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
  sun: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>',
  thermometer: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4 4 0 1 0 5 0z"/></svg>',
  drop: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.3 0z"/></svg>',
  sprinkler: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14v7M5 21h14M8 14L4 9M16 14l4-5M12 14V8M9 8h6M9 8a3 3 0 1 1 6 0"/></svg>',
  wifi: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14 0M8.5 16.43a6 6 0 0 1 7 0M2 8.82a15 15 0 0 1 20 0"/><circle cx="12" cy="20" r="0.6" fill="currentColor"/></svg>',
  cow: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10 Q5 6 12 6 Q19 6 19 10 L19 14 Q19 19 12 19 Q5 19 5 14 Z"/><path d="M5 9 Q3 5 5 5 Q5 7 5 9"/><path d="M19 9 Q21 5 19 5 Q19 7 19 9"/><circle cx="9" cy="11" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="11" r="0.9" fill="currentColor" stroke="none"/><ellipse cx="12" cy="15" rx="3.5" ry="2.5"/></svg>',
  tractor: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 14 L2 11 L8 11 L9 8 L14 8 L14 14"/><path d="M14 14 L21 14 L21 11 L18 11"/><line x1="11" y1="8" x2="11" y2="5"/><circle cx="6" cy="16.5" r="2"/><circle cx="17" cy="16" r="2.8"/></svg>',
  house: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12L12 3l9 9M5 10v10h14V10"/></svg>'
};

// First letter for pin badges, falls back to building/well/infra
function pinBadge(loc) {
  if (loc.type === 'well') return 'W';
  if (loc.type === 'infrastructure') {
    if (loc.id.startsWith('elec')) return '⚡';
    if (loc.id === 'propane') return 'P';
    if (loc.id === 'septic') return 'S';
    if (loc.id === 'brush-hay') return 'H';
    return '·';
  }
  return loc.name.charAt(0);
}

// Count walkthroughs per system across all locations
function countWalkthroughsBySystem(locations) {
  const counts = {};
  locations.forEach(loc => {
    (loc.walkthroughs || []).forEach(wt => {
      counts[wt.system] = (counts[wt.system] || 0) + 1;
    });
  });
  return counts;
}

// Render the systems grid
function renderSystems(systems, locations) {
  const grid = document.getElementById('systems-grid');
  const counts = countWalkthroughsBySystem(locations);
  grid.innerHTML = systems.map(sys => {
    const icon = ICONS[sys.icon] || ICONS.house;
    const count = counts[sys.id] || 0;
    return `
      <div class="system-card" data-sys="${sys.id}">
        ${icon}
        <span class="name">${sys.name}</span>
        <span class="count">${count} walkthrough${count !== 1 ? 's' : ''}</span>
      </div>`;
  }).join('');

  grid.querySelectorAll('.system-card').forEach(card => {
    card.addEventListener('click', () => openSystemModal(card.dataset.sys, systems, locations));
  });
}

// Render the map pins
function renderPins(locations) {
  const wrap = document.getElementById('map-pins');
  wrap.innerHTML = locations.map(loc => {
    const x = loc.coordinates.x;
    const y = loc.coordinates.y;
    return `
      <div class="pin ${loc.type}" data-loc="${loc.id}"
           style="left: ${x}%; top: ${y}%;"
           title="${loc.name}">
        ${pinBadge(loc)}
      </div>`;
  }).join('');

  wrap.querySelectorAll('.pin').forEach(pin => {
    pin.addEventListener('click', () => showLocation(pin.dataset.loc, locations));
  });
}

// Show a location's walkthroughs in the info panel
function showLocation(locId, locations) {
  const loc = locations.find(l => l.id === locId);
  if (!loc) return;

  document.querySelectorAll('.pin').forEach(p => p.classList.remove('active'));
  document.querySelector(`.pin[data-loc="${locId}"]`).classList.add('active');

  const typeLabel = { building: 'Building', well: 'Well', infrastructure: 'Outdoor infrastructure' }[loc.type] || loc.type;
  const wts = loc.walkthroughs || [];

  const list = wts.map(wt => `
    <li>
      <div class="wt-title">${wt.title}<span class="wt-system">${wt.system}</span></div>
      <div class="wt-loc">${wt.location}</div>
      ${wt.description ? `<div class="wt-desc">${wt.description}</div>` : ''}
      ${!wt.video ? '<div class="wt-pending">video coming soon</div>' : ''}
    </li>`).join('');

  document.getElementById('location-info').innerHTML = `
    <h3>${loc.name}</h3>
    <span class="info-tag">${typeLabel}</span>
    <p class="info-desc">${loc.description || ''}</p>
    <p class="info-count">${wts.length} walkthrough${wts.length !== 1 ? 's' : ''}</p>
    <ul class="walkthroughs">${list}</ul>`;
}

// Open the modal showing all walkthroughs in a given system
function openSystemModal(sysId, systems, locations) {
  const sys = systems.find(s => s.id === sysId);
  if (!sys) return;

  // Collect all walkthroughs in this system, with their location names
  const items = [];
  locations.forEach(loc => {
    (loc.walkthroughs || []).forEach(wt => {
      if (wt.system === sysId) {
        items.push({ ...wt, locationName: loc.name });
      }
    });
  });

  const list = items.map(wt => `
    <li>
      <div class="wt-title">${wt.title} <span class="wt-system">${wt.locationName}</span></div>
      <div class="wt-loc">${wt.location}</div>
      ${wt.description ? `<div class="wt-desc">${wt.description}</div>` : ''}
      ${!wt.video ? '<div class="wt-pending">video coming soon</div>' : ''}
    </li>`).join('');

  document.getElementById('modal-body').innerHTML = `
    <h3>${sys.name}</h3>
    <p class="modal-desc">${sys.description || ''}</p>
    <ul class="walkthroughs">${list || '<li class="info-empty">No walkthroughs yet.</li>'}</ul>`;

  const modal = document.getElementById('system-modal');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  document.getElementById('system-modal').setAttribute('aria-hidden', 'true');
}

document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Load and parse content.yaml
async function init() {
  try {
    const res = await fetch('content.yaml');
    if (!res.ok) throw new Error('Could not load content.yaml');
    const text = await res.text();
    const data = jsyaml.load(text);

    if (data.site) {
      if (data.site.title) document.getElementById('site-title').textContent = data.site.title;
      if (data.site.tagline) document.getElementById('site-tagline').textContent = data.site.tagline;
    }

    renderSystems(data.systems || [], data.locations || []);
    renderPins(data.locations || []);
  } catch (err) {
    console.error('Failed to initialize site:', err);
    document.getElementById('systems-grid').innerHTML =
      '<p style="color:var(--color-fire);grid-column:1/-1;">Could not load content.yaml. Check the file format.</p>';
  }
}

init();
