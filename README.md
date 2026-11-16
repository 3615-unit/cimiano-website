# cimiano.fr

Website for Cimiano, family renovation company in Paris since 1960.

Plain HTML and CSS. No build step, no dependencies. Hosted on GitHub Pages.

## Pages

| URL | File |
|---|---|
| `/` | `index.html` |
| `/qui-sommes-nous` | `qui-sommes-nous.html` |
| `/secteurs-d-intervention` | `secteurs-d-intervention.html` |
| `/savoir-faire` | `savoir-faire.html` |
| `/nos-promesses` | `nos-promesses.html` |
| `/certifications` | `certifications.html` |
| `/contact` | `contact.html` |

The old Wix addresses (`/company`, `/expertise`, `/solutions`, `/responsibility`, `/expertise-1`) are small redirect pages with the same names. Keep them so old Google results and links still land on the right page.

Fonts (Instrument Serif and Inter) are served from `fonts/`, not from Google.

## Edit

- Text: edit the `.html` file directly. The header, menu and footer are repeated in each page, so a change there goes in every file.
- Styles: `css/style.css`.
- Images: `img/`. Keep them as `.webp` and under about 300 KB.

Push to `main` and GitHub Pages publishes within a minute or two.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Links without `.html` (like `/qui-sommes-nous`) only resolve on GitHub Pages, so click `qui-sommes-nous.html` locally or use the live site.

## Contact form

No server. The form opens the visitor's email app with the request already written, addressed to the email in `data-to` on the form in `contact.html`.
