const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const params = new URLSearchParams(window.location.search);
const intent = params.get('intent');
const interestSelect = document.querySelector('[name="interest"]');
if (interestSelect && intent) {
  const mapping = {
    demo: 'Request a School Management demo',
    trial: 'Start a School Management free trial',
    pricing: 'School Management pricing',
    software: 'Custom Software Development',
    cloud: 'Cloud & Platform Engineering',
    support: 'Application Support & Maintenance',
    integration: 'Systems Integration'
  };
  if (mapping[intent]) interestSelect.value = mapping[intent];
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`Nuraspecs website enquiry: ${data.get('interest')}`);
    const body = encodeURIComponent(
`Name: ${data.get('name')}
Organisation / School: ${data.get('company') || 'Not provided'}
Email: ${data.get('email')}
Phone: ${data.get('phone') || 'Not provided'}
Interest: ${data.get('interest')}

Message:
${data.get('message')}`
    );
    window.location.href = `mailto:info@nuraspecs.com?subject=${subject}&body=${body}`;
  });
}
