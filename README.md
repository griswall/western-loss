# Western Loss Association (Modern Rebuild)

Modern Next.js rebuild of `westernloss.org` with the members list consolidated into one searchable page.

## Local development

```bash
cd /Users/kup/Desktop/westernloss-modern-site
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build static site

This project is configured for static export (`output: "export"`) so it can be hosted on GitHub Pages.

```bash
npm run build
```

Generated output is written to `out/`.

## Legacy documents on GitHub Pages

Linked membership/presentation/news PDFs are mirrored in:

- `public/job/`

They are served from the same domain after deploy (for example: `/job/Appraisal.pdf`), so you can fully remove GoDaddy hosting without breaking those document links.

## Contact form email delivery

The contact form posts to [FormSubmit](https://formsubmit.co/) and sends messages to:

- `info@westernloss.org`

FormSubmit requires a one-time activation email for each destination address. Submit the form once, open the activation email for that address, and confirm. After activation, submissions are delivered to that inbox.

## Sanity CMS (for non-technical editors)

This repo is wired so non-technical editors can manage:

- Home page content
- Events page content
- Membership page content
- Members directory company list
- News posts and albums

### 1) Configure environment

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

If Sanity is not configured, these pages automatically fall back to the local source content.

### 2) Run the editor UI

```bash
npm run sanity:dev
```

This starts Sanity Studio (default: http://localhost:3333) with structured editing for Home, Events, Membership, Members Directory, and News.

### 2.1) First-time content setup in Studio

In Studio, create/edit:

- `Home Page` (single document)
- `Events Page` (single document)
- `Membership Page` (single document)
- `Member Companies` (multiple documents)
- `News Posts` (multiple documents)

### 3) Publish editor access for your team

Deploy Studio so editors can log in and edit in browser:

```bash
npm run sanity:deploy
```

Then invite team members from the Sanity project settings.

### 4) Connect GitHub Pages build to Sanity

Set these repo secrets in GitHub:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

The deploy workflow already passes these secrets during build.

### 5) Set up auto-deploy from Sanity publish

The deploy workflow already supports webhook-triggered builds via `repository_dispatch`.

#### 5.1 Create a GitHub token for webhook calls

Create a fine-grained Personal Access Token with access to this repo and:

- `Actions: Read and write`
- `Contents: Read and write`

#### 5.2 Create Sanity webhook

In Sanity project settings, add a webhook with:

- URL:
  `https://api.github.com/repos/<GITHUB_OWNER>/<GITHUB_REPO>/dispatches`
- Method: `POST`
- Filter:
  `_type in ["homePage","eventsPage","membershipPage","memberCompany","newsPost"]`
- Projection/payload:
  `{"event_type":"sanity-content-update"}`
- Headers:
  - `Authorization: Bearer <YOUR_GITHUB_TOKEN>`
  - `Accept: application/vnd.github+json`
  - `X-GitHub-Api-Version: 2022-11-28`

Once this is saved, every publish/update in Sanity for those content types triggers a GitHub Pages rebuild automatically.

## GitHub Pages deployment

The workflow file is:

- `.github/workflows/deploy-pages.yml`

When you push to `main`, GitHub Actions will:

1. Install dependencies
2. Build the site
3. Publish `out/` to GitHub Pages

## Custom domain

`public/CNAME` is set to:

- `westernloss.org`

After deployment, point DNS to GitHub Pages:

1. `A` records for `@` to GitHub Pages IPs
2. `CNAME` for `www` to your GitHub Pages hostname

Then enable custom domain + HTTPS in GitHub Pages settings.
