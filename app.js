const app = document.querySelector('#app');
const whatsapp = 'https://chat.whatsapp.com/EVtYg8KRLjS5V27GxKLABU?s=sw&p=a&mlu=4';
const instagram = 'https://www.instagram.com/microsoftlearnstudentcommunity/';
let registration = null;

const landing = () => `
  <div class="page">
    <header class="topbar">
      <a class="brand-block" href="#" data-action="home">
        <span class="brand-mark">FF</span>
        <span class="brand-text">Fresher's Fiesta <em>/ MTC</em></span>
      </a>
      <nav class="topnav" aria-label="Primary navigation">
        <a href="#" data-action="home">Overview</a>
        <a href="#" data-action="register">Register</a>
        <a href="#" data-action="community">Community</a>
      </nav>
      <button class="button compact" type="button" data-action="register">Get your pass</button>
    </header>

    <section class="hero reveal">
      <div class="hero-copy">
        <div class="hero-badges">
          <span>[ FIRST YEARS ONLY ]</span>
          <span>[ ENTRY FREE ]</span>
          <span>[ FF2.0 / 2026 ]</span>
        </div>
        <p class="hero-kicker">• NEW BEGINNINGS •</p>
        <h1>FRESHER'S <span>FIESTA</span> <em>2.0</em></h1>
        <p class="intro">Your first campus memory arrives as a high-energy festival afternoon built for bold new faces, live music, instant friendships and unforgettable stories.</p>
        <div class="cta-group">
          <button class="button" type="button" data-action="register">Register now</button>
          <button class="button secondary" type="button" data-action="explore">Explore</button>
        </div>
        <div class="hero-meta">
          <span>01 / NEW BEGINNINGS</span>
          <span>02 / SOUND & LIGHT</span>
          <span>03 / CAMPUS ENERGY</span>
        </div>
      </div>

      <div class="hero-panel reveal">
        <div class="panel-label">LIVE SIGNAL</div>
        <div class="panel-number">02</div>
        <div class="panel-copy">
          <p>The first chapter is loading.</p>
          <p>Expect the kind of event that turns strangers into your closest people.</p>
        </div>
        <div class="panel-grid">
          <div><strong>13.08.26</strong><span>Date</span></div>
          <div><strong>2:30 PM</strong><span>Time</span></div>
          <div><strong>To be Announced Soon</strong><span>Venue</span></div>
        </div>
      </div>
    </section>

    <section class="event-strip reveal" aria-label="Event details">
      <div class="event-item"><span class="meta-label">Date</span><strong>13.08.26</strong></div>
      <div class="event-item"><span class="meta-label">Time</span><strong>2:30 PM</strong></div>
      <div class="event-item"><span class="meta-label">Venue</span><strong>To Be Announced Soon</strong></div>
    </section>

    <section class="experience-section reveal" aria-label="Experience highlights">
      <div class="section-heading">
        <div class="eyebrow">[ YOUR FIRST CHAPTER ]</div>
        <h2>Your first college memory starts here.</h2>
      </div>
      <div class="experience-grid">
        <article class="experience-card accent-cyan">
          <span class="experience-number">01</span>
          <h3>Music &amp; entertainment</h3>
          <p>Curated energy, live sound and a campus afternoon that feels cinematic from the first beat.</p>
        </article>
        <article class="experience-card accent-pink">
          <span class="experience-number">02</span>
          <h3>Games &amp; activities</h3>
          <p>Interactive moments, playful chaos and the kind of fun that keeps the whole crowd moving.</p>
        </article>
        <article class="experience-card accent-lime">
          <span class="experience-number">03</span>
          <h3>New friends</h3>
          <p>Meet the people who will become your campus circle before the semester even really begins.</p>
        </article>
        <article class="experience-card accent-cyan-alt">
          <span class="experience-number">04</span>
          <h3>Unforgettable memories</h3>
          <p>One afternoon. A hundred stories. The kind of memory that stays with you long after the lights go down.</p>
        </article>
      </div>
    </section>

    <section class="feature-section reveal">
      <div class="feature-copy">
        <div class="eyebrow">[ FESTIVAL MODE ]</div>
        <h2>Built for the energy of a first-year arrival.</h2>
        <p>At the center of the afternoon sits the same campus energy you have been waiting for — bright, fast, social and unmistakably alive.</p>
      </div>
      <div class="fiesta-stage">
        <div class="stage-pill s1">MAIN CHARACTER ENERGY</div>
        <div class="stage-pill s2">LIVE SOUND</div>
        <div class="stage-pill s3">NEW BEGINNINGS</div>
        <div class="stage-pill s4">FIESTA MODE</div>
        <div class="core-ring">
          <div class="core-inner">
            <span>FIESTA</span>
            <strong>MODE</strong>
            <b>ON</b>
          </div>
        </div>
        <div class="hud-card">
          <b>FIESTA SYSTEM</b>
          <span>● ONLINE</span>
          <label>ENERGY 100%</label>
          <label>VIBES 98%</label>
          <label>SYNC 99%</label>
        </div>
      </div>
    </section>

    <section class="transition-section reveal">
      <div class="eyebrow">[ REGISTRATION GATE ]</div>
      <h2>Your first college memory starts here.</h2>
      <p>Secure your spot before the first wave of the event begins.</p>
      <button class="button" type="button" data-action="register">Register for fiesta</button>
    </section>
  </div>
`;

