/**
 * scripts.js
 * ─────────────────────────────────────────────────────────
 * Main application logic:
 *   - Portfolio data (projects, skills, courses, certs)
 *   - Dynamic section renderers
 *   - Modal open / close
 *   - Scroll animations (IntersectionObserver)
 *   - Navbar scroll behaviour
 *   - Mobile menu toggle
 *   - Project filter buttons
 *   - Skill bar animations
 *   - Language circle animations
 *   - Contact form submit feedback
 *
 * Dependencies: lang.js (LangManager), theme.js (ThemeManager)
 * Exposes:      window.renderAll() — called by lang.js on lang change
 * ─────────────────────────────────────────────────────────
 */


/* ══════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════ */

/**
 * Portfolio projects.
 * cat   — filter key (mobile | uiux | data | web)
 * icon  — emoji displayed in thumbnail
 * th    — CSS class for thumbnail gradient colour
 */
const PROJECTS = [
  {
    id: 1,
    cat: 'mobile',
    icon: '🛵',
    thumbClass: 'project-card__thumbnail--1',
    ar: {
      title: 'تطبيق فزعه',
      desc: 'تطبيق جوال يربط المستخدمين بمزودي الخدمات القريبين لتأجير المنتجات وطلب الخدمات الفورية. صمّمت النماذج الأولية في Figma وطوّرت مكونات Flutter الأساسية.',
      tags: ['Flutter', 'Dart', 'Firebase', 'Figma'],
    },
    en: {
      title: 'FAZAA Application',
      desc: 'Mobile app connecting users with nearby service providers to rent products or request on-demand services. Designed Figma prototypes and developed core Flutter components.',
      tags: ['Flutter', 'Dart', 'Firebase', 'Figma'],
    },
  },
  {
    id: 2,
    cat: 'uiux',
    icon: '🎨',
    thumbClass: 'project-card__thumbnail--2',
    ar: {
      title: 'تصميم UI/UX – فزعه',
      desc: 'نماذج أولية تفاعلية احترافية لتطبيق فزعه مع تدفقات المستخدم الكاملة وتطبيق مبادئ تجربة المستخدم وDesign System متكامل.',
      tags: ['Figma', 'Prototyping', 'User Flows', 'Design System'],
    },
    en: {
      title: 'FAZAA UI/UX Design',
      desc: 'Professional interactive prototypes for FAZAA app with complete user flows, UX principles, and integrated design system.',
      tags: ['Figma', 'Prototyping', 'User Flows', 'Design System'],
    },
  },
  {
    id: 3,
    cat: 'data',
    icon: '📊',
    thumbClass: 'project-card__thumbnail--3',
    ar: {
      title: 'لوحة تحليل البيانات',
      desc: 'تحليل وتمثيل بيانات تنظيمية باستخدام Power BI وExcel مع تقارير تفاعلية ورؤى قابلة للتنفيذ.',
      tags: ['Power BI', 'Excel', 'SQL', 'Data Analysis'],
    },
    en: {
      title: 'Data Analytics Dashboard',
      desc: 'Analyzing and visualizing organizational data using Power BI and Excel with interactive reports and actionable insights.',
      tags: ['Power BI', 'Excel', 'SQL', 'Data Analysis'],
    },
  },
  //
  {
    id: 4,
    cat: 'data',
    icon: '🔄',
    thumbClass: 'project-card__thumbnail--4',
    ar: {
      title: 'نمذجة عمليات BPMN',
      desc: 'توثيق وتحليل عمليات تقنية المعلومات المؤسسية باستخدام Visual Paradigm ومنهجية BPMN في إطار التحول الرقمي.',
      tags: ['BPMN', 'Visual Paradigm', 'TOGAF', 'Documentation'],
    },
    en: {
      title: 'BPMN Process Modeling',
      desc: 'Documenting and analyzing institutional IT processes using Visual Paradigm and BPMN methodology for digital transformation.',
      tags: ['BPMN', 'Visual Paradigm', 'TOGAF', 'Documentation'],
    },
  },
 //5
  {
    id: 5,
    cat: 'web',
    icon: '🌐',
    thumbClass: 'project-card__thumbnail--5',
    ar: {
      title: 'تحسين موقع راتل',
      desc: 'تحسين استجابة الموقع على الجوال والتابلت وتطبيق تحسينات UI/UX لتعزيز تجربة المستخدم وأهداف المنصة الرقمية.',
      tags: ['HTML', 'CSS', 'Responsive', 'UI/UX'],
    },
    en: {
      title: 'Ratel Website Enhancement',
      desc: 'Improved website responsiveness on mobile and tablet and applied UI/UX improvements to enhance UX and platform goals.',
      tags: ['HTML', 'CSS', 'Responsive', 'UI/UX'],
    },
  },
];

