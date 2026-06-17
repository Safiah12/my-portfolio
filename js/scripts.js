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
    githubUrl: '#',
    ar: {
      title: 'تطبيق فزعه',
      desc: 'تطبيق جوال يربط المستخدمين بمزودي الخدمات القريبين لتأجير المنتجات وطلب الخدمات الفورية .',
      tags: ['Flutter', 'Dart', 'Firebase', 'Figma'],
    },
    en: {
      title: 'FAZAA Application',
      desc: 'Mobile app connecting users with nearby service providers to rent products or request on-demand services.',
      tags: ['Flutter', 'Dart', 'Firebase', 'Figma'],
    },
  },
  
  {
  id: 3,
  cat: 'data',
  icon: '📊',
  thumbClass: 'project-card__thumbnail--3',
  githubUrl: '#',
    ar: {
    title: 'لوحة أداء المبيعات – Power BI',
    desc:' لوحة تحليل مبيعات تفاعلية تعرض مؤشرات الأداء الرئيسية واتجاهات البيانات لمقارنة المنتجات والفروع واستكشاف الأنماط بوضوح. ',
    tags: ['Power BI', 'Data Visualization ', '🏆 المركز الأول'],
  },
  en: {
    title: 'Sales Performance Dashboard – Power BI',
    desc: 'An interactive sales analytics dashboard showcasing key performance indicators, product comparisons, branch performance, and sales trends.',
    tags: ['Power BI', 'Data Visualization ', '🏆 1st Place Award'],
  },
 
},
  {
    id: 4,
    cat: 'data',
    icon: '🏪',
    thumbClass: 'project-card__thumbnail--4',
    githubUrl: '#',
    ar: {
      title: 'لوحة تحليل أداء المبيعات',
      desc: 'لوحة Power BI تفاعلية لتحليل أداء المبيعات، وعرض المؤشرات الرئيسية والاتجاهات الشهرية والتوزيع الجغرافي.',
      tags: ['Power BI', 'DAX', 'Data Visualization', 'Data Modeling'],
    
    },
    en: {
      title: 'Sales Performance Dashboard',
      desc:'An interactive Power BI dashboard for analyzing sales performance, key metrics, monthly trends, and geographic distribution.',
     tags: ['Power BI', 'DAX', 'Data Visualization', 'Data Modeling'],
    },
  },
  {
    id: 5,
    cat: 'web',
    icon: '🌐',
    thumbClass: 'project-card__thumbnail--5',
    githubUrl: '#',
    ar: {
      title: 'دعم WordPress والواجهة الأمامية – جمعية رتل الرقمية',
      desc: 'تجربة تطوعية تقنية ساهمت من خلالها في تحسين موقع جمعية رتل الرقمية باستخدام WordPress وCSS مخصصة.',
      tags: ['WordPress', 'CSS', 'Responsive', 'UI/UX'],
    },
    en: {
      title: 'WordPress & Front-End Support – Ratel Digital Association',
      desc: 'A volunteer technical experience where I contributed to improving the Ratel Digital Association website using WordPress and custom CSS.',
      tags: ['WordPress', 'CSS', 'Responsive', 'UI/UX'],
    },
  },
 {
  id: 6,
  cat: 'data',
  icon: '📈',
  thumbClass: 'project-card__thumbnail--2',
  githubUrl: '#',
ar: {
    title: 'HR – لوحة الموارد البشرية',
    desc: 'لوحة معلومات تفاعلية تم تطويرها باستخدام Power BI لتحليل بيانات الموارد البشرية والمدفوعات والحضور. توفر رؤية موحدة لمؤشرات القوى العاملة مع إمكانية مقارنة البيانات حسب الدولة والجنس وحالة العقد عبر ثلاث صفحات تحليلية مترابطة.',
    tags: ['Power BI', 'DAX', 'HR Analytics', 'Data Modeling', 'DAX'],
  },
  en: {
    title: ' –  HR Analytics Dashboard',
    desc: 'An interactive Power BI dashboard designed to analyze workforce, payroll, and attendance data. It provides a unified view of key HR metrics with comparisons across countries, gender, and contract status through three interconnected analytical pages.',
    tags: ['Power BI', 'DAX', 'HR Analytics', 'Data Modeling', 'DAX'],
  },},
{
    id: 7,
    cat: 'web',
    icon: '🌐',
    thumbClass: 'project-card__thumbnail--5',
    githubUrl: '#',
    ar: {
      title: ' يدوي (Yadwi)',
      desc: 'يدوي منصة رقمية تهدف إلى دعم الحرفيين والفنانين المستقلين من خلال توفير متاجر إلكترونية لعرض المنتجات اليدوية، بالإضافة إلى نظام لإدارة وحجز ورش العمل الحرفية.',
      tags: ['HTML', 'CSS', 'Responsive', 'UI/UX'],
    },
    en: {
      title: 'Yadwi Website ',
      desc: 'Yadwi is a digital platform designed to support artisans and independent creators through online stores for handmade products and a craft workshop booking system.  ',
      tags: ['HTML', 'CSS', 'PHP-LARVEAL', 'UI/UX'],
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
  { icon: '🐍', ar: { title: 'Python وHTML وCSS وJavaScript', provider: 'منصة سطر', date: '2023-2024' }, en: { title: 'Python, HTML, CSS & JavaScript', provider: 'Satr Platform', date: '2023-2024' } },

  { icon: '🎨', ar: { title: 'تصميم واجهات وتجارب المستخدم (UI/UX)', provider: 'Coursera', date: '2025' }, en: { title: 'Designing User Interfaces & Experiences', provider: 'Coursera', date: '2025' } },

  {
    icon: '🧪',
    ar: {
      title: 'إعداد شهادة اختبار البرمجيات ISTQB Foundation Level',
      provider: 'Coursera · Board Infinity',
      date: '2025'
    },
    en: {
      title: 'ISTQB Foundation Level Software Testing Certification Prep',
      provider: 'Coursera · Board Infinity',
      date: '2025'
    }
  },

  { icon: '📗', ar: { title: 'تحليل البيانات وتمثيلها بـ Excel', provider: 'أكاديمية تواق', date: '2023' }, en: { title: 'Data Analysis & Representation using Excel', provider: 'Tuwaiq Academy', date: '2023' } },

  { icon: '📊', ar: { title: 'تحليل البيانات وتمثيلها بـ Power BI', provider: 'وزارة الاتصالات وتقنية المعلومات', date: '2023' }, en: { title: 'Power BI Data Analysis & Visualization', provider: 'Ministry of Communications & IT', date: '2023' } },

  { icon: '📈', ar: { title: 'تحليل البيانات – المستوى الأول والثاني', provider: 'الأكاديمية السعودية الرقمية', date: '2024' }, en: { title: 'Data Analytics (Level 1 & 2)', provider: 'Saudi Digital Academy / Coursera', date: '2024' } },

  { icon: '🔄', ar: { title: 'التحول الرقمي', provider: 'دروب', date: '2025' }, en: { title: 'Digital Transformation', provider: 'Droob', date: '2023' } },

  { icon: '🏛️', ar: { title: 'الهيكل المؤسسي الوطني والأثر الرقمي', provider: 'دروب', date: '2025' }, en: { title: 'National Institutional Structure & Digital Impact', provider: 'Droob', date: '2025' } },

  { icon: '🤖', ar: { title: 'أساسيات الذكاء الاصطناعي', provider: 'SDAIA', date: '2025' }, en: { title: 'Fundamentals of Artificial Intelligence', provider: 'SDAIA', date: '2023' } },

  { icon: '🌐', ar: { title: 'التحول الرقمي والهوية الرقمية', provider: 'منصة سطر', date: '2025' }, en: { title: 'Digital Transformation & Digital Identity', provider: 'Satr Platform', date: '2025' } },
];

/** Professional certificates */
const CERTIFICATES = [
  { icon: '📊', ar: { name: 'Google Data Analytics',                    issuer: 'Google / Coursera',            year: 'فبراير 2024' }, en: { name: 'Google Data Analytics',                    issuer: 'Google / Coursera',            year: 'Feb 2024' } },
  { icon: '📈', ar: { name: 'تحليل البيانات – المستوى الأول والثاني',   issuer: 'الأكاديمية السعودية الرقمية',  year: '2024'        }, en: { name: 'Data Analytics Level 1 & 2',              issuer: 'Saudi Digital Academy',         year: '2024'     } },
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
  const lang = getLang();
  const list = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.cat === filter);

  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const isAr = lang === 'ar';

  const detailsLabel = isAr ? '📄 التفاصيل' : '📄 Details';
  const githubLabel  = '🐙 GitHub';

  grid.innerHTML = list.map((project) => {

    const detailsUrl = `projects/project-${project.id}.html`;
    const githubUrl  = project.githubUrl || '#';

    return `
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

            <!-- زر التفاصيل — يفتح صفحة projects/project-{id}.html -->
            <a  class="project-card__link project-card__link--primary"
                href="${detailsUrl}"
                aria-label="${isAr ? 'تفاصيل المشروع' : 'Project details'}">
              ${detailsLabel}
            </a>

            <!-- زر GitHub -->
            <a  class="project-card__link"
                href="${githubUrl}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository">
              ${githubLabel}
            </a>

          </div>
        </div>
      </article>`;

  }).join('');

  observeRevealElements();
}

/**
 * Render technical skill bars and soft skill cards.
 */
function renderSkills() {
  const lang     = getLang();
  const techList = document.getElementById('tech-skills-list');
  const softGrid = document.getElementById('soft-skills-grid');
  if (!techList || !softGrid) return;

  // ── المهارات التقنية — نفس تنسيق المهارات الشخصية (cards بدون bar) ──
  techList.innerHTML = TECH_SKILLS.map((skill) => `
    <div class="soft-skill-card">
      <span class="soft-skill-card__icon" aria-hidden="true">${skill.icon}</span>
      <span class="soft-skill-card__name">${skill[lang]}</span>
    </div>
  `).join('');

  // ── المهارات الشخصية — بدون تغيير ──
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
    // مشروع HR يفتح صفحة التفاصيل المستقلة مباشرة
    window.location.href = `projects/project-3.html`;
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