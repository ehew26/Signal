const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function money(amount, symbol) {
  return `${symbol}${amount.toFixed(2)}`;
}

// Draws the change-order PDF. All layout logic lives here so the
// branding (clients/*.json) and content (parsed change order data)
// stay separate from how the page is drawn.
function generateChangeOrderPdf({ clientConfig, data, outputPath, configDir }) {
  const symbol = clientConfig.currencySymbol || '$';
  const taxRate = (clientConfig.defaultTaxRatePercent || 0) / 100;

  const subtotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0
  );
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + tax;

  const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  // --- Header: logo + company info ---
  const logoPath = clientConfig.logoPath
    ? path.resolve(configDir, clientConfig.logoPath)
    : null;
  let headerTextX = 50;
  if (logoPath && fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { fit: [100, 60] });
    headerTextX = 165;
  }

  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(clientConfig.companyName, headerTextX, 50);
  doc
    .fontSize(9)
    .font('Helvetica')
    .text(clientConfig.address || '', headerTextX, 70)
    .text(
      [clientConfig.phone, clientConfig.email].filter(Boolean).join('  |  '),
      headerTextX,
      83
    );

  doc.moveDown(3);
  doc.moveTo(50, 120).lineTo(562, 120).strokeColor('#cccccc').stroke();

  // --- Title ---
  doc
    .fontSize(20)
    .font('Helvetica-Bold')
    .fillColor('#000000')
    .text('CHANGE ORDER', 50, 135);

  // --- Client / project / CO meta info ---
  const metaTop = 165;
  doc.fontSize(10).font('Helvetica-Bold').text('Client:', 50, metaTop);
  doc.font('Helvetica').text(data.clientName, 110, metaTop);

  doc.font('Helvetica-Bold').text('Project Address:', 50, metaTop + 16);
  doc.font('Helvetica').text(data.projectAddress, 150, metaTop + 16);

  doc.font('Helvetica-Bold').text('Change Order #:', 380, metaTop);
  doc.font('Helvetica').text(String(data.changeOrderNumber), 480, metaTop);

  doc.font('Helvetica-Bold').text('Date:', 380, metaTop + 16);
  doc
    .font('Helvetica')
    .text(new Date().toLocaleDateString('en-US'), 480, metaTop + 16);

  // --- Itemized table ---
  let y = metaTop + 50;
  doc.moveTo(50, y).lineTo(562, y).strokeColor('#000000').stroke();
  y += 8;

  doc.fontSize(10).font('Helvetica-Bold');
  doc.text('Description', 50, y);
  doc.text('Qty', 320, y, { width: 40, align: 'right' });
  doc.text('Unit', 365, y, { width: 50, align: 'right' });
  doc.text('Unit Cost', 420, y, { width: 60, align: 'right' });
  doc.text('Line Total', 485, y, { width: 77, align: 'right' });
  y += 16;
  doc.moveTo(50, y).lineTo(562, y).strokeColor('#cccccc').stroke();
  y += 8;

  doc.font('Helvetica').fontSize(10);
  for (const item of data.items) {
    const lineTotal = item.quantity * item.unitCost;
    const rowHeight = doc.heightOfString(item.description, { width: 260 }) + 6;

    doc.text(item.description, 50, y, { width: 260 });
    doc.text(String(item.quantity), 320, y, { width: 40, align: 'right' });
    doc.text(item.unit, 365, y, { width: 50, align: 'right' });
    doc.text(money(item.unitCost, symbol), 420, y, { width: 60, align: 'right' });
    doc.text(money(lineTotal, symbol), 485, y, { width: 77, align: 'right' });

    y += rowHeight;
    if (y > 680) {
      doc.addPage();
      y = 50;
    }
  }

  y += 6;
  doc.moveTo(50, y).lineTo(562, y).strokeColor('#000000').stroke();
  y += 12;

  // --- Totals ---
  const totalsX = 420;
  doc.font('Helvetica').text('Subtotal:', totalsX, y, { width: 60, align: 'right' });
  doc.text(money(subtotal, symbol), 485, y, { width: 77, align: 'right' });
  y += 16;

  doc.text(
    `Tax (${clientConfig.defaultTaxRatePercent || 0}%):`,
    totalsX,
    y,
    { width: 60, align: 'right' }
  );
  doc.text(money(tax, symbol), 485, y, { width: 77, align: 'right' });
  y += 16;

  doc.font('Helvetica-Bold');
  doc.text('Grand Total:', totalsX, y, { width: 60, align: 'right' });
  doc.text(money(grandTotal, symbol), 485, y, { width: 77, align: 'right' });
  y += 30;

  // --- Reason for change ---
  doc.font('Helvetica-Bold').fontSize(11).text('Reason for Change', 50, y);
  y += 16;
  doc.font('Helvetica').fontSize(10).text(data.reason, 50, y, { width: 512 });
  y += doc.heightOfString(data.reason, { width: 512 }) + 30;

  if (y > 680) {
    doc.addPage();
    y = 50;
  }

  // --- Signature block ---
  doc.moveTo(50, y).lineTo(250, y).strokeColor('#000000').stroke();
  doc.moveTo(330, y).lineTo(480, y).stroke();
  y += 6;
  doc.fontSize(9).font('Helvetica').text('Client Signature', 50, y);
  doc.text('Date', 330, y);
  y += 30;
  doc.fontSize(8).fillColor('#666666').text(
    'By signing above, the client approves this change order and the associated cost adjustment to the original contract.',
    50,
    y,
    { width: 512 }
  );

  doc.end();

  return { subtotal, tax, grandTotal };
}

module.exports = { generateChangeOrderPdf };
