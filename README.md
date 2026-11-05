# Retal K2 Theme v2

One brand theme for every Retal Nintex K2 form (broker registration, broker portal, customer journey, brochure, internal ops), built on the **RETAL BRAND 2026** guidelines. This package replaces the 13 CSS files and 10 scripts loaded today by three K2 style profiles.

## What changes for users

| Area | Before (v1) | After (v2) |
|---|---|---|
| Brand colours | 148 different hex colours, 8+ different "primary" browns | 25 tokens taken from the brand guide; primary #9E6850, charcoal #3F3F3F, beige #E6DEDB |
| Fonts | OTF/TTF files (1.35 MB) plus Plus Jakarta Sans from Google; 19 font settings | Brand fonts only, as WOFF2: SangBleu Kingdom (titles), ABC Favorit (body), 29LT Zarid Display (Arabic) |
| Corners | Mix of 4–20 px radii | Square blocks, as in the brand guide |
| Arabic | Google Translate website widget, then a script forcing right-to-left every 500 ms | K2's own translations (`_ui-culture`) with Retal-approved Arabic, plus CSS that mirrors the layout |
| Scripts | 2 page-wide MutationObservers with no throttling, 3 `setInterval` loops every 500 ms, jQuery | One observer, batched to once per frame, no jQuery |
| Validation | Red border painted by a script on every DOM change | CSS only, red border plus readable message, grey placeholder |
| Requests per page | Broker profile: 5 CSS + 3 JS from two personal GitHub accounts via `@main` | 1 CSS + 1 JS per profile, from a Retal-owned, version-pinned location |
| Images | 11 MB (one 7.4 MB PNG header) | 0.4 MB WebP (JPEG fallbacks included) |
| Mobile | Two cramped columns on phones | One column below 768 px, full-width buttons |
| K2 built-in controls | K2 base theme auto-palette: grey buttons, off-brand browns, green/blue charts, Poppins font | K2 theme variables mapped to brand tokens |
| Accessibility | No visible focus, 3.4:1 grey text | Visible focus ring, muted text 4.7:1 (WCAG AA), reduced-motion support |

## Folder

```
retal-k2-theme/
  dist/                    <- what K2 loads
    retal-broker.min.css / .min.js            (BR_LandingStyle profile)
    retal-customer-journey.min.css / .min.js  (Customer Journey Style Profile)
    retal-brochure.min.css / .min.js          (Retal Broucher Form Style)
  fonts/                   WOFF2 brand fonts (referenced as ../fonts/)
  img/                     logo SVGs (copper, white, charcoal) + optimised images (../img/)
  src/
    00-retal-tokens.css    brand tokens - the only place colours and fonts are defined
    01-retal-base.css      standard K2 controls: buttons, inputs, validation, focus, mobile
    02-retal-rtl.css       Arabic / right-to-left
    03-retal-k2-variables.css  maps ~150 K2 base-theme variables (fonts, buttons, lists, calendars, tabs, charts) to the brand; stops the Poppins download
    retal-runtime.js       replaces Global.js, BR_customComponentUI.js, Translation.js and the marker part of BR_InternalOpsPortal.js
    modules/               the v1 component CSS, refactored onto the tokens (same selectors, same layout)
  build.py                 rebuilds dist/ (needs Node + esbuild)
```

## Brand mapping

| Brand guide | Token |
|---|---|
| Primary #9E6850 (Pantone 7525 C) | `--retal-primary` / `--retal-copper-600` |
| 50% tint, 20% tint | `--retal-copper-300` #CEB4A8, `--retal-copper-100` #ECE1DC |
| Charcoal #3F3F3F (Black 7 C) | `--retal-ink` (text, dark blocks) |
| Beige #E6DEDB | `--retal-copper-200` |
| Secondary #AABCC4, #DEE2E2, #CCC47D | `--retal-sky`, `--retal-mist`, `--retal-olive` (accents only, next to a primary) |
| Title font SangBleu Kingdom | `--retal-font-display` |
| Body font ABC Favorit | `--retal-font-body` |
| Arabic 29LT Zarid Display | `--retal-font-arabic-display` (used for titles when the page is Arabic) |
| Square blocks | `--retal-radius: 0` |
| Logo wordmark | `img/retal-logo-copper.svg`, `-white.svg`, `-charcoal.svg` |

Status colours (success, warning, danger) are not in the brand guide; they are functional colours toned to sit with the palette.

## Deploy

1. **Host the files in a Retal-owned location.** Today the CSS and JS load from two developers' personal GitHub accounts (`ShivendraProinception`, `harshproinception`) on the moving `@main` branch, so any push changes production and jsDelivr can serve stale files for up to 12 hours. Use either:
   - a Retal (or ProInception company) GitHub repo, tagged, loaded as `https://cdn.jsdelivr.net/gh/<org>/retal-k2-theme@v2.0.0/dist/retal-broker.min.css`, or
   - Azure Blob Storage / Azure CDN under a Retal domain.
   Keep `dist/`, `fonts/` and `img/` side by side: the CSS loads `../fonts/` and `../img/`.
