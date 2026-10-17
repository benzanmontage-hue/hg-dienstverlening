# SPEC — hg-dienstverlening.nl (homepage)

Deze spec is de bron van waarheid voor `index.html`. Wijzig eerst de spec, daarna de pagina,
en draai daarna `node scripts/check-spec.mjs`. Een wijziging is pas klaar als de check groen is.

- **Versie:** 2.0 (oktober 2026)
- **Stack:** statische HTML, geen build-stap, gehost via Cloudflare (zie `.gitignore`: `.wrangler/`)
- **Taal:** Nederlands (`lang="nl"`), u-vorm

---

## 1. Doel

| | |
|---|---|
| **Wie** | Huiseigenaren in Arnhem en de rest van Gelderland met een verbouwplan |
| **Eerste vraag van de bezoeker** | "Kunnen jullie dit voor mij doen, wat kost het en hoe gaat het?" |
| **Primaire actie** | Gratis offerte aanvragen (formulier `#contact`) |
| **Secundaire acties** | Bellen, WhatsApp |

## 2. Merkregels (huisstijl blijft, uitvoering moderner)

- Kleuren: navy als grond, amber als accent. Amber staat op de primaire actie, de cijfers en de planningsbalken — nergens anders.
- Lettertypen: Archivo (koppen, 700–900) en Inter (tekst, 400–600). Geen derde lettertype.
- Iconen: geen emoji in de interface. Alleen inline SVG met `currentColor`.
- Knoppen en foto's: rechte hoeken (`--radius: 0`). Bouwkundig strak.
- Geen verlopen (gradients) behalve een neutrale scrim onder tekst op een foto.
- Geen schaduw op elementen in rust; alleen op wat zweeft (menu, lightbox).
- Het amberen streepje vóór de plaatsregel in de hero blijft als herkenbaar merkdetail.

## 3. Design tokens

De CSS in `index.html` (`:root`) moet exact deze waarden bevatten. De check vergelijkt ze.

```json tokens
{
  "--ink": "#0f172a",
  "--ink-2": "#1e293b",
  "--ink-3": "#0b1220",
  "--accent": "#f59e0b",
  "--accent-dark": "#b45309",
  "--bg": "#ffffff",
  "--bg-soft": "#f6f7f9",
  "--muted": "#55637a",
  "--on-dark": "#ffffff",
  "--on-dark-muted": "rgba(255,255,255,.74)",
  "--wa": "#25d366",
  "--danger": "#b91c1c",
  "--head": "'Archivo',sans-serif",
  "--body": "'Inter',sans-serif",
  "--fs-display": "clamp(2.75rem,6.4vw,5.5rem)",
  "--fs-h2": "clamp(2rem,4.2vw,3.5rem)",
  "--fs-statement": "clamp(1.375rem,2.4vw,2rem)",
  "--fs-body": "1.0625rem",
  "--fs-small": ".875rem",
  "--max": "1240px",
  "--gutter": "clamp(16px,3vw,32px)",
  "--section": "clamp(64px,10vw,152px)",
  "--radius": "0px",
  "--ease": "cubic-bezier(.2,.7,.2,1)",
  "--dur": "700ms"
}
```

Typografie: maximaal vijf zichtbare groottes. Koppen: tracking −0.02em tot −0.04em, regelhoogte ≤ 1.05.
Lopende tekst ≥ 16px, regelhoogte 1.5–1.6, maximaal ~70 tekens per regel.

## 4. Vaste bedrijfsgegevens

Overal op de pagina exact deze waarden (de check zoekt naar afwijkingen).

```json facts
{
  "phone_href": "tel:+31619009743",
  "phone_display": "+31 6 19009743",
  "whatsapp": "https://wa.me/31619009743",
  "email": "hgdienstverleningbouw@outlook.com",
  "kvk": "97940879",
  "address": "Vleutenstraat 88, 1106 CX Amsterdam",
  "hours": "Ma–vr 08:00–18:00 · za 09:00–16:00",
  "form_action": "https://formspree.io/f/xgoqnzqn",
  "werkspot": "https://www.werkspot.nl/profiel/hg-dienstverlening"
}
```

## 5. Paginaopbouw — claim en bewijs per sectie

De ankers blijven gelijk aan versie 1, omdat `llms.txt` en externe links ernaar verwijzen.

```json sections
["home", "diensten", "werkwijze", "projecten", "about", "reviews", "faq", "contact"]
```

