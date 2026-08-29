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
  const formStatus = document.querySelector('#form-status');
  const submitButton = document.querySelector('#contact-submit');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const payload = Object.fromEntries(data.entries());

    formStatus.className = 'form-status';
    formStatus.textContent = 'Sending your message…';
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not send your message. Please try again.');

      formStatus.className = 'form-status success';
      formStatus.textContent = 'Thank you. Your message has been sent successfully. We’ll get back to you shortly.';
      contactForm.reset();
      if (interestSelect && intent && mapping[intent]) interestSelect.value = mapping[intent];
    } catch (error) {
      formStatus.className = 'form-status error';
      formStatus.textContent = error.message || 'We could not send your message. Please email info@nuraspecs.com or try again later.';
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
    }
  });
}
