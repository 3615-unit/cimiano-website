# cimiano.fr

Website for Cimiano, family renovation company in Paris since 1960.

Plain HTML and CSS. No build step, no dependencies. Hosted on GitHub Pages.

## Pages

| URL | File |
|---|---|
| `/` | `index.html` |
| `/company` | `company.html` |
| `/expertise` | `expertise.html` |
| `/solutions` | `solutions.html` |
| `/responsibility` | `responsibility.html` |
| `/expertise-1` | `expertise-1.html` |
| `/contact` | `contact.html` |

URLs match the old Wix site so existing Google results and links keep working.

## Edit

- Text: edit the `.html` file directly. The header, menu and footer are repeated in each page, so a change there goes in every file.
- Styles: `css/style.css`.
- Images: `img/`. Keep them as `.webp` and under about 300 KB.

Push to `main` and GitHub Pages publishes within a minute or two.

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Links without `.html` (like `/company`) only resolve on GitHub Pages, so click `company.html` locally or use the live site.

## Contact form

No server. The form opens the visitor's email app with the request already written, addressed to the email in `data-to` on the form in `contact.html`.