/** Technical skill bars */
const TECH_SKILLS = [
  { icon: '📗', ar: 'Excel & Power BI',                en: 'Excel & Power BI',            pct: 90 },
  { icon: '📊', ar: 'تحليل البيانات والتمثيل البياني', en: 'Data Analysis & Visualization', pct: 88 },
  { icon: '🐍', ar: 'Python & SQL',                    en: 'Python & SQL',                 pct: 80 },
  { icon: '🔄', ar: 'نمذجة BPMN',                     en: 'BPMN Modeling',                pct: 83 },
  { icon: '🎨', ar: 'UI/UX & Figma',                   en: 'UI/UX Design & Figma',         pct: 79 },
  { icon: '📱', ar: 'Flutter & Dart',                   en: 'Flutter & Dart',               pct: 70 },
  { icon: '🌐', ar: 'HTML & CSS',                       en: 'HTML & CSS',                   pct: 74 },
  { icon: '💻', ar: 'مفاهيم التحول الرقمي',             en: 'Digital Transformation',       pct: 85 },
];

/** Soft skills cards */
const SOFT_SKILLS = [
  { icon: '🗣️', ar: 'التواصل الفعّال',   en: 'Communication' },
  { icon: '⏱️', ar: 'إدارة الوقت',        en: 'Time Management' },
  { icon: '🧩', ar: 'التفكير التحليلي',    en: 'Analytical Thinking' },
  { icon: '💡', ar: 'حل المشكلات',        en: 'Problem Solving' },
  { icon: '🤝', ar: 'العمل الجماعي',       en: 'Teamwork' },
  { icon: '📋', ar: 'التوثيق والتنظيم',    en: 'Documentation' },
];

/** Training courses */
const COURSES = [
  { icon: '🐍', ar: { title: 'Python وHTML وCSS وJavaScript',             provider: 'منصة سطر',                       date: '2022' }, en: { title: 'Python, HTML, CSS & JavaScript',               provider: 'Satr Platform',                  date: '2022' } },
  { icon: '🎨', ar: { title: 'تصميم واجهات وتجارب المستخدم (UI/UX)',      provider: 'Coursera',                       date: '2022' }, en: { title: 'Designing User Interfaces & Experiences',      provider: 'Coursera',                       date: '2022' } },
  { icon: '📗', ar: { title: 'تحليل البيانات وتمثيلها بـ Excel',           provider: 'أكاديمية تواق',                  date: '2023' }, en: { title: 'Data Analysis & Representation using Excel',   provider: 'Tuwaiq Academy',                 date: '2023' } },
  { icon: '📊', ar: { title: 'تحليل البيانات وتمثيلها بـ Power BI',        provider: 'وزارة الاتصالات وتقنية المعلومات', date: '2023' }, en: { title: 'Power BI Data Analysis & Visualization',       provider: 'Ministry of Communications & IT',date: '2023' } },
  { icon: '📈', ar: { title: 'تحليل البيانات – المستوى الأول والثاني',     provider: 'الأكاديمية السعودية الرقمية',    date: '2024' }, en: { title: 'Data Analytics (Level 1 & 2)',                  provider: 'Saudi Digital Academy / Coursera',date: '2024' } },
  { icon: '🔄', ar: { title: 'التحول الرقمي',                              provider: 'درب',                            date: '2023' }, en: { title: 'Digital Transformation',                       provider: 'Droob',                          date: '2023' } },
  { icon: '🏛️', ar: { title: 'الهيكل المؤسسي الوطني والأثر الرقمي',      provider: 'درب',                            date: '2023' }, en: { title: 'National Institutional Structure & Digital Impact', provider: 'Droob',                       date: '2023' } },
  { icon: '🤖', ar: { title: 'أساسيات الذكاء الاصطناعي',                  provider: 'SDAIA',                          date: '2023' }, en: { title: 'Fundamentals of Artificial Intelligence',      provider: 'SDAIA',                          date: '2023' } },
  { icon: '🌐', ar: { title: 'التحول الرقمي والهوية الرقمية',              provider: 'منصة سطر',                       date: '2023' }, en: { title: 'Digital Transformation & Digital Identity',    provider: 'Satr Platform',                  date: '2023' } },
];

