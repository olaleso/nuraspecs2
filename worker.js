const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  }
});

const clean = (value, max = 1000) => String(value ?? '').trim().slice(0, max);
const escapeHtml = (value) => clean(value, 5000)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== '/api/contact') {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed.' }, 405);
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return json({ error: 'Invalid request format.' }, 415);
    }

    let input;
    try {
      input = await request.json();
    } catch {
      return json({ error: 'Invalid form data.' }, 400);
    }

    // Honeypot field: real visitors never fill this in.
    if (clean(input.website, 100)) {
      return json({ success: true });
    }

    const name = clean(input.name, 120);
    const email = clean(input.email, 254);
    const company = clean(input.company, 160);
    const phone = clean(input.phone, 80);
    const interest = clean(input.interest, 160);
    const message = clean(input.message, 4000);

    if (!name || !email || !interest || !message) {
      return json({ error: 'Please complete all required fields.' }, 400);
    }

    if (!validEmail(email)) {
      return json({ error: 'Please enter a valid email address.' }, 400);
    }

    const subjectInterest = interest.replace(/[\r\n]+/g, ' ');
    const text = `New Nuraspecs website enquiry\n\nName: ${name}\nEmail: ${email}\nOrganisation / School: ${company || 'Not provided'}\nPhone: ${phone || 'Not provided'}\nInterest: ${interest}\n\nMessage:\n${message}`;
    const html = `
      <h2>New Nuraspecs website enquiry</h2>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>Organisation / School</strong></td><td>${escapeHtml(company || 'Not provided')}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone || 'Not provided')}</td></tr>
        <tr><td><strong>Interest</strong></td><td>${escapeHtml(interest)}</td></tr>
      </table>
      <h3>Message</h3>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

    try {
      const result = await env.CONTACT_EMAIL.send({
        to: 'ibrahimsowunmi@gmail.com',
        from: { email: 'website@nuraspecs.com', name: 'Nuraspecs Website' },
        replyTo: { email, name },
        subject: `Nuraspecs enquiry: ${subjectInterest}`,
        text,
        html
      });

      return json({ success: true, messageId: result.messageId });
    } catch (error) {
      console.error('Contact email failed', error?.code, error?.message);
      return json({ error: 'We could not send your message right now. Please try again later.' }, 500);
    }
  }
};