const form = () => `
  <div class="page">
    <header class="topbar">
      <a class="brand-block" href="#" data-action="home">
        <span class="brand-mark">FF</span>
        <span class="brand-text">Fresher's Fiesta <em>/ REGISTER</em></span>
      </a>
      <div class="topbar-meta">STEP 01 <span>/</span> 01</div>
    </header>

    <section class="form-shell reveal">
      <div class="form-intro">
        <div class="eyebrow">[ SECURE YOUR SPOT ]</div>
        <h1>JOIN THE FIESTA</h1>
        <p>Enter your details to reserve your place at Fresher's Fiesta 2.0 and receive your digital confirmation.</p>
        <div class="form-progress">
          <span class="active">01 DETAILS</span>
          <span>02 CONFIRM</span>
          <span>03 YOU'RE IN</span>
        </div>
      </div>

      <form class="form-card" id="registration-form" novalidate>
        <div class="form-grid">
          ${field('name','Full name','Enter your full name','text')}
          ${field('email','Email address','Enter your email address','email')}
          ${field('phone','Contact number / WhatsApp','Enter your WhatsApp number','tel')}
          ${field('course','Course','Enter your course','text')}
          ${field('enrollment','Enrollment number','Enter your enrollment number','text')}
          ${selectField('year','Batch / Year of study',['Select your batch','1st Year','2nd Year','3rd Year','4th Year'])}
          ${field('specialization','Specialization','Enter your specialization','text')}
        </div>

        <label class="check-row">
          <input type="checkbox" id="confirm" />
          <span>I confirm that the information provided is correct.</span>
        </label>

        <div class="form-foot">
          <button class="button" type="submit">Register for fiesta</button>
          <div class="fineprint">Your information will only be used for event registration and communication.</div>
        </div>
      </form>
    </section>
  </div>
`;

const field = (id, label, placeholder, type) => `
  <div class="field">
    <label for="${id}">${label} <span class="required">*</span></label>
    <input id="${id}" name="${id}" type="${type}" placeholder="${placeholder}" />
    <div class="error" data-error="${id}"></div>
  </div>
`;