/** Professional certificates */
const CERTIFICATES = [
  { icon: '🏆', ar: { name: 'Google Data Analytics',                    issuer: 'Google / Coursera',            year: 'فبراير 2024' }, en: { name: 'Google Data Analytics',                    issuer: 'Google / Coursera',            year: 'Feb 2024' } },
  { icon: '🎨', ar: { name: 'تصميم واجهات وتجارب المستخدم',             issuer: 'Coursera',                     year: '2022'        }, en: { name: 'Designing User Interfaces & Experiences', issuer: 'Coursera',                     year: '2022'     } },
  { icon: '📈', ar: { name: 'تحليل البيانات – المستوى الأول والثاني',   issuer: 'الأكاديمية السعودية الرقمية',  year: '2024'        }, en: { name: 'Data Analytics Level 1 & 2',              issuer: 'Saudi Digital Academy',         year: '2024'     } },
  { icon: '🤖', ar: { name: 'أساسيات الذكاء الاصطناعي',                 issuer: 'SDAIA',                        year: '2023'        }, en: { name: 'Fundamentals of AI',                      issuer: 'SDAIA',                         year: '2023'     } },
];


/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

/** Get current language from LangManager */
const getLang = () => LangManager.current;

/**
 * Build a comma-separated list of tag <span> elements.
 * @param {string[]} tags
 * @param {string}   tagClass - CSS class for each tag
 * @returns {string} HTML string
 */
function buildTagsHTML(tags, tagClass) {
  return tags.map((t) => `<span class="${tagClass}">${t}</span>`).join('');
}

/**
 * Open the shared modal with given title, subtitle, and body HTML.
 * @param {string} title
 * @param {string} subtitle
 * @param {string} bodyHTML
 */
function openModal(title, subtitle, bodyHTML) {
  document.getElementById('modal-title').textContent    = title;
  document.getElementById('modal-subtitle').textContent = subtitle;
  document.getElementById('modal-body').innerHTML       = bodyHTML;
  document.getElementById('modal-overlay').classList.add('is-open');
}

/** Close the shared modal */
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('is-open');
}

/**
 * Re-run IntersectionObserver on all .reveal elements that haven't
 * animated yet. Called after each dynamic render so new cards animate in.
 */
function observeRevealElements() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
    observer.observe(el);
  });
}


/* ══════════════════════════════════════════════════════════
   RENDERERS
   ══════════════════════════════════════════════════════════ */

/**
 * Render the projects grid.
 * @param {string} filter - category key or 'all'
 
function renderProjects(filter = 'all') {
  const lang   = getLang();
  const list   = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);
  const grid   = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = list.map((project) => `
    <article class="project-card reveal" data-project-id="${project.id}">
      <div class="project-card__thumbnail ${project.thumbClass}" aria-hidden="true">
        ${project.icon}
      </div>
      <div class="project-card__body">
        <div class="project-card__tags">
          ${buildTagsHTML(project[lang].tags, 'project-card__tag')}
        </div>
        <h3 class="project-card__title">${project[lang].title}</h3>
        <p class="project-card__description">${project[lang].desc}</p>
        <div class="project-card__links">
          <a class="project-card__link project-card__link--primary" href="#">Demo</a>
          <a class="project-card__link" href="#">GitHub</a>
        </div>
      </div>
    </article>
  `).join('');

  // Re-attach click handlers for project modals
  grid.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => {
      const projectId = parseInt(card.dataset.projectId, 10);
      handleOpenProjectModal(projectId);
    });
  });

  observeRevealElements();
}
*/
/**
 * renderProjects()
 * ─────────────────────────────────────────────
 * Renders the projects grid in section #projects.
 *
 * Logic:
 *  - Filters PROJECTS array by category key or shows all.
 *  - Data/dashboard projects get a special card variant
 *    (.project-card--data) with a "View Dashboard" button.
 *  - Click on card body → opens modal.
 *  - Click on action buttons (Demo / GitHub / Dashboard) →
 *    handled separately, does NOT bubble to card modal.
 * ─────────────────────────────────────────────
 * @param {string} filter — 'all' | 'mobile' | 'uiux' | 'data' | 'web'
 */
