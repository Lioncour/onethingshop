# FLOKROLL PROJECTS — visuell identitet «Verksted»

Dette er den bindende visuelle spesifikasjonen for alt Flokroll Projects publiserer.
Legg denne filen i repoet (`/FLOKROLL-IDENTITY.md`) og referer til den i hver oppgave.

---

## 0. Prompt du limer inn i Cursor

> Les `FLOKROLL-IDENTITY.md`. Den er bindende — ikke innfør farger, fonter, spacing,
> radius eller skygger som ikke står der.
>
> Bygg en nettside for Flokroll Projects: `/` (forside), `/prosjekter`,
> `/prosjekter/[slug]`, `/om`. Stack: [Next.js + Tailwind / Astro / vanilla —
> velg din].
>
> Steg 1: sett opp design-tokens fra kapittel 2 og 3, `Roll`-komponenten fra
> kapittel 4, og `Deviation`-wrapperen fra kapittel 5. Vis meg dem på en
> `/styleguide`-rute før du bygger sidene.
>
> Steg 2: bygg sidene med komponentene fra kapittel 7. Innhold fra
> `content/projects/*.md` — ikke lorem ipsum, bruk mine faktiske prosjekter.
>
> Regler du ikke bryter: `border-radius: 0` overalt bortsett fra Roll.
> Ingen `box-shadow`. Ingen gradient bortsett fra Roll. Ingen fjerde font.
> Alle avstander er multipler av 8px.
>
> Etter hvert steg: list opp hva du valgte og hvorfor, og vent på godkjenning.

---

## 1. Prinsipper

1. **Alt har etikett.** Prosjektnummer, dato, status, materiale — i monospace, versaler, sperret.
2. **Kant, ikke skygge.** Dybde lages med 1px linjer og flate-på-flate. Aldri blur.
3. **Vis prosessen.** Feilene og de halvferdige forsøkene er innhold, ikke skam.
4. **Rullen er det myke.** Logoen er systemets eneste runde, lyssatte objekt. Alt annet er skarpt.

---

## 2. Farger

```css
:root {
  --fp-bone:   #F4F1EC; /* 60% — all bakgrunn */
  --fp-ink:    #141414; /* 25% — tekst, kanter, mørke flater */
  --fp-salmon: #FF7A5C; /* 10% — signal */
  --fp-shell:  #FFD5C7; /* rolige flater, bildeplassholdere */
  --fp-pine:   #3D5A45; /*  5% — status «ferdig», suksess */
  --fp-stone:  #8A8378; /* etiketter, sekundærtekst */
  --fp-body:   #2C2822; /* brødtekst på bone */
  --fp-muted:  #4A453D; /* dempet tekst på bone */
  --fp-hair:   #E0DAD1; /* hårstrek-skiller */
  --fp-danger: #C1462A; /* feil, «ikke gjør» */
}
```

**Regler**

- Laks er en **flate eller en strek**, aldri tekstfarge på bone (1,9:1 kontrast). Sett `--fp-ink`-tekst PÅ laks i stedet. Unntak: display-tekst over 48px på ink-bakgrunn.
- Maks to bakgrunnsfarger per flate: bone+ink eller bone+shell. Laks og gran kun i små doser oppå.
- Ingen gradienter. Eneste unntak er Roll-gradienten (kapittel 4).
- Lenker: `--fp-danger` på lys bakgrunn, `--fp-pine` på mørk, understrek med `text-underline-offset: 2px`.

---

## 3. Typografi

Tre fonter, aldri en fjerde.

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

```css
:root {
  --fp-display: 'Archivo Black', sans-serif;  /* display + titler, alltid VERSALER */
  --fp-sans:    'Archivo', sans-serif;        /* brødtekst */
  --fp-mono:    'IBM Plex Mono', monospace;   /* etiketter, tall, data, kode */
}
```

| Nivå | Font | Størrelse | line-height | letter-spacing | Notat |
|---|---|---|---|---|---|
| Display | Archivo Black | 72–132px (clamp) | 0.84 | −0.035em | versaler |
| Tittel | Archivo Black | 28–40px | 0.95 | −0.02em | versaler |
| Brødtekst | Archivo 400 | 16–19px | 1.6 | 0 | 60–70 tegn per linje |
| Etikett | IBM Plex Mono 500 | 10–13px | 1.4 | +0.14em | VERSALER |
| Data | IBM Plex Mono 500 | 14–20px | 1.4 | 0 | `font-variant-numeric: tabular-nums` |

