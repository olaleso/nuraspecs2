# Nuraspecs Solutions Website

Responsive, GitHub Pages-ready corporate website for **Nuraspecs Solutions**.

## Live-site direction

This build follows the preferred blue-and-white SaaS mockup direction and presents the **Nuraspecs School Management System** as the company's flagship application.

### Company details included

- Company: **Nuraspecs Solutions**
- Tagline: **Making life easier with cutting-edge software solutions.**
- Email: **info@nuraspecs.com**
- WhatsApp: **+234 803 845 5341**
- Location: **Nigeria**
- Domain: **www.nuraspecs.com**
- Social media: placeholders for LinkedIn, X, Instagram and Facebook
- School Management commercial model: free trial, request a demo, monthly subscription, annual subscription and contact-for-pricing
- Future Nuraspecs applications: clearly marked as coming soon

## Files

- `index.html` — GitHub Pages homepage
- `school-management.html` — flagship School Management System product page
- `about.html` — company About page
- `blog.html` — Insights placeholder ready for future articles/CMS integration
- `contact.html` — enquiry, demo, trial and pricing contact page
- `privacy.html` — starter privacy notice
- `404.html` — GitHub Pages 404 page
- `assets/logo.svg` — Nuraspecs logo used across the website
- `assets/favicon.svg` — browser favicon
- `assets/styles.css` — responsive site design
- `assets/script.js` — mobile navigation, animations and contact form behaviour
- `.nojekyll` — tells GitHub Pages to publish the static files directly
- `robots.txt` and `sitemap.xml` — starter search-engine files using the planned domain

## Run locally

From the website directory:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Publish as a GitHub Pages homepage

The simplest setup is to use a **dedicated repository for the company website** and keep these files at the repository root.

```bash
git init
git add .
git commit -m "Build Nuraspecs Solutions website"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

Then in GitHub:

1. Open the repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and `/ (root)`.
5. Save.
6. GitHub will provide a `github.io` URL after deployment.

Because `index.html` is in the repository root, it becomes the GitHub Pages homepage automatically.

## If this website lives inside another repository

GitHub Pages branch deployment works most cleanly when the static site is at the repository root or in `/docs`.

If the existing School Management System source repository should also host the company website, a recommended structure is:

```text
repo-root/
  docs/
    index.html
    school-management.html
    about.html
    blog.html
    contact.html
    privacy.html
    404.html
    assets/
```

Then configure GitHub Pages to publish from `main` → `/docs`.

Alternatively, keep the company website in its own repository. This is usually cleaner because the corporate website and application source code can evolve independently.

## Custom domain: www.nuraspecs.com

Do **not** add a `CNAME` file until the domain has actually been registered and DNS is ready.

When the domain is available:

1. In GitHub Pages settings, enter `www.nuraspecs.com` as the custom domain.
2. Configure the DNS records GitHub provides.
3. Enable **Enforce HTTPS** after GitHub validates the domain.
4. Add a `CNAME` file at repository root containing only:

```text
www.nuraspecs.com
```

The current metadata, `robots.txt`, and `sitemap.xml` already use the planned domain. If the final domain changes, update those references.

## Contact form behaviour

GitHub Pages is static hosting, so it does not run a server-side form processor. The current form opens the visitor's default email client with the enquiry pre-filled to `info@nuraspecs.com`.

For a seamless production form later, connect one of:

- a Nuraspecs API endpoint
- Formspree
- Netlify Forms (if hosted on Netlify)
- a serverless function
- a CRM form endpoint

## Important launch checks

Before the final public launch:

- confirm the final registered company/legal name
- confirm the domain registration
- review the privacy notice
- decide whether analytics and cookie consent are required
- connect a production form endpoint if desired
- add real product screenshots as the School Management System UI matures
- add real social links when accounts are created
- add real customer testimonials/case studies only with permission
- add actual pricing only after the commercial model is finalised

## No invented claims

The interface illustrations contain clearly labelled **demo data**. The website intentionally avoids fabricated customer numbers, uptime claims, testimonials, awards or public pricing.