const selectField = (id, label, options) => `
  <div class="field${id === 'year' ? ' year-field' : ''}">
    <label for="${id}">${label} <span class="required">*</span></label>
    <div class="custom-select${id === 'year' ? ' year-select' : ''}" data-custom-select="${id}">
      <button class="custom-select-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
        <span class="custom-select-text">${options[0]}</span>
        <span class="custom-select-arrow"></span>
      </button>
      <div class="custom-select-menu" role="listbox">
        ${options.map((option, index) => `<button class="custom-select-option${index === 0 ? ' is-placeholder' : ''}" type="button" role="option" data-value="${index ? option : ''}" data-label="${option}">${option}</button>`).join('')}
      </div>
      <select id="${id}" name="${id}" class="year-native-select" tabindex="-1">${options.map((x, i) => `<option value="${i ? x : ''}">${x}</option>`).join('')}</select>
    </div>
    <div class="error" data-error="${id}"></div>
  </div>
`;

const success = data => `
  <div class="page">
    <header class="topbar">
      <a class="brand-block" href="#" data-action="home">
        <span class="brand-mark">FF</span>
        <span class="brand-text">Fresher's Fiesta <em>/ CONFIRMED</em></span>
      </a>
      <div class="topbar-meta">ACCESS GRANTED <span>/</span> VIP</div>
    </header>

    <section class="success-shell reveal">
      <div class="ticket-card">
        <div class="ticket-head">
          <div>
            <div class="eyebrow">[ REGISTRATION COMPLETE ]</div>
            <h1>YOU'RE <span>IN!</span></h1>
          </div>
          <div class="status-pill">CONFIRMED</div>
        </div>

        <div class="ticket-body">
          <div class="ticket-details">
            ${[['Name', data.name], ['Course', data.course], ['Enrollment number', data.enrollment]].map(([k, v]) => `<div class="detail-row"><span>${k}</span><strong>${v}</strong></div>`).join('')}
          </div>

          <div class="ticket-side">
            <div class="registration-id">
              <span class="meta-label">Registration ID</span>
              <strong>${data.id}</strong>
            </div>
          </div>
        </div>

        <div class="ticket-divider"></div>

        <div class="community-grid">
          <article class="community-card">
            <h3>Join the WhatsApp group</h3>
            <p>Get event reminders, updates and the inside track for the event.</p>
            <a class="button secondary" href="${whatsapp}" target="_blank" rel="noreferrer">Join WhatsApp</a>
          </article>
          <article class="community-card">
            <h3>Follow on Instagram</h3>
            <p>Stay tuned for reels, announcements and festival moments before the event.</p>
            <a class="button secondary" href="${instagram}" target="_blank" rel="noreferrer">Follow Instagram</a>
          </article>
        </div>
      </div>

      <div class="closing-block reveal">
        <div class="eyebrow">[ SEE YOU THERE ]</div>
        <h2>SEE YOU AT FRESHER'S FIESTA 2.0!</h2>
      </div>
    </section>
  </div>
`;

function render(view = 'home') {
  app.innerHTML = view === 'home' ? landing() : view === 'form' ? form() : success(registration);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => enhanceView(), 0);
}

function closeCustomYearDropdowns() {
  document.querySelectorAll('.custom-select.is-open').forEach(dropdown => dropdown.classList.remove('is-open'));
}

function syncYearDropdownUI() {
  const native = document.getElementById('year');
  const wrapper = native?.closest('.custom-select');
  if (!native || !wrapper) return;
  const triggerText = wrapper.querySelector('.custom-select-text');
  const selected = Array.from(native.options).find(option => option.value === native.value) || native.options[0];
  if (triggerText) triggerText.textContent = selected?.textContent || 'Select your batch';
  wrapper.querySelectorAll('.custom-select-option').forEach(option => {
    option.classList.toggle('is-selected', option.dataset.value === native.value);
  });
}

function initializeYearDropdown() {
  const native = document.getElementById('year');
  const wrapper = native?.closest('.custom-select');
  if (!native || !wrapper || wrapper.dataset.initialized === 'true') return;
  wrapper.dataset.initialized = 'true';
  const trigger = wrapper.querySelector('.custom-select-trigger');
  const menu = wrapper.querySelector('.custom-select-menu');

  if (trigger && menu) {
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('is-open');
      closeCustomYearDropdowns();
      if (!isOpen) wrapper.classList.add('is-open');
    });

    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
      if (e.key === 'Escape') {
        wrapper.classList.remove('is-open');
      }
    });
  }

  wrapper.querySelectorAll('.custom-select-option').forEach(option => {
    option.addEventListener('click', () => {
      native.value = option.dataset.value;
      native.dispatchEvent(new Event('change', { bubbles: true }));
      syncYearDropdownUI();
      wrapper.classList.remove('is-open');
    });
  });

  native.addEventListener('change', syncYearDropdownUI);
  syncYearDropdownUI();
}