- Archivo Black brukes **aldri** under 14px.
- Alt er venstrestilt. Ingen sentrerte tekstblokker.
- `text-wrap: pretty` på brødtekst, `text-wrap: balance` på titler.

---

## 4. Logoen — Rullen

En oppkveilet plate sett rett inn i enden. Sømmen tegnes **ikke** — den oppstår der lys møter mørke i den koniske gradienten.

```css
.fp-roll {
  border-radius: 50%;
  aspect-ratio: 1;
  background:
    radial-gradient(circle at 50% 50%,
      rgba(20,20,20,0.30) 0%, rgba(20,20,20,0.08) 24%, rgba(20,20,20,0) 58%),
    conic-gradient(from 0.4deg,
      #FFE6D6 0deg, #FFC7AC 58deg, #F99674 138deg, #E9714C 218deg,
      #C55130 296deg, #9C3A1F 350deg, #8A2F18 359.6deg);
}

/* flate varianter — uten lys må sømmen tegnes inn */
.fp-roll--flat        { background: var(--fp-salmon); position: relative; overflow: hidden; }
.fp-roll--flat::after { content: ""; position: absolute; left: 50%; top: 0;
                        width: 2px; height: 50%; background: var(--fp-ink);
                        transform: translateX(-1px); }
```

**Varianter, i prioritetsrekkefølge**

| Variant | Bruk |
|---|---|
| `kveilet` (gradient) | Primær. Skjerm, video, web. |
| `delt` (to harde felt) | Kun kanalgrafikk for video og sosialt. |
| `flat laks` | Trykk i to farger. |
| `flat ink` | Faks, kvittering, gravering. |
| `flat bone` | På ink-bakgrunn eller foto. |
| `kontur` | Kun som avvik-ekko (kapittel 5). |

**Geometri**

- Lysskiftet står alltid kl. 12. Gradienten roteres aldri.
- Frisone: 0,25 × diameter på alle sider.
- Under 32px: bytt til flat variant.
- Ordmerket: rullens diameter = høyden på «FLOKROLL» + «PROJECTS» til sammen. Avstand rull→tekst = ¼ diameter. Alltid venstrestilt mot rullen.

**Misbruk:** ikke strekk, ikke bytt farge, ingen skygge, ikke roter.

---

## 5. Signaturen — Avviket

Det eiebare grepet. Alt viktig har et **laksefarget ekko av seg selv, forskjøvet 4px ned og til høyre** — tegningen som ligger igjen under den ferdige delen.

```css
.fp-dev { position: relative; display: inline-block; }
.fp-dev__ghost {
  position: absolute; inset: 0;
  transform: translate(4px, 4px);
  color: var(--fp-salmon);
  z-index: 0;
  pointer-events: none;
  user-select: none;
}
.fp-dev__real { position: relative; z-index: 1; }
```

```jsx
// Wrapper: rendrer barnet to ganger, ekkoet bak
export function Deviation({ children, as: Tag = "span" }) {
  return (
    <Tag className="fp-dev">
      <span className="fp-dev__ghost" aria-hidden="true">{children}</span>
      <span className="fp-dev__real">{children}</span>
    </Tag>
  );
}
```

**Knappen** — hover snapper delen ned på tegningen:

```css
.fp-btn { position: relative; display: inline-block; }
.fp-btn::before {
  content: ""; position: absolute; inset: 0;
  transform: translate(6px, 6px);
  background: var(--fp-salmon);
}
.fp-btn > span {
  position: relative; display: block;
  background: var(--fp-ink); color: var(--fp-bone);
  padding: 11px 18px;
  font: 500 12px/1 var(--fp-mono);
  letter-spacing: 0.08em; text-transform: uppercase;
  transition: transform 90ms linear;   /* lineær, ikke ease — mekanisk */
}
.fp-btn:hover > span { transform: translate(6px, 6px); }
```

