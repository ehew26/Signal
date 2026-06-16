#!/usr/bin/env node
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const fs = require('fs');
const path = require('path');
const { parseInput } = require('./lib/parseInput');
const { generateChangeOrderPdf } = require('./lib/generatePdf');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    args[key] = argv[i + 1];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.client || !args.input) {
    console.error(
      'Usage: node generate.js --client <client-key> --input <path-to-notes.txt> [--output <path-to-output.pdf>]'
    );
    console.error(
      'Example: node generate.js --client acme-construction --input sample-input.txt'
    );
    process.exit(1);
  }

  const clientConfigPath = path.join(__dirname, 'clients', `${args.client}.json`);
  if (!fs.existsSync(clientConfigPath)) {
    console.error(`No client config found at ${clientConfigPath}`);
    console.error(
      `Copy clients/_template.json to clients/${args.client}.json and fill in their info.`
    );
    process.exit(1);
  }
  const clientConfig = JSON.parse(fs.readFileSync(clientConfigPath, 'utf8'));

  if (!fs.existsSync(args.input)) {
    console.error(`Input file not found: ${args.input}`);
    process.exit(1);
  }
  const rawText = fs.readFileSync(args.input, 'utf8');

  console.log('Reading notes and asking Claude to structure the change order...');
  const data = await parseInput(rawText, clientConfig);

  const outputPath =
    args.output ||
    path.join(
      __dirname,
      'output',
      `change-order-${args.client}-${data.changeOrderNumber || Date.now()}.pdf`
    );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const totals = generateChangeOrderPdf({
    clientConfig,
    data,
    outputPath,
    configDir: path.join(__dirname, 'clients'),
  });

  console.log('\nChange order created:');
  console.log(`  File: ${outputPath}`);
  console.log(`  Client: ${data.clientName}`);
  console.log(`  Items: ${data.items.length}`);
  console.log(`  Subtotal: $${totals.subtotal.toFixed(2)}`);
  console.log(`  Tax: $${totals.tax.toFixed(2)}`);
  console.log(`  Grand Total: $${totals.grandTotal.toFixed(2)}`);
  console.log('\nReview the parsed data below before sending to the client:');
  console.log(JSON.stringify(data, null, 2));
}

main().catch((err) => {
  console.error('\nError:', err.message);
  process.exit(1);
});