function showError(id, msg) {
  const input = document.getElementById(id);
  const field = input?.closest('.field');
  const error = document.querySelector(`[data-error="${id}"]`);
  if (field) field.classList.toggle('has-error', Boolean(msg));
  if (error) error.textContent = msg;
  if (id === 'confirm') {
    const row = document.querySelector('.check-row');
    if (row) row.classList.toggle('has-error', Boolean(msg));
  }
}

document.addEventListener('click', e => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action === 'register') render('form');
  if (action === 'home') render('home');
  if (action === 'community') document.querySelector('.community-grid')?.scrollIntoView({ behavior: 'smooth' });
  if (action === 'explore') document.querySelector('.experience-section')?.scrollIntoView({ behavior: 'smooth' });
});

document.addEventListener('click', e => {
  if (!e.target.closest('.custom-select')) closeCustomYearDropdowns();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCustomYearDropdowns();
});

document.addEventListener('submit', async e => {
  if (!e.target.matches('#registration-form')) return;
  e.stopImmediatePropagation();
  e.preventDefault();

  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  let valid = true;

  const required = ['name', 'email', 'phone', 'enrollment', 'year', 'course', 'specialization'];
  required.forEach(id => {
    if (!data[id]) {
      showError(id, 'This field is required');
      valid = false;
    } else {
      showError(id, '');
    }
  });

  if (data.name && data.name.trim().length < 2) {
    showError('name', 'Please enter at least 2 characters');
    valid = false;
  }
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
    showError('email', 'Please enter a valid email address');
    valid = false;
  }

  const digits = (data.phone || '').replace(/\D/g, '');
  if (digits && !/^(?:91)?[6-9]\d{9}$/.test(digits)) {
    showError('phone', 'Enter a valid Indian WhatsApp number');
    valid = false;
  }
  if (digits) data.phone = `+91 ${digits.slice(-10)}`;

  if (!document.querySelector('#confirm').checked) {
    showError('confirm', 'Please confirm your information');
    valid = false;
  } else {
    showError('confirm', '');
  }

  if (!valid) return;

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.classList.add('is-loading');
  button.innerHTML = 'Registering <span class="spinner"></span>';

  try {
    const response = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, confirmed: true })
    });
    const result = await response.json();

    if (!response.ok) {
      showError('enrollment', result.error || 'Unable to save registration');
      button.disabled = false;
      button.classList.remove('is-loading');
      button.innerHTML = 'Register for fiesta';
      return;
    }

    registration = { ...result.registration, id: result.registration.registrationId };
    render('success');
  } catch (error) {
    showError('enrollment', 'Server unavailable. Please try again.');
    button.disabled = false;
    button.classList.remove('is-loading');
    button.innerHTML = 'Register for fiesta';
  }
}, true);

function enhanceView() {
  document.querySelectorAll('.topbar').forEach(bar => {
    if (bar.querySelector('.site-logo')) return;
    const logo = document.createElement('img');
    logo.className = 'site-logo';
    logo.src = 'assets/image%20(1).png';
    logo.alt = "Fresher's Fiesta logo";
    logo.onerror = () => {
      const fallback = document.createElement('span');
      fallback.className = 'logo-fallback';
      fallback.textContent = 'FF';
      logo.replaceWith(fallback);
    };
    bar.prepend(logo);
  });

  initializeYearDropdown();

  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('is-visible')) revealObserver.observe(el);
  });
}

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: .12 })
  : { observe: el => el.classList.add('is-visible'), unobserve: () => {} };

render();