function renderProjects(filter = 'all') {
  const lang = getLang();
  const list = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.cat === filter);

  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const isAr = lang === 'ar';

  grid.innerHTML = list.map((project) => {

    /* ── Decide card variant ─────────────────── */
    const isDataDashboard = project.isHrDashboard === true;
    const cardClass       = isDataDashboard ? 'project-card project-card--data reveal' : 'project-card reveal';

    /* ── Build tags HTML ─────────────────────── */
    const tagsHTML = buildTagsHTML(project[lang].tags, 'project-card__tag');

    /* ── Build thumbnail ─────────────────────── */
    const thumbnailHTML = isDataDashboard
      ? `<div class="project-card__thumbnail ${project.thumbClass}" aria-hidden="true">
           <span class="project-card__thumb-icon--pulse">${project.icon}</span>
           <span class="project-card__dashboard-badge">📊 Power BI</span>
         </div>`
      : `<div class="project-card__thumbnail ${project.thumbClass}" aria-hidden="true">
           ${project.icon}
         </div>`;

    /* ── Build action buttons ────────────────── */
    const linksHTML = isDataDashboard
      ? `<div class="project-card__links">
           <button class="project-card__link project-card__link--dashboard js-open-dashboard"
                   data-project-id="${project.id}"
                   aria-label="${isAr ? 'عرض لوحة التحليل' : 'View Dashboard'}">
             📊 ${isAr ? 'عرض اللوحة' : 'View Dashboard'}
           </button>
         </div>`
      : `<div class="project-card__links">
           <a class="project-card__link project-card__link--primary"
              href="#"
              onclick="return false;"
              aria-label="Demo">🚀 Demo</a>
           <a class="project-card__link"
              href="#"
              onclick="return false;"
              aria-label="GitHub">🐙 GitHub</a>
         </div>`;

    return `
      <article class="${cardClass}" data-project-id="${project.id}">
        ${thumbnailHTML}
        <div class="project-card__body">
          <div class="project-card__tags">${tagsHTML}</div>
          <h3 class="project-card__title">${project[lang].title}</h3>
          <p class="project-card__description">${project[lang].desc}</p>
          ${linksHTML}
        </div>
      </article>`;

  }).join('');

  /* ── Event delegation ────────────────────────
     One listener on the grid handles all clicks.
     Buttons with .js-open-dashboard open the rich modal.
     Clicks on the card body (not buttons) open generic modal. */
  grid.addEventListener('click', (event) => {

    /* "View Dashboard" button */
    const dashBtn = event.target.closest('.js-open-dashboard');
    if (dashBtn) {
      event.stopPropagation();
      const projectId = parseInt(dashBtn.dataset.projectId, 10);
      handleOpenProjectModal(projectId);
      return;
    }

    /* Regular link buttons — do nothing (href="#") */
    if (event.target.closest('.project-card__link')) return;

    /* Card body click → generic modal */
    const card = event.target.closest('.project-card');
    if (card) {
      const projectId = parseInt(card.dataset.projectId, 10);
      handleOpenProjectModal(projectId);
    }
  }, { once: false });  // keep listener alive for re-renders

  observeRevealElements();
}
/**
 * Render technical skill bars and soft skill cards.
 */
/**
 * renderSkills()
 * ─────────────────────────────────────────────
 * تُنشئ قسم المهارات في صفحة #skills
 *
 * التغيير: المهارات التقنية الآن تُعرض كـ cards
 * مثل المهارات الناعمة تماماً — بدون bar أو نسبة
 * ─────────────────────────────────────────────
 */
function renderSkills() {
  const lang     = getLang();
  const techList = document.getElementById('tech-skills-list');
  const softGrid = document.getElementById('soft-skills-grid');

  if (!techList || !softGrid) return;

  // ── المهارات التقنية → cards مثل المهارات الناعمة ──
  techList.innerHTML = TECH_SKILLS.map((skill) => `
    <div class="soft-skill-card">
      <span class="soft-skill-card__icon" aria-hidden="true">${skill.icon}</span>
      <span class="soft-skill-card__name">${skill[lang]}</span>
    </div>
  `).join('');

  // ── المهارات الناعمة → بدون تغيير ──
  softGrid.innerHTML = SOFT_SKILLS.map((skill) => `
    <div class="soft-skill-card">
      <span class="soft-skill-card__icon" aria-hidden="true">${skill.icon}</span>
      <span class="soft-skill-card__name">${skill[lang]}</span>
    </div>
  `).join('');
}

