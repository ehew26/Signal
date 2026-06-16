# Change Order Generator

Turns rough contractor notes (bullet points or a pasted voice-note transcript)
into a clean, professional change-order PDF.

## How it works (plain language)

1. You write or paste rough notes into a text file — what changed, materials,
   labor hours, why it happened. Doesn't need to be tidy.
2. The tool sends those notes to Claude (Anthropic's AI), which converts them
   into a structured list: description, quantity, cost per item.
3. The tool does the math (subtotal, tax, total) itself — no AI involved in
   the math, so the numbers are always exact.
4. The tool draws a PDF using that client's branding (name, logo, tax rate)
   from a config file, and saves it to `output/`.

You review the PDF (and the printed JSON summary) before sending it to a client.

## One-time setup (you do this once, not per client)

1. **Install Node.js** if you don't have it: go to https://nodejs.org and
   install the "LTS" version. This lets your computer run the tool.
2. **Get an Anthropic API key** (this is what lets the tool understand rough
   notes): go to https://console.anthropic.com, create an account, and
   create an API key. This costs a small amount per use (a few cents per
   change order) — Anthropic bills you directly, not through this tool.
3. In the project's root folder, copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
   Then open `.env` in any text editor and paste your API key after the `=`
   sign. **Never share this file or commit it to git** — it's already
   excluded via `.gitignore`.
4. Install the tool's dependencies (only needed once, or after updates):
   ```
   npm install
   ```

## Setting up a new contractor client (do this once per client)

1. Copy the template config:
   ```
   cp tools/change-order-generator/clients/_template.json tools/change-order-generator/clients/<client-key>.json
   ```
   Replace `<client-key>` with something simple like `acme-construction`
   (lowercase, no spaces — this is what you'll type on the command line).
2. Open that new file and fill in: company name, address, phone, email,
   default tax rate, default labor rate, payment terms.
3. **Manual step:** put their logo file (PNG or JPG) in
   `tools/change-order-generator/logos/` and set `logoPath` in their config
   to point to it, e.g. `"../logos/acme-logo.png"`. No logo? Leave
   `logoPath` blank and the PDF will just skip the logo.

You never need to touch any code for a new client — just this one JSON file.

## Generating a change order

1. Write the contractor's rough notes into a `.txt` file. You can put
   whatever's easiest to get from the field: bullet points, or a pasted
   transcript from a voice memo app. See `sample-input.txt` for an example.
2. Run:
   ```
   node tools/change-order-generator/generate.js --client acme-construction --input tools/change-order-generator/sample-input.txt
   ```
3. The tool prints the parsed data and saves a PDF into
   `tools/change-order-generator/output/`. **Manual step:** open the PDF,
   read it over (check quantities/costs look right), then send it to the
   client yourself — this tool does not send anything automatically.

Optional: add `--output /some/path/co.pdf` to control where the PDF is saved.

## What's automated vs. what you do manually

| Automated | Manual |
|---|---|
| Turning rough notes into structured line items | Writing/pasting the rough notes |
| Math (subtotal, tax, total) | Setting up each new client's config + logo file (once) |
| PDF layout and formatting | Reviewing the PDF before sending |
| Pulling in the right branding per client | Actually sending the PDF to the client |

## Files in this folder

- `generate.js` — the command you run.
- `lib/parseInput.js` — talks to Claude to structure the rough notes.
- `lib/generatePdf.js` — draws the PDF (no AI involved, pure layout code).
- `clients/*.json` — one file per contractor client (branding + rates).
- `clients/_template.json` — copy this for each new client.
- `sample-input.txt` — an example of rough notes you can test with.
- `output/` — generated PDFs land here (not committed to git).