| # | Anker | Claim | Bewijs | Compositie |
|---|---|---|---|---|
| 1 | `#home` | Verbouwen zonder gedoe | Vaste prijs, offerte binnen 1 werkdag, 2 jaar garantie, vergunning geregeld | Navy, tekst links, opgeleverde foto rechts tot de rand |
| 2 | `#diensten` | Wij doen uw type project | Wat erbij hoort + doorlooptijd per dienst, echte projectfoto | Wit, **projectkiezer** (het interactieve element) |
| 3 | `#werkwijze` | U weet altijd waar u staat | Zes fasen met wanneer/wat | Navy, **bouwplanning** (Gantt-balken) |
| 4 | `#projecten` | We maken het echt | Foto's van de bouwplaats, van fundering tot oplevering | Wit, uitgelicht project + rijen per categorie, lightbox |
| 5 | `#about` | Eén team, één aanspreekpunt | Cijfers: 10+ jaar, 1 werkdag, 2 jaar, 1 aanspreekpunt; werkgebied | Amber veld met grote cijfers |
| 6 | `#reviews` | Klanten zijn tevreden | 3 echte Werkspot-reviews, 5,0/5 | Wit, één grote quote + twee kleinere |
| 7 | `#faq` | Uw vragen vooraf beantwoord | 6 vragen (gelijk aan FAQ-JSON-LD) | Zachtgrijs, twee kolommen |
| 8 | `#contact` | Start vandaag | Formulier + direct contact | Navy, wit formulierpaneel |
| — | footer | Liever bellen? | Telefoonnummer groot | Donkerste navy, afsluiter |

**Bewijsregel:** geen verzonnen klanten, reviews, cijfers of projecten. Bijschriften beschrijven alleen wat op de foto te zien is.

## 6. Componenten

### 6.1 Navigatie
Wordmark + logo, vijf links (Diensten, Werkwijze, Projecten, Reviews, FAQ), één actie ("Gratis offerte").
Onder 1024px: menuknop met `aria-expanded`/`aria-controls`; het menu wordt met een class geopend (geen inline styles),
sluit bij Escape, bij een linkklik en bij resize naar desktop.

### 6.2 Projectkiezer (`#diensten`)
- Vier diensten: Aanbouw & uitbouw · Renovatie · Complete verbouwing · Dak & onderhoud.
- Per dienst: korte uitleg, wat erbij hoort, indicatie doorlooptijd, één echte foto, knop "Offerte voor …".
- Knop zet het formulierveld `projectType` op die dienst en scrolt naar `#contact`.
- Toegankelijk: `role="tablist"`/`tab`/`tabpanel`, pijltjestoetsen wisselen.
- **Zonder JavaScript** staan alle vier de diensten onder elkaar (volledig leesbaar).

### 6.3 Bouwplanning (`#werkwijze`)
Een `<ol>` met zes fasen. Elke fase toont naam, uitleg, "wanneer", en een balk in een 6-koloms raster
die de volgorde in tijd verbeeldt. Balken groeien één keer in beeld (de signatuur-animatie).

### 6.4 Projecten, voor/na-schuif en lightbox (`#projecten`)
De aanbouw in Arnhem is een voor/na-schuif: links groeit 'vloer gestort' over 'fundering' als je naar rechts sleept.
Bediening via een `<input type="range">` (muis, touch, pijltjestoetsen), startpositie 20%.
Elke foto is een link naar het bestand zelf (werkt zonder JS). Met JS opent een `<dialog>`-lightbox met
vorige/volgende, Escape sluit, focus keert terug. Geen automatisch draaiende slideshow.

### 6.5 Offerteformulier (`#contact`)
Begint met één makkelijke vraag: "Wat wilt u laten doen?" als keuzeknoppen (`name="projectType"`), die de projectkiezer voorinvult.
Daarna: naam*, e-mail*, telefoon, postcode of plaats, korte omschrijving, met een link om foto's via WhatsApp te sturen.
Zichtbare labels, `autocomplete`, verplichte velden gemarkeerd. Foutstijl alleen na interactie (`:user-invalid`).
Met JS: verzenden via `fetch` (Formspree, `Accept: application/json`), melding in een `aria-live`-gebied;
zonder JS: gewone POST. Honeypot-veld `_gotcha`. Privacy-akkoord verplicht.

### 6.6 Scrollgedrag
- Menubalk schuift weg bij omlaag scrollen en komt terug bij omhoog scrollen (altijd zichtbaar bovenaan en als het menu open is).
- Inhoud verschijnt zacht (16px, 600ms, 70ms na elkaar), al vlak voordat het in beeld komt; zonder JS of met "minder beweging" staat alles direct vast.
- Foto's faden in zodra ze geladen zijn; vaste breedte/hoogte, dus niets verspringt (CLS 0).
- FAQ-antwoorden klappen vloeiend open (waar de browser dat ondersteunt).
- Horizontale fotostroken en tabs triggeren geen "terug"-veeg van de browser.

### 6.7 Mobiele belbalk
Onder 640px vast onderaan: Bellen · WhatsApp · Offerte. Houdt rekening met `safe-area-inset-bottom`.

## 7. Beeld

| Bestand | Inhoud | Gebruik |
|---|---|---|
| `hero-tuinkamer.webp` | Tuinkamer Doetinchem, opgeleverd met glazen schuifwanden | Alleen hero (preload) |
| `doetinchem/doetinchem-4.webp`, `-1.webp`, `-2.webp` | Zelfde project: casco, overkapping, gevel | Project "Tuinkamer, Doetinchem" |
| `aanbouw-voor.webp`, `aanbouw-na.webp` | Aanbouw Arnhem: fundering → gestorte vloer, op elkaar uitgelijnd | Voor/na-schuif |
| `dak/dak-1…5.webp` | Platte daken | Project "Platte daken" |
| `Arnhem-4.webp`, `amsterdam-1.webp` | Interieur in renovatie, afgewerkte gang | Project "Interieur" |
| `Arnhem-1.webp`, `Arnhem-3.webp`, `doetinchem/doetinchem-3.webp` | Bronbestanden / bijna-dubbel | Niet op de pagina |

