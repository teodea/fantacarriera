# Manutenzione della vetrina

Questa cartella non fa parte della vetrina: serve a tenerla vera.

Le pagine da tenere allineate sono due, e condividono le immagini:

- questo README (`teodea/fantacarriera`)
- il profile README (`teodea/teodea`), che linka le immagini da `docs/` di qui

Aggiornare una foto in `docs/` aggiorna quindi tutte e due.

## Rifare gli screenshot

```bash
npm install
npx playwright install chromium
node tools/screenshot.js
```

Entra da ospite in produzione e rigenera `docs/*.png` dalla lega demo.

## Cosa scade, e come si rilegge

Non c'è una scadenza a calendario: questi valori si ricontrollano quando
succede la cosa che li cambia.

| Valore | Innesco | Come si rilegge |
|---|---|---|
| numero di presidenti e di franchigie | un presidente entra o esce, di solito al passaggio di stagione | si contano su `/lega` in app, oppure `franchigie` su Firestore |
| capitoli del regolamento | il regolamento viene emendato per voto | `grep -cE "^## Capitolo [0-9]+" documenti-per-regolamento/regolamento/regolamento.md` |
| versione di Next.js citata | un major | `grep '"next"' fantacalcio-manageriale-webapp/package.json` |
| commit, righe, test, ADR | crescono da soli, non diventano mai falsi | `git rev-list --count HEAD` nei due repo; `ls planning/adr/*.md \| wc -l` |
| gli screenshot | la UI cambia in modo visibile | `node tools/screenshot.js` |

I numeri di scala nel README sono **timbrati con la data**: sono una
fotografia, non una promessa. Finché la data c'è, invecchiano senza mentire.
Quelli che possono solo crescere sono scritti al ribasso di proposito
(«oltre mille», «quasi settanta»), così restano veri senza toccarli.
