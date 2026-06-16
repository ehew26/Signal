const Anthropic = require('@anthropic-ai/sdk');

// Turns rough, messy contractor notes into the clean structured data
// the PDF template needs. This is the only "AI" step in the tool —
// everything else (math, layout, PDF drawing) is plain deterministic code.
async function parseInput(rawText, clientConfig) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Missing ANTHROPIC_API_KEY. Set it in a .env file (see .env.example) before running this tool.'
    );
  }

  const anthropic = new Anthropic({ apiKey });

  const schema = `{
  "clientName": string,
  "projectAddress": string,
  "changeOrderNumber": string,
  "items": [
    { "description": string, "quantity": number, "unit": string, "unitCost": number }
  ],
  "reason": string
}`;

  const prompt = `You convert rough, informal contractor notes (often a pasted voice-note transcript) into structured JSON for a change order.

Rules:
- Output ONLY valid JSON matching this exact shape, no markdown fences, no commentary:
${schema}
- "unit" is something like "ea", "hr", "ft", "lot", "flat fee", etc.
- If labor hours are mentioned without an explicit hourly rate, use this contractor's default labor rate of $${clientConfig.defaultLaborRatePerHour}/hr to compute unitCost, and use "hr" as the unit.
- Every dollar amount mentioned should become its own line item. Do not invent costs that aren't stated or implied by hours x rate.
- Keep descriptions short and professional (rewrite spoken language into clean line-item language).
- "reason" should be 1-3 professional sentences summarizing why the change is needed, based on the notes.
- If the client name, project address, or change order number aren't given, use reasonable placeholders like "Client Name Not Provided".

Contractor notes:
"""
${rawText}
"""`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock) {
    throw new Error('No text response from Claude API.');
  }

  let jsonText = textBlock.text.trim();
  // Strip accidental markdown fences just in case.
  jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new Error(
      `Claude's response wasn't valid JSON. Raw response:\n${jsonText}`
    );
  }

  return parsed;
}

module.exports = { parseInput };