/**
 * Render courses grid.
 */
function renderCourses() {
  const lang = getLang();
  const grid = document.getElementById('courses-grid');
  if (!grid) return;

  grid.innerHTML = COURSES.map((course) => `
    <article class="course-card reveal">
      <div class="course-card__icon" aria-hidden="true">${course.icon}</div>
      <div class="course-card__info">
        <h3 class="course-card__title">${course[lang].title}</h3>
        <p class="course-card__provider">${course[lang].provider}</p>
        <p class="course-card__date">📅 ${course[lang].date}</p>
      </div>
    </article>
  `).join('');

  observeRevealElements();
}

/**
 * Render certificates grid.
 */
function renderCertificates() {
  const lang  = getLang();
  const grid  = document.getElementById('certificates-grid');
  if (!grid) return;

  const verifiedLabel = lang === 'ar' ? 'معتمد' : 'Verified';

  grid.innerHTML = CERTIFICATES.map((cert, index) => `
    <article class="cert-card reveal reveal--delay-${(index % 4) + 1}" data-cert-index="${index}">
      <div class="cert-card__glow" aria-hidden="true"></div>
      <span class="cert-card__ribbon">✓ ${verifiedLabel}</span>
      <div class="cert-card__icon" aria-hidden="true">${cert.icon}</div>
      <h3 class="cert-card__name">${cert[lang].name}</h3>
      <p class="cert-card__issuer">${cert[lang].issuer}</p>
      <p class="cert-card__year">${cert[lang].year}</p>
    </article>
  `).join('');

  // Re-attach click handlers for cert modals
  grid.querySelectorAll('.cert-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.certIndex, 10);
      handleOpenCertModal(idx);
    });
  });

  observeRevealElements();
}

/**
 * Convenience: re-render all dynamic sections.
 * Called by lang.js on every language change.
 */
function renderAll() {
  const activeFilter = document.querySelector('.btn--filter.is-active');
  renderProjects(activeFilter ? activeFilter.dataset.filter : 'all');
  renderSkills();
  renderCourses();
  renderCertificates();
  animateSkillBars();
  animateLanguageCircles();
}

// Expose to lang.js
window.renderAll = renderAll;


/* ══════════════════════════════════════════════════════════
   MODAL HANDLERS
   ══════════════════════════════════════════════════════════ */

/**
 * Open the project modal for a given project id.
 * @param {number} projectId
 *//* ── Image viewer (tabs) ─────────────────────
       Allows switching between 3 dashboard pages.
       Images live in assets/images/dashboard/.
       If images are missing, a placeholder is shown. ── */
    const dashboardViewerHTML = `
      <div class="dashboard-image-viewer">

        <!-- Tab bar: one tab per dashboard page -->
        <div class="dashboard-image-viewer__tabs" role="tablist">
          <button class="dashboard-image-viewer__tab is-active"
                  role="tab"
                  data-tab="0"
                  aria-selected="true">
            📋 ${isAr ? 'نظرة عامة' : 'Overview'}
          </button>
          <button class="dashboard-image-viewer__tab"
                  role="tab"
                  data-tab="1"
                  aria-selected="false">
            💰 ${isAr ? 'الرواتب' : 'Finance'}
          </button>
          <button class="dashboard-image-viewer__tab"
                  role="tab"
                  data-tab="2"
                  aria-selected="false">
            📅 ${isAr ? 'الحضور' : 'Attendance'}
          </button>
        </div>

        <!-- Image frame: shows active tab's screenshot -->
        <div class="dashboard-image-viewer__frame" id="dashboard-frame">
          <div class="dashboard-image-viewer__placeholder">
            <div class="dashboard-image-viewer__placeholder-icon">📊</div>
            <p class="dashboard-image-viewer__placeholder-text">
              ${isAr
                ? 'ضع صور لقطات الشاشة في:<br><code>assets/images/dashboard/page-1.png</code>'
                : 'Place screenshot images at:<br><code>assets/images/dashboard/page-1.png</code>'}
            </p>
          </div>
        </div>

      </div>
    `;

    /* Prepend the image viewer to the body HTML */
    const bodyHTMLWithViewer = dashboardViewerHTML + bodyHTML;