**Disiplin:** ett avvik per skjermflate — den viktigste tittelen ELLER det viktigste bildet, ikke begge. Ekkoet ligger alltid bak. Aldri på brødtekst. Aldri blur eller opacity — det er en heldekket flate, ikke en skygge.

**Avvikstallet:** hvert prosjekt oppgir sitt eget ekte avvik som etikett — `± 0,2 mm`, `3. forsøk`, `− 40 %`.

---

## 6. Rutenett, kant, bevegelse

```css
:root {
  --fp-space: 8px;         /* alle avstander er multipler av denne */
  --fp-gutter-desktop: 72px;
  --fp-gutter-mobile: 24px;
  --fp-radius: 0;          /* overalt, uten unntak bortsett fra Roll */
  --fp-hairline: 1px solid var(--fp-ink);
  --fp-weight: 3px solid var(--fp-ink);   /* uthevet kant */
  --fp-draft: 1px dashed var(--fp-stone); /* stiplet = utkast/idé */
}
```

- 12-kolonners grid, 8px baseline. Ingenting flyter fritt — alt låses til kolonner.
- `box-shadow: none` overalt. `filter: blur()` finnes ikke i dette systemet.
- Seksjonsskiller: `border-bottom: 1px solid var(--fp-ink)` på full bredde.
- Rutenettceller separeres med 1px: bruk `gap: 1px; background: var(--fp-ink)` på griden og ugjennomsiktig bakgrunn på cellene.
- Bevegelse: 90–160ms, `linear` eller `steps()`. Ingen ease-in-out, ingen spring, ingen fade-in-on-scroll.
- Fokus: `border-bottom: 3px solid var(--fp-salmon)` — aldri en glow-ring.

---

## 7. Komponenter siden trenger

| Komponent | Spesifikasjon |
|---|---|
| `Roll` | props: `variant`, `size`. Kapittel 4. |
| `Deviation` | wrapper med laks-ekko. Kapittel 5. |
| `Header` | Roll 24px + «FLOKROLL» (Archivo Black 15px) + mono-nav i versaler. 1px underkant. |
| `Hero` | Display-tittel med `Deviation` på ett ord, laks-highlight som `background` på ett annet. |
| `ProjectCard` | 4:3 bildeflate i shell med 1px underkant → mono-metarad (`PROSJEKT 014` / status i gran) → Archivo Black-tittel → brødtekst. |
| `SpecTable` | mono, `justify-content: space-between` per rad, `1px dashed var(--fp-hair)` mellom radene, tabular-nums. |
| `Tag` | rektangulær, aldri pille. mono 11px versaler. Ferdig=gran, Pågår=laks, Idé=stiplet stone. |
| `Button` | primær=ink, sekundær=1px kant, signal=laks. Kapittel 5 for hover. |
| `Input` | 1px ink kant, mono 13px, fokus = 3px laks i underkant. |
| `Footer` | 3px overkant, flat ink Roll 22px + mono-stempel: `FLOKROLL PROJECTS — VERKSTED V1.0`. |

---

## 8. Gjør / ikke gjør

**Gjør**

- Sett tekst PÅ laksflater, i svart.
- Merk alt: prosjektnummer, status, dato, materiale, avvik.
- Mono for tall og korte avsnitt, Archivo for lange.
- La bilder gå helt ut i kanten av sin celle.
- Vis feilene — halvferdig er innhold.

**Ikke gjør**

- Ikke skriv laksefarget tekst på bone.
- Ingen avrundede hjørner, skygger eller glow (Roll er eneste unntak, og den får aldri skygge).
- Ikke bland inn en fjerde font eller en ny aksentfarge.
- Ikke sentrer lange tekster.
- Ikke bruk Archivo Black under 14px.
- Ikke bruk to avvik-ekkoer på samme flate.

---

## 9. Innholdsformat

```yaml
# content/projects/014-brakett.md
number: 014          # løpende, aldri gjenbrukt
title: Brakett i aluminium
status: ferdig       # idé | pågår | ferdig
deviation: "± 0,2 mm"
year: 2026
spec:
  Materiale: Aluminium 6082-T6
  Prosess: CNC + TIG
  Vekt: 412 g
  Opplag: 50 stk
attempts: 3
```

Prosjektnummeret er én løpende serie for **alt** du publiserer — video, produkt, verktøy, notat.
