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
      title: 'تطبيق فزّاع',
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
      title: 'تصميم UI/UX – فزّاع',
      desc: 'نماذج أولية تفاعلية احترافية لتطبيق فزّاع مع تدفقات المستخدم الكاملة وتطبيق مبادئ تجربة المستخدم وDesign System متكامل.',
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
    isHrDashboard: true,   // flag → triggers special rich modal
    ar: {
      title: 'لوحة HR التحليلية – Power BI',
      desc: 'لوحة تحليل موارد بشرية متكاملة تغطي 15 موظفاً عبر 6 دول، تعرض الرواتب والحضور والتوزيع الجغرافي والجندري عبر 3 صفحات تفاعلية مبنية بـ Power BI.',
      tags: ['Power BI', 'DAX', 'Data Modeling', 'HR Analytics'],
    },
    en: {
      title: 'HR Analytics Dashboard – Power BI',
      desc: 'A comprehensive HR analytics dashboard covering 15 employees across 6 countries, visualizing salaries, attendance, and geographic/gender distribution across 3 interactive pages built with Power BI.',
      tags: ['Power BI', 'DAX', 'Data Modeling', 'HR Analytics'],
    },
  },
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
 */
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

/**
 * Render technical skill bars and soft skill cards.
 */
function renderSkills() {
  const lang       = getLang();
  const techList   = document.getElementById('tech-skills-list');
  const softGrid   = document.getElementById('soft-skills-grid');
  if (!techList || !softGrid) return;

  techList.innerHTML = TECH_SKILLS.map((skill) => `
    <div class="skill-item">
      <div class="skill-item__header">
        <span class="skill-item__name">
          <span class="skill-item__icon" aria-hidden="true">${skill.icon}</span>
          ${skill[lang]}
        </span>
        <span class="skill-item__percentage">${skill.pct}%</span>
      </div>
      <div class="skill-item__bar" role="progressbar" aria-valuenow="${skill.pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="skill-item__fill" data-pct="${skill.pct}"></div>
      </div>
    </div>
  `).join('');

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
 * Projects flagged with isHrDashboard:true get a rich
 * stats modal instead of the generic template.
 * @param {number} projectId
 */
function handleOpenProjectModal(projectId) {
  const lang    = getLang();
  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) return;

  // ── Rich HR Dashboard modal ────────────────────────────
  if (project.isHrDashboard) {
    const isAr = lang === 'ar';

   // const bodyHTML = `

      <!-- ── Dashboard preview image area ── -->
      <div class="hr-modal__preview">
        <div class="hr-modal__preview-grid">

          <!-- Overview page card -->
          <div class="hr-modal__page-card hr-modal__page-card--active">
            <div class="hr-modal__page-icon">📋</div>
            <span>${isAr ? 'نظرة عامة' : 'Overview'}</span>
          </div>
          <!-- Finance page card -->
          <div class="hr-modal__page-card">
            <div class="hr-modal__page-icon">💰</div>
            <span>${isAr ? 'الرواتب' : 'Finance'}</span>
          </div>
          <!-- Attendance page card -->
          <div class="hr-modal__page-card">
            <div class="hr-modal__page-icon">📅</div>
            <span>${isAr ? 'الحضور' : 'Attendance'}</span>
          </div>

        </div>
        <p class="hr-modal__tool-badge">
          <span class="hr-modal__tool-dot"></span>
          Power BI Desktop
        </p>
      </div>

      <!-- ── KPI Cards row ── -->
      <div class="hr-modal__kpis">
        <div class="hr-modal__kpi">
          <span class="hr-modal__kpi-value">15</span>
          <span class="hr-modal__kpi-label">${isAr ? 'إجمالي الموظفين' : 'Total Employees'}</span>
        </div>
        <div class="hr-modal__kpi">
          <span class="hr-modal__kpi-value">34</span>
          <span class="hr-modal__kpi-label">${isAr ? 'متوسط العمر' : 'Average Age'}</span>
        </div>
        <div class="hr-modal__kpi">
          <span class="hr-modal__kpi-value">$2.59K</span>
          <span class="hr-modal__kpi-label">${isAr ? 'متوسط الراتب' : 'Average Salary'}</span>
        </div>
        <div class="hr-modal__kpi">
          <span class="hr-modal__kpi-value">$191.5K</span>
          <span class="hr-modal__kpi-label">${isAr ? 'إجمالي المدفوعات' : 'Total Payments'}</span>
        </div>
      </div>

      <!-- ── Section: Overview insights ── -->
      <h4 class="hr-modal__section-title">
        ${isAr ? '📋 صفحة نظرة عامة (Overview)' : '📋 Overview Page'}
      </h4>
      <div class="hr-modal__insight-grid">
        <div class="hr-modal__insight">
          <div class="hr-modal__insight-header">
            <span class="hr-modal__insight-icon">👥</span>
            <span>${isAr ? 'توزيع الجنس' : 'Gender Distribution'}</span>
          </div>
          <div class="hr-modal__bar-row">
            <span>${isAr ? 'ذكور' : 'Male'}</span>
            <div class="hr-modal__bar-track">
              <div class="hr-modal__bar-fill hr-modal__bar-fill--male" style="width:53%"></div>
            </div>
            <span>8</span>
          </div>
          <div class="hr-modal__bar-row">
            <span>${isAr ? 'إناث' : 'Female'}</span>
            <div class="hr-modal__bar-track">
              <div class="hr-modal__bar-fill hr-modal__bar-fill--female" style="width:47%"></div>
            </div>
            <span>7</span>
          </div>
        </div>
        <div class="hr-modal__insight">
          <div class="hr-modal__insight-header">
            <span class="hr-modal__insight-icon">📄</span>
            <span>${isAr ? 'حالة العقد' : 'Contract Status'}</span>
          </div>
          <div class="hr-modal__bar-row">
            <span>${isAr ? 'نشط' : 'Active'}</span>
            <div class="hr-modal__bar-track">
              <div class="hr-modal__bar-fill hr-modal__bar-fill--active" style="width:67%"></div>
            </div>
            <span>10</span>
          </div>
          <div class="hr-modal__bar-row">
            <span>${isAr ? 'منتهي' : 'Inactive'}</span>
            <div class="hr-modal__bar-track">
              <div class="hr-modal__bar-fill hr-modal__bar-fill--inactive" style="width:33%"></div>
            </div>
            <span>5</span>
          </div>
        </div>
      </div>

      <!-- Country distribution -->
      <div class="hr-modal__country-grid">
        ${[
          { flag:'🇯🇴', name: isAr ? 'الأردن'  : 'Jordan',  n: 4 },
          { flag:'🇱🇧', name: isAr ? 'لبنان'   : 'Lebanon', n: 3 },
          { flag:'🇸🇾', name: isAr ? 'سوريا'   : 'Syria',   n: 3 },
          { flag:'🇪🇬', name: isAr ? 'مصر'     : 'Egypt',   n: 2 },
          { flag:'🇮🇶', name: isAr ? 'العراق'  : 'Iraq',    n: 2 },
          { flag:'🇦🇪', name: isAr ? 'الإمارات': 'UAE',     n: 1 },
        ].map(c => `
          <div class="hr-modal__country">
            <span class="hr-modal__country-flag">${c.flag}</span>
            <span class="hr-modal__country-name">${c.name}</span>
            <div class="hr-modal__country-bar-track">
              <div class="hr-modal__country-bar" style="width:${c.n * 25}%"></div>
            </div>
            <span class="hr-modal__country-n">${c.n}</span>
          </div>
        `).join('')}
      </div>

      <!-- ── Section: Finance insights ── -->
      <h4 class="hr-modal__section-title">
        ${isAr ? '💰 صفحة الرواتب (Finance)' : '💰 Finance Page'}
      </h4>
      <div class="hr-modal__finance-row">
        <div class="hr-modal__finance-kpi hr-modal__finance-kpi--male">
          <span class="hr-modal__finance-kpi-val">$101.9K</span>
          <span class="hr-modal__finance-kpi-lbl">${isAr ? 'مجموع رواتب الذكور' : 'Male Payments Total'}</span>
        </div>
        <div class="hr-modal__finance-kpi hr-modal__finance-kpi--female">
          <span class="hr-modal__finance-kpi-val">$89.6K</span>
          <span class="hr-modal__finance-kpi-lbl">${isAr ? 'مجموع رواتب الإناث' : 'Female Payments Total'}</span>
        </div>
      </div>
      <p class="hr-modal__note">
        ${isAr
          ? '🏆 أعلى راتب: لينا فارس (الأردن) — $26,600 · أدنى راتب: دانا خالد (مصر) — $1,800'
          : '🏆 Highest earner: Lina Fares (Jordan) — $26,600 · Lowest: Dana Khaled (Egypt) — $1,800'
        }
      </p>

      <!-- ── Section: Attendance insights ── -->
      <h4 class="hr-modal__section-title">
        ${isAr ? '📅 صفحة الحضور (Attendance)' : '📅 Attendance Page'}
      </h4>
      <div class="hr-modal__attendance-kpis">
        <div class="hr-modal__att-kpi">
          <span class="hr-modal__att-val">77.65%</span>
          <span class="hr-modal__att-lbl">${isAr ? 'الحضور الإجمالي' : 'Overall Rate'}</span>
        </div>
        <div class="hr-modal__att-kpi hr-modal__att-kpi--female">
          <span class="hr-modal__att-val">80.84%</span>
          <span class="hr-modal__att-lbl">${isAr ? 'حضور الإناث' : 'Female Rate'}</span>
        </div>
        <div class="hr-modal__att-kpi hr-modal__att-kpi--male">
          <span class="hr-modal__att-val">75.19%</span>
          <span class="hr-modal__att-lbl">${isAr ? 'حضور الذكور' : 'Male Rate'}</span>
        </div>
      </div>
      <p class="hr-modal__note">
        ${isAr
          ? '⭐ أعلى حضور: لينا فارس — 94.70% (125 يوم) · أدنى حضور: سارة حسن — 22.73% (5 أيام)'
          : '⭐ Top attendance: Lina Fares — 94.70% (125 days) · Lowest: Sara Hassan — 22.73% (5 days)'
        }
      </p>

      <!-- ── Tags ── -->
      <div class="modal__tags" style="margin-top:20px;">
        ${buildTagsHTML(project[lang].tags, 'tag')}
      </div>

    `;

    openModal(project[lang].title, isAr ? 'تحليل الموارد البشرية · 3 صفحات تفاعلية' : 'HR Analytics · 3 Interactive Pages', bodyHTML);
    return;
  }

  // ── Generic project modal (default) ───────────────────
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

  openModal(project[lang].title, project[lang].tags.join(' · '), bodyHTML);
}

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