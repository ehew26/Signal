import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = 'Signal <hello@signal.dating>'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://signal.dating'

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Welcome to Signal — You\'re on the list',
    html: `
      <div style="background:#0c0a07;color:#f4ede3;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#2563eb;font-size:32px;margin-bottom:8px;">Signal</h1>
        <p style="color:#a89b8c;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:40px;">Find Someone Real</p>
        <h2 style="font-size:24px;margin-bottom:16px;">Welcome, ${name}.</h2>
        <p style="color:#a89b8c;line-height:1.7;margin-bottom:24px;">
          Your profile is under review. Once verified, you'll receive your first five matches next Monday at 7am.
        </p>
        <p style="color:#a89b8c;line-height:1.7;margin-bottom:40px;">
          Signal is different. No swiping. No algorithms gaming your attention. Just five real people, every week, in your corner of Florida.
        </p>
        <a href="${APP_URL}/home" style="background:#2563eb;color:#f4ede3;padding:16px 32px;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;display:inline-block;">
          Complete Your Profile
        </a>
        <p style="color:#2a2520;font-size:12px;margin-top:60px;">Signal · Sarasota-Manatee, Florida</p>
      </div>
    `,
  })
}

export async function sendMatchEmail(to: string, name: string, matches: Array<{ name: string; age: number; photo: string }>) {
  const matchCards = matches.map(m => `
    <div style="border:1px solid #2a2520;padding:20px;margin-bottom:16px;display:flex;gap:16px;align-items:center;">
      <img src="${m.photo}" style="width:60px;height:60px;object-fit:cover;" alt="${m.name}" />
      <div>
        <p style="margin:0;font-size:18px;color:#f4ede3;">${m.name}, ${m.age}</p>
        <p style="margin:4px 0 0;font-size:12px;color:#a89b8c;">Sarasota, FL</p>
      </div>
    </div>
  `).join('')

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Your 5 matches are ready — Happy Monday',
    html: `
      <div style="background:#0c0a07;color:#f4ede3;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#2563eb;font-size:32px;margin-bottom:8px;">Signal</h1>
        <p style="color:#a89b8c;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:40px;">Monday Drop</p>
        <h2 style="font-size:24px;margin-bottom:8px;">Good morning, ${name}.</h2>
        <p style="color:#a89b8c;line-height:1.7;margin-bottom:32px;">Your five matches for the week are ready. You have until Sunday to send signals.</p>
        ${matchCards}
        <a href="${APP_URL}/home" style="background:#2563eb;color:#f4ede3;padding:16px 32px;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;display:inline-block;margin-top:24px;">
          View Your Matches
        </a>
      </div>
    `,
  })
}

export async function sendMatchNotificationEmail(to: string, name: string, matchedName: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `You matched with ${matchedName} — Say hello`,
    html: `
      <div style="background:#0c0a07;color:#f4ede3;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#2563eb;font-size:32px;margin-bottom:8px;">Signal</h1>
        <p style="color:#a89b8c;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:40px;">It's a Match</p>
        <h2 style="font-size:24px;margin-bottom:16px;">${name}, you and ${matchedName} both signaled each other.</h2>
        <p style="color:#a89b8c;line-height:1.7;margin-bottom:32px;">
          Start a conversation. The Compact asks that you respond within 72 hours — it keeps the experience good for everyone.
        </p>
        <a href="${APP_URL}/messages" style="background:#2563eb;color:#f4ede3;padding:16px 32px;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;display:inline-block;">
          Open Messages
        </a>
      </div>
    `,
  })
}

export async function sendGhostWarningEmail(to: string, name: string, warningNumber: number) {
  const remaining = 3 - warningNumber
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Warning ${warningNumber}/3 — Please respond to your match`,
    html: `
      <div style="background:#0c0a07;color:#f4ede3;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#2563eb;font-size:32px;margin-bottom:8px;">Signal</h1>
        <p style="color:#a89b8c;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;margin-bottom:40px;">The Compact</p>
        <h2 style="font-size:24px;margin-bottom:16px;">${name}, this is warning ${warningNumber} of 3.</h2>
        <p style="color:#a89b8c;line-height:1.7;margin-bottom:24px;">
          You have a match waiting for a response. Signal's Compact asks all members to respond within 72 hours.
        </p>
        <p style="color:#a89b8c;line-height:1.7;margin-bottom:32px;">
          ${remaining > 0 ? `You have ${remaining} warning${remaining === 1 ? '' : 's'} remaining before your account is suspended.` : 'This is your final warning. Your account will be suspended if you do not respond.'}
        </p>
        <a href="${APP_URL}/messages" style="background:#2563eb;color:#f4ede3;padding:16px 32px;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;display:inline-block;">
          Respond Now
        </a>
      </div>
    `,
  })
}

export async function sendSuspensionEmail(to: string, name: string, permanent: boolean = false) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: permanent ? 'Your Signal account has been permanently suspended' : 'Your Signal account has been suspended for 7 days',
    html: `
      <div style="background:#0c0a07;color:#f4ede3;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#2563eb;font-size:32px;margin-bottom:8px;">Signal</h1>
        <h2 style="font-size:24px;margin-bottom:16px;">${name}, your account has been ${permanent ? 'permanently ' : ''}suspended.</h2>
        <p style="color:#a89b8c;line-height:1.7;margin-bottom:24px;">
          ${permanent
            ? 'After multiple violations of the Signal Compact, your account has been permanently removed from the platform.'
            : 'Due to repeated non-responses to your matches, your account has been suspended for 7 days. You will regain access automatically after this period.'}
        </p>
        <p style="color:#a89b8c;line-height:1.7;">
          Signal exists to create genuine connections. The Compact — responding to your matches within 72 hours — is fundamental to that experience.
        </p>
      </div>
    `,
  })
}