**Elke projectfoto staat maximaal één keer op de pagina** (de projectkiezer toont geen foto's maar linkt naar het project).
`aanbouw-voor/na.webp` zijn gemaakt uit `Arnhem-1/3.webp` met een perspectiefcorrectie (OpenCV-homografie) en een gezamenlijke 4:3-uitsnede.

Regels: elke `<img>` heeft `alt`, `width`, `height`; alles onder de vouw `loading="lazy"`.
`dak/dak-3.webp` is bijgesneden (was een telefoon-screenshot met chat-interface).

## 8. Acceptatiecriteria

Automatisch (`node scripts/check-spec.mjs`):

- **AC-01** Alle ankers uit §5 bestaan als `id`.
- **AC-02** Precies één `<h1>`.
- **AC-03** `<title>` ≤ 65 tekens; meta description 120–160 tekens; canonical aanwezig.
- **AC-04** Elke `<img>` heeft `alt`, `width` en `height`; elke afbeelding bestaat op schijf.
- **AC-05** Geen emoji in de markup.
- **AC-06** Elk formulierveld heeft een `<label for>`.
- **AC-07** Alle JSON-LD is geldige JSON; FAQ-vragen in JSON-LD = zichtbare `<summary>`-teksten.
- **AC-08** CSS-tokens in `:root` = tokens uit §3; geen losse hex-kleuren in CSS buiten `:root`.
- **AC-09** Bedrijfsgegevens uit §4 komen voor en er staan geen afwijkende telefoonnummers/e-mails in de pagina.
- **AC-10** Elke interne `href="#…"` verwijst naar een bestaand `id`.
- **AC-11** Er is een `prefers-reduced-motion`-blok.
- **AC-12** Geen `:invalid`-styling die al bij laden rood toont (gebruik `:user-invalid`).
- **AC-13** Geen projectfoto dubbel op de pagina (logo uitgezonderd).
- **AC-14** Structured data volgt de Google-richtlijnen: geen `aggregateRating` (eigen/overgenomen reviews komen niet in aanmerking), geen `geo` die naar Amsterdam wijst, `areaServed` als plaatsen.

Handmatig / in browser (Playwright) bij 390, 768 en 1440 px:

- **AC-20** Geen horizontale scroll.
- **AC-21** H1 maximaal twee regels op desktop, drie op mobiel.
- **AC-22** Geen console-fouten.
- **AC-23** Zonder JavaScript is alle inhoud zichtbaar en werkt het formulier.
- **AC-24** Contrast tekst WCAG AA (navy/wit, amber-donker/wit, wit/navy).

## 9. Onderzoek (oktober 2026) — wat werkt voor een klein aannemersbedrijf

Samenvatting van drie onderzoeken (conversie, lokale SEO, concurrenten in Arnhem/Nijmegen). Volledige versie in het Project-document `claude/onderzoek-website-aanpak.md`.

Doorgevoerd in 2.1: reviewscore mét aantal en platform in de hero, korter begeleid formulier, WhatsApp met vooringevuld bericht en foto-oproep,
voor/na-foto's, schema zonder `aggregateRating`/Amsterdam-`geo`, link naar de officiële Vergunningcheck.

Nog te doen (vraagt informatie of een besluit van de eigenaar):
1. Google Bedrijfsprofiel op een Arnhems werkadres (verborgen), servicegebieden per plaats.
2. Google-reviews actief vragen na elke klus (QR/link), Werkspot als tweede.
3. Prijsindicatie op basis van eigen projecten ("aanbouw 3×4 m vanaf € …").
4. Eigenaar met naam en foto; verzekeringen en eventueel keurmerk (BouwGarant) alleen als ze echt gelden.
5. Aparte pagina's per dienst (aanbouw, renovatie, verbouwing, dak); stadspagina's alleen met echte lokale projecten.
6. Garantievoorwaarden concreet maken (materiaal én arbeid?) en eventueel betaling in termijnen noemen.

## 10. Wijzigingslog

- **2.1** — Geen dubbele foto's, voor/na-schuif aanbouw, onderzoeksadviezen doorgevoerd (zie §9).

- **2.0** — Herontwerp: projectkiezer, bouwplanning, projectgalerij met lightbox, één beloftesectie (was drie keer herhaald),
  zichtbare formulierlabels + inline verzenden, SVG i.p.v. emoji, rechte hoeken, menu-bug op desktop opgelost,
  autoplay-slideshow vervangen, fonts gesubset naar Latin (~75% kleiner), `dak-3` bijgesneden, typfout "Verbóuwen" hersteld.
- **1.x** — Eerste versie (Lighthouse 97).
