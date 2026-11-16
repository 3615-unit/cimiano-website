"""Build a trade page (e.g. /climatisation-paris) from a small spec file.

Usage:  python3 tools/make_trade_page.py tools/pages/climatisation-paris.py

The spec is a Python file defining PAGE = {...} (see tools/pages/ for examples).
The header, menu, quote box and footer are copied from savoir-faire.html, so
trade pages always match the rest of the site. Output: <slug>.html at the root.
After generating: link the page from savoir-faire.html, add it to sitemap.xml,
bump the ?v= number on the CSS link.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
NN, NB = " ", " "  # narrow no-break space (before ? !), no-break space (before :)
ARR = ('<span class="arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
       'stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>')


def fr(text):
    """French typography: no line break before ? ! ; : or inside « »."""
    text = re.sub(r" ([?!;])", NN + r"\1", text)
    text = re.sub(r" :", NB + ":", text)
    return text.replace("« ", "«" + NB).replace(" »", NB + "»")


def plain(text):
    return text.replace(NN, " ").replace(NB, " ")


def build(p):
    url = f"https://www.cimiano.fr/{p['slug']}"
    ld = [
        {"@context": "https://schema.org", "@type": "Service", "name": p["title"].split(" | ")[0],
         "serviceType": p["service"],
         "provider": {"@type": "HomeAndConstructionBusiness", "name": "Cimiano",
                      "url": "https://www.cimiano.fr", "telephone": "+33628564787"},
         "areaServed": ["Paris", "Île-de-France"], "url": url},
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": plain(fr(q)),
             "acceptedAnswer": {"@type": "Answer", "text": plain(fr(a))}} for q, a in p["faq"]]},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://www.cimiano.fr/"},
            {"@type": "ListItem", "position": 2, "name": "Notre savoir-faire",
             "item": "https://www.cimiano.fr/savoir-faire"},
            {"@type": "ListItem", "position": 3, "name": p["crumb"], "item": url}]},
    ]

    head = f'''    <main id="contenu">
    <a class="eyebrow eyebrow-link" href="savoir-faire">Notre savoir-faire</a>
    <h1>{p["h1"]}</h1>
    <p class="lead">{fr(p["lead"])}</p>
    <p class="intro">{fr(p["intro"])}</p>
    <img class="wide" src="img/{p["hero"][0]}" alt="{p["hero"][1]}" width="2000" height="1334" fetchpriority="high">
    </main>'''

    ticks = "\n".join(f"        <li>{fr(t)}</li>" for t in p["ticks"])
    steps = "\n".join(
        f'      <li><span class="num">{i:02d}</span><h3>{fr(t)}</h3><p>{fr(d)}</p></li>'
        for i, (t, d) in enumerate(p["steps"], 1))
    faq = "\n".join(f"      <details><summary>{fr(q)}</summary><p>{fr(a)}</p></details>"
                    for q, a in p["faq"])
    s1, s2 = p["section1"], p["section2"]

    middle = f'''
  <section class="card split reveal">
    <div>
      <span class="eyebrow">{s1["eyebrow"]}</span>
      <h2>{s1["h2"]}</h2>
      <p class="muted">{fr(s1["text"])}</p>
      <ul class="ticks">
{ticks}
      </ul>
    </div>
    <img src="img/{s1["img"][0]}" alt="{s1["img"][1]}" loading="lazy" width="1200" height="800">
  </section>

  <section class="card reveal">
    <span class="eyebrow">Comment nous travaillons</span>
    <h2 class="section-title">Notre <em>méthode</em></h2>
    <ol class="promises">
{steps}
    </ol>
  </section>

  <section class="card split split-flip reveal">
    <div>
      <span class="eyebrow">{s2["eyebrow"]}</span>
      <h2>{s2["h2"]}</h2>
      <p class="muted">{fr(s2["text"])}</p>
      <p><a class="btn-arrow" href="contact" data-umami-event="Clic devis">Parlez-nous de votre projet{ARR}</a></p>
    </div>
    <img src="img/{s2["img"][0]}" alt="{s2["img"][1]}" loading="lazy" width="1200" height="800">
  </section>

  <section class="card reveal">
    <span class="eyebrow">Vos questions</span>
    <h2 class="section-title">Questions <em>fréquentes</em></h2>
    <div class="faq">
{faq}
    </div>
  </section>
'''

    s = (ROOT / "savoir-faire.html").read_text()
    s = re.sub(r"<title>[^<]*</title>", f"<title>{p['title']}</title>", s, count=1)
    for prop in ('name="description"', 'property="og:description"'):
        s = re.sub(rf'(<meta {prop} content=")[^"]*"', lambda m: m.group(1) + p["desc"] + '"', s, count=1)
    s = re.sub(r'(<meta property="og:title" content=")[^"]*"', lambda m: m.group(1) + p["title"] + '"', s, count=1)
    s = s.replace('https://www.cimiano.fr/savoir-faire"', url + '"')
    s = s.replace("</head>", '<script type="application/ld+json">'
                  + json.dumps(ld, ensure_ascii=False) + "</script>\n</head>", 1)
    s = re.sub(r'    <main id="contenu">.*?    </main>', lambda m: head, s, count=1, flags=re.S)
    start = s.index("  </section>\n", s.index('class="card page-head"')) + len("  </section>\n")
    end = s.index('  <section class="card cta reveal"')
    s = s[:start] + middle + "\n" + s[end:]
    s = s.replace('<li><a href="savoir-faire" aria-current="page">', '<li><a href="savoir-faire">')
    out = ROOT / f"{p['slug']}.html"
    out.write_text(s)
    print("written", out.name)


if __name__ == "__main__":
    spec = {}
    exec(pathlib.Path(sys.argv[1]).read_text(), spec)
    build(spec["PAGE"])
