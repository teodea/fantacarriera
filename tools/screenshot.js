/**
 * Rigenera gli screenshot di questa vetrina.
 *
 * Entra in produzione come OSPITE (POST /api/esplora), quindi vede la lega
 * demo: nessun nome vero di persona finisce nelle immagini. L'ospite e' una
 * identita' di sola lettura, non puo' scrivere nulla lato backend.
 *
 *   npm install
 *   npx playwright install chromium
 *   node tools/screenshot.js
 *
 * Le immagini finiscono in docs/ e sono le stesse che usa anche il profile
 * README su github.com/teodea: aggiornarle qui aggiorna tutte e due le pagine.
 */
const { chromium } = require("playwright");
const path = require("path");

const BASE = process.env.BASE ?? "https://fantacarriera.app";
const OUT = path.join(__dirname, "..", "docs");

// Solo queste finiscono nel README. La pagina Lega e lo Scouting sono
// deliberatamente fuori: la prima mostra nomi e cognomi veri quando si e'
// loggati sul serio, il secondo ha etichette di filtro che fuori contesto si
// leggono male.
const PAGINE = [
  ["dashboard", "/dashboard"],
  ["regolamento", "/lega/regolamento"],
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const stato = await page.evaluate(
    async (base) => (await fetch(`${base}/api/esplora`, { method: "POST" })).status,
    BASE,
  );
  if (stato !== 200) throw new Error(`ingresso da ospite fallito: HTTP ${stato}`);

  // Gli id della franchigia demo cambiano coi seed: si scoprono navigando.
  await page.goto(`${BASE}/franchigia`, { waitUntil: "networkidle" });
  const idFranchigia = page.url().match(/franchigia\/([^/?#]+)/)?.[1] ?? null;

  const rotte = [
    ...PAGINE,
    ...(idFranchigia ? [["rosa", `/franchigia/${idFranchigia}/rosa`]] : []),
    ...(idFranchigia ? [["finanze", `/franchigia/${idFranchigia}/finanze`]] : []),
  ];

  for (const [nome, rotta] of rotte) {
    await page.goto(`${BASE}${rotta}`, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT, `${nome}.png`) });
    console.log(`ok  ${nome.padEnd(12)} ${page.url()}`);
  }

  await browser.close();
})();