function handleOpenProjectModal(projectId) {
  const lang    = getLang();
  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) return;

  const bodyHTML = `
    <div class="modal__thumbnail" aria-hidden="true">${project.icon}</div>
    <p class="modal__description">${project[lang].desc}</p>
    <div class="modal__tags">
      ${buildTagsHTML(project[lang].tags, 'tag')}
    </div>
    <div class="modal__actions">
      <a href="#" class="btn--primary" style="font-size:.82rem;padding:10px 20px;">🚀 Demo</a>
      <a href="#" class="btn--outline" style="font-size:.82rem;padding:10px 20px;">🐙 GitHub</a>
    </div>
  `;

openModal(
      project[lang].title,
      isAr ? 'تحليل الموارد البشرية · 3 صفحات تفاعلية' : 'HR Analytics · 3 Interactive Pages',
      bodyHTMLWithViewer
    );

    /* ── Wire tab buttons after modal renders ──
       Small delay ensures modal DOM is inserted before we query it. */
    setTimeout(() => initDashboardTabs(isAr), 60);
    return;}

/**
 * Open the certificate modal for a given certificate index.
 * @param {number} index
 */

function handleOpenCertModal(index) {
  const lang = getLang();
  const cert = CERTIFICATES[index];
  if (!cert) return;

  const verifiedLabel = lang === 'ar' ? 'شهادة معتمدة' : 'Verified Certificate';

  const bodyHTML = `
    <div class="cert-modal-card">
      <div class="cert-modal-card__icon">${cert.icon}</div>
      <h3 class="cert-modal-card__name">${cert[lang].name}</h3>
      <p class="cert-modal-card__org">${cert[lang].issuer}</p>
      <p class="cert-modal-card__year">${cert[lang].year}</p>
      <span class="badge--honor">✓ ${verifiedLabel}</span>
    </div>
  `;

  openModal(cert[lang].name, `${cert[lang].issuer} · ${cert[lang].year}`, bodyHTML);
}
/**
 * initDashboardTabs()
 * ─────────────────────────────────────────────
 * Wires the three tab buttons inside the HR Dashboard modal.
 * Each tab corresponds to one Power BI page and shows its screenshot.
 *
 * Image path convention:
 *   assets/images/dashboard/page-1.png  ← Overview
 *   assets/images/dashboard/page-2.png  ← Finance
 *   assets/images/dashboard/page-3.png  ← Attendance
 *
 * If an image fails to load, a styled placeholder is shown instead.
 *
 * @param {boolean} isAr — true when current language is Arabic
 */
function initDashboardTabs(isAr) {

  const tabButtons = document.querySelectorAll('.dashboard-image-viewer__tab');
  const frame      = document.getElementById('dashboard-frame');
  if (!tabButtons.length || !frame) return;

  /* Image paths indexed by tab number (0, 1, 2) */
  const pageImages = [
    'assets/images/dashboard/page-1.png',
    'assets/images/dashboard/page-2.png',
    'assets/images/dashboard/page-3.png',
  ];

  /* Page titles for alt text */
  const pageTitles = isAr
    ? ['نظرة عامة', 'الرواتب والمدفوعات', 'الحضور والأداء']
    : ['Overview', 'Finance & Payments', 'Attendance & Performance'];

  /**
   * showPage()
   * Renders the image for a given tab index inside #dashboard-frame.
   * Falls back to a placeholder div if the image path is unavailable.
   * @param {number} index
   */
  function showPage(index) {
    const src   = pageImages[index];
    const title = pageTitles[index];

    /* Build an <img> and handle load errors gracefully */
    const img = new Image();
    img.src   = src;
    img.alt   = title;
    img.className = 'dashboard-image-viewer__img';
    img.loading   = 'lazy';

    img.onload = () => {
      /* Image loaded — inject it */
      frame.innerHTML = '';
      frame.appendChild(img);
    };

    img.onerror = () => {
      /* Image missing — show placeholder with instructions */
      frame.innerHTML = `
        <div class="dashboard-image-viewer__placeholder">
          <div class="dashboard-image-viewer__placeholder-icon">🖼️</div>
          <p class="dashboard-image-viewer__placeholder-text">
            ${isAr
              ? `ضع لقطة الشاشة في:<br><code>${src}</code>`
              : `Place screenshot at:<br><code>${src}</code>`}
          </p>
        </div>`;
    };

    /* Trigger the image load (onerror fires if path is wrong) */
    img.dispatchEvent(new Event('load'));  // won't fire twice — rely on img.complete
    if (img.complete && img.naturalWidth > 0) {
      frame.innerHTML = '';
      frame.appendChild(img);
    } else if (img.complete && img.naturalWidth === 0) {
      /* Already failed before onerror wired — call manually */
      img.onerror();
    }
  }

  /* Show first page by default */
  showPage(0);

  /* Tab click handler */
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      /* Update active state */
      tabButtons.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      /* Show corresponding page */
      showPage(parseInt(btn.dataset.tab, 10));
    });
  });
}/****** */