2. **Font licences.** Serving SangBleu Kingdom, ABC Favorit and 29LT Zarid from a public URL needs a web-font licence. Confirm Retal's licence covers web embedding before publishing; if not, host the fonts privately (Azure Blob with CORS limited to the K2 domain).
3. **Update the three K2 style profiles** (Management > Style Profiles). Remove every existing file and add only:

   | Style profile | CSS | JS |
   |---|---|---|
   | BR_LandingStyle | `dist/retal-broker.min.css` | `dist/retal-broker.min.js` |
   | Customer Journey Style Profile | `dist/retal-customer-journey.min.css` | `dist/retal-customer-journey.min.js` |
   | Retal Broucher Form Style | `dist/retal-brochure.min.css` | `dist/retal-brochure.min.js` |

   Also set the profile variables: `UD-Main-Accent-Color` = rgba(158, 104, 80, 1), `UD-Content-Background-Color` = rgba(246, 242, 240, 1).
4. **One base theme.** Set the five forms still on the "SharePoint 2010" base theme (BrokerRegistration_RegistrationDetails_Form, BrokerRegistration.BrokerTrackApplication.Form, CustomerJourney.AddCustomer.Form, CustomerJourney.BrokerCustomerDetails.Form, CustomerJourney.CustomerDetailsREGA.Form) to **Lithium**.
5. **Buttons.** In each view, set the Button control style: main action = *Primary*, secondary action = *Quiet*. For text links such as Cancel, add the style class `retal-btn-link`. The theme reads K2's own `button-primary` / `button-quiet` classes, so no script is needed.
6. **Remove the old scripts** pasted into views and forms as data-label expressions. The **Pasted Code** sheet in Retal_Broker_Registration_Fix_List.xlsx lists all 68 blocks in 35 items with an action each: 12 *Remove* (Google Translate, "Validation Border Red", hide-translate-bar CSS, "Test 5", a duplicate 64 KB prototype script), 11 *Keep* (signature, PDF, print, session), 45 *Move to theme* (do these after go-live).
7. **Arabic with K2 translations.**
   1. Management > Translations > Translation Settings: enable Runtime Forms, add Arabic (`ar-SA`) to Selected Languages.
   2. Forms Translations > Export. Send the file to Retal's translator. Import the approved file. Repeat after each change to the forms; packages do not carry translations between environments.
   3. If the culture code differs from `ar-SA` / `en-US`, change `CONFIG.cultures` at the top of `src/retal-runtime.js` and rebuild.
   4. Add the Arabic status texts to `STATUS` and confirm the draft Arabic copy in `RADIO_CARDS` (both in `src/retal-runtime.js`).
   The Arabic and English buttons (`btnArabic`, `btnEnglish`) reload the form with `?_ui-culture=…`; the choice is remembered in a cookie and re-applied when K2 rules navigate to the next form without the parameter. The cleaner long-term option is to pass `_ui-culture` in every K2 navigation rule.
8. **Logo.** Replace the header and footer logo images with `img/retal-logo-copper.svg` (light backgrounds) and `img/retal-logo-white.svg` (copper or charcoal backgrounds).
9. **Rollback.** Copy the three style profiles before step 3. Rolling back is re-adding the old file list.

## Check it loaded

Open any form, press F12: the Console shows `[Retal K2 Theme] v2.0.0 loaded` and `<html>` carries `data-retal-theme="2.0.0"`.

## Test checklist

The full step-by-step list with Pass/Fail columns is the **Deploy & Test** sheet in Retal_Broker_Registration_Fix_List.xlsx. Short version:

- [ ] Landing, registration (all four broker types), track application, sign-in, portal pages, ops review, brochure: compare with v1 screenshots
- [ ] Buttons: primary solid copper with white text, quiet white with copper outline, Cancel as text link
- [ ] Validation: empty required field shows red border and message; placeholder stays grey
- [ ] Keyboard: Tab shows a copper focus ring on every control
- [ ] Phone (375 px): one column, no horizontal scroll, buttons full width
- [ ] Arabic: layout mirrors, titles in Zarid, emails, phone numbers and reference numbers stay left-to-right
- [ ] Status pills show the right colour in English and Arabic
- [ ] Network tab: 1 CSS + 1 JS per page from the new host, fonts as WOFF2, no `translate.google.com`, no `raw.githubusercontent.com`

## Rebuilding

Edit files in `src/`, then run `python build.py` (needs Node; it calls `npx esbuild`). Change brand values in `src/00-retal-tokens.css` only.

## Checked so far

The broker bundle was injected into the live development registration form (Steps 1 and 2) in a browser session only, without changing K2. Layout, cards, stepper, buttons and inputs rendered correctly. Fonts were not loaded in that test because they need the hosted `fonts/` folder.