/* ══════════════════════════════════════════════════════════
   ANIMATIONS
   ══════════════════════════════════════════════════════════ */

/**
 * Animate skill bar widths to their data-pct values.
 * Delayed 250ms so CSS transition is visible.
 */
function animateSkillBars() {
  setTimeout(() => {
    document.querySelectorAll('.skill-item__fill').forEach((el) => {
      el.style.width = `${el.dataset.pct}%`;
    });
  }, 250);
}

/**
 * Animate SVG language circle stroke offsets.
 * Delayed 350ms to sync with section reveal.
 */
function animateLanguageCircles() {
  setTimeout(() => {
    document.querySelectorAll('.circle-fill').forEach((el) => {
      const pct         = parseInt(el.dataset.pct, 10) || 0;
      const radius      = 42;
      const circumference = 2 * Math.PI * radius;
      el.style.strokeDashoffset = circumference * (1 - pct / 100);
    });
  }, 350);
}

/**
 * Trigger skill bar animation when the skills section scrolls into view.
 */
function initSkillBarObserver() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkillBars();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(skillsSection);
}

/**
 * Trigger language circle animation when the languages section scrolls into view.
 */
function initLanguageCircleObserver() {
  const langSection = document.getElementById('languages');
  if (!langSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateLanguageCircles();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(langSection);
}


/* ══════════════════════════════════════════════════════════
   NAVBAR — SCROLL BEHAVIOUR
   ══════════════════════════════════════════════════════════ */

/**
 * Add .navbar--scrolled class when user has scrolled past 20px.
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 20);
  }, { passive: true });
}


/* ══════════════════════════════════════════════════════════
   MOBILE MENU
   ══════════════════════════════════════════════════════════ */

/**
 * Wire up hamburger button and mobile menu link clicks.
 */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-open');
  });

  // Close menu when any link inside it is clicked
  mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
    });
  });
}


/* ══════════════════════════════════════════════════════════
   PROJECT FILTER
   ══════════════════════════════════════════════════════════ */

/**
 * Wire up project filter buttons.
 * Active button gets .is-active; grid re-renders with chosen category.
 */
function initProjectFilter() {
  document.querySelectorAll('.btn--filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn--filter').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderProjects(btn.dataset.filter);
    });
  });
}


/* ══════════════════════════════════════════════════════════
   MODAL — GLOBAL LISTENERS
   ══════════════════════════════════════════════════════════ */

/**
 * Close modal on overlay click or close button click.
 */
function initModal() {
  const overlay  = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
}


/* ══════════════════════════════════════════════════════════
   CONTACT FORM
   ══════════════════════════════════════════════════════════ */

/**
 * Wire up the contact form's submit button with visual feedback.
 * (Actual submission logic would go here — currently simulated.)
 */
function initContactForm() {
  const submitBtn = document.getElementById('contact-submit');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const lang = getLang();

    // Visual feedback
    const originalText = lang === 'ar' ? '🚀 إرسال' : '🚀 Send';
    const successText  = lang === 'ar' ? '✅ تم الإرسال!' : '✅ Sent!';

    submitBtn.textContent = successText;
    submitBtn.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';

    // Reset after 2.5s
    setTimeout(() => {
      submitBtn.textContent  = originalText;
      submitBtn.style.background = '';
    }, 2500);
  });
}


/* ══════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initial render of all dynamic sections
  renderAll();

  // Wire up all interactive features
  initNavbarScroll();
  initMobileMenu();
  initProjectFilter();
  initModal();
  initContactForm();
  initSkillBarObserver();
  initLanguageCircleObserver();

  // Start scroll-reveal on static elements
  observeRevealElements();
});