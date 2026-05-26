import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = 'Signal <hello@signal.dating>'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://signal.dating'

// Shared theme tokens
const BG = '#ffffff'
const TEXT_PRIMARY = '#0d1f4e'
const TEXT_SECONDARY = '#4a5568'
const ACCENT = '#2563eb'
const BORDER = '#e2e8f0'

function emailWrapper(content: string) {
  return `
    <div style="background:${BG};font-family:system-ui,-apple-system,sans-serif;padding:48px 24px;max-width:600px;margin:0 auto;">
      <div style="border:1px solid ${BORDER};padding:40px;border-radius:8px;">
        <h1 style="font-family:Georgia,serif;color:${TEXT_PRIMARY};font-size:28px;margin:0 0 4px 0;">Signal</h1>
        <p style="color:${TEXT_SECONDARY};font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 40px 0;">Find Someone Real</p>
        ${content}
        <hr style="border:none;border-top:1px solid ${BORDER};margin:40px 0 24px;" />
        <p style="color:${TEXT_SECONDARY};font-size:11px;margin:0;">Signal · Sarasota-Manatee, Florida</p>
      </div>
    </div>
  `
}

function ctaButton(href: string, label: string) {
  return `<a href="${href}" style="background:${ACCENT};color:#ffffff;padding:14px 28px;text-decoration:none;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;display:inline-block;border-radius:4px;font-weight:600;">${label}</a>`
}

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to Signal — You're on the list",
    html: emailWrapper(`
      <h2 style="font-family:Georgia,serif;color:${TEXT_PRIMARY};font-size:22px;margin:0 0 16px 0;">Welcome, ${name}.</h2>
      <p style="color:${TEXT_SECONDARY};line-height:1.7;margin:0 0 16px 0;">
        Your profile is under review. Once verified, you'll receive your first five matches next Monday at 7am.
      </p>
      <p style="color:${TEXT_SECONDARY};line-height:1.7;margin:0 0 32px 0;">
        Signal is different. No swiping. No algorithms gaming your attention. Just five real people, every week, in your corner of Florida.
      </p>
      ${ctaButton(`${APP_URL}/home`, 'Complete Your Profile')}
    `),
  })
}

export async function sendDay2FollowupEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Complete your Signal profile — your matches are waiting',
    html: emailWrapper(`
      <h2 style="font-family:Georgia,serif;color:${TEXT_PRIMARY};font-size:22px;margin:0 0 16px 0;">Hey ${name}, your profile isn't quite ready yet.</h2>
      <p style="color:${TEXT_SECONDARY};line-height:1.7;margin:0 0 16px 0;">
        You're one step away from your first matches. Finish setting up your Signal profile so we can introduce you to five real people in your area this Monday.
      </p>
      <p style="color:${TEXT_SECONDARY};line-height:1.7;margin:0 0 16px 0;">
        Signal is capped at <strong style="color:${TEXT_PRIMARY};">150 founding members</strong>. Spots are going fast — a complete profile guarantees your place in the first cohort.
      </p>
      <p style="color:${TEXT_SECONDARY};line-height:1.7;margin:0 0 32px 0;">
        No swiping. No algorithms. Just five thoughtfully chosen matches delivered every Monday morning.
      </p>
      ${ctaButton(`${APP_URL}/signup`, 'Finish My Profile')}
    `),
  })
}

export async function sendMatchEmail(to: string, name: string, matches: Array<{ name: string; age: number; photo: string }>) {
  const matchCards = matches.map(m => `
    <div style="border:1px solid ${BORDER};padding:20px;margin-bottom:12px;display:flex;gap:16px;align-items:center;border-radius:6px;">
      <img src="${m.photo}" style="width:60px;height:60px;object-fit:cover;border-radius:50%;border:2px solid ${BORDER};" alt="${m.name}" />
      <div>
        <p style="margin:0;font-size:17px;color:${TEXT_PRIMARY};font-weight:600;">${m.name}, ${m.age}</p>
        <p style="margin:4px 0 0;font-size:12px;color:${TEXT_SECONDARY};">Sarasota, FL</p>
      </div>
    </div>
  `).join('')

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Your 5 matches are ready — Happy Monday',
    html: emailWrapper(`
      <h2 style="font-family:Georgia,serif;color:${TEXT_PRIMARY};font-size:22px;margin:0 0 8px 0;">Good morning, ${name}.</h2>
      <p style="color:${TEXT_SECONDARY};line-height:1.7;margin:0 0 28px 0;">Your five matches for the week are ready. You have until Sunday to send signals.</p>
      ${matchCards}
      <div style="margin-top:28px;">${ctaButton(`${APP_URL}/home`, 'View Your Matches')}</div>
    `),
  })
}

export async function sendMatchNotificationEmail(to: string, name: string, matchedName: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `You matched with ${matchedName} — Say hello`,
    html: emailWrapper(`
      <p style="color:${ACCENT};font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 12px 0;">It's a Match</p>
      <h2 style="font-family:Georgia,serif;color:${TEXT_PRIMARY};font-size:22px;margin:0 0 16px 0;">${name}, you and ${matchedName} both signaled each other.</h2>
      <p style="color:${TEXT_SECONDARY};line-height:1.7;margin:0 0 32px 0;">
        Start a conversation. The Compact asks that you respond within 72 hours — it keeps the experience good for everyone.
      </p>
      ${ctaButton(`${APP_URL}/messages`, 'Open Messages')}
    `),
  })
}

export async function sendGhostWarningEmail(to: string, name: string, warningNumber: number) {
  const remaining = 3 - warningNumber
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Warning ${warningNumber}/3 — Please respond to your match`,
    html: emailWrapper(`
      <p style="color:${ACCENT};font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 12px 0;">The Compact</p>
      <h2 style="font-family:Georgia,serif;color:${TEXT_PRIMARY};font-size:22px;margin:0 0 16px 0;">${name}, this is warning ${warningNumber} of 3.</h2>
      <p style="color:${TEXT_SECONDARY};line-height:1.7;margin:0 0 16px 0;">
        You have a match waiting for a response. Signal's Compact asks all members to respond within 72 hours.
      </p>
      <p style="color:${TEXT_SECONDARY};line-height:1.7;margin:0 0 32px 0;">
        ${remaining > 0 ? `You have ${remaining} warning${remaining === 1 ? '' : 's'} remaining before your account is suspended.` : 'This is your final warning. Your account will be suspended if you do not respond.'}
      </p>
      ${ctaButton(`${APP_URL}/messages`, 'Respond Now')}
    `),
  })
}

interface CreatorReportOptions {
  to: string
  weekStart: string
  weekEnd: string
  weekTotal: number
  monthTotal: number
  monthlyGoal: number
  ofWeek: number
  cbWeek: number
  otherWeek: number
  topContent: Array<{ title: string; platform: string; content_type: string; tips: number; likes: number; views: number; posted_date: string }>
  onlyfansUrl?: string
  chaturbateUrl?: string
}

export async function sendCreatorWeeklyReport(opts: CreatorReportOptions) {
  const {
    to, weekStart, weekEnd, weekTotal, monthTotal, monthlyGoal,
    ofWeek, cbWeek, otherWeek, topContent, onlyfansUrl, chaturbateUrl,
  } = opts

  const goalPct = Math.min(100, Math.round((monthTotal / monthlyGoal) * 100))
  const remaining = Math.max(0, monthlyGoal - monthTotal)
  const progressBar = `
    <div style="background:#e2e8f0;border-radius:4px;height:12px;margin:8px 0 4px;">
      <div style="background:#2563eb;border-radius:4px;height:12px;width:${goalPct}%;transition:width 0.3s;"></div>
    </div>
    <p style="color:#4a5568;font-size:12px;margin:0;">${goalPct}% of $${monthlyGoal.toFixed(2)} goal · $${remaining.toFixed(2)} remaining</p>
  `

  const platformRows = [
    ofWeek > 0 ? `<tr><td style="padding:8px 0;color:#0d1f4e;font-size:14px;">OnlyFans</td><td style="padding:8px 0;color:#2563eb;font-size:14px;font-weight:600;text-align:right;">$${ofWeek.toFixed(2)}</td></tr>` : '',
    cbWeek > 0 ? `<tr><td style="padding:8px 0;color:#0d1f4e;font-size:14px;">Chaturbate</td><td style="padding:8px 0;color:#2563eb;font-size:14px;font-weight:600;text-align:right;">$${cbWeek.toFixed(2)}</td></tr>` : '',
    otherWeek > 0 ? `<tr><td style="padding:8px 0;color:#0d1f4e;font-size:14px;">Other</td><td style="padding:8px 0;color:#2563eb;font-size:14px;font-weight:600;text-align:right;">$${otherWeek.toFixed(2)}</td></tr>` : '',
  ].filter(Boolean).join('')

  const contentRows = topContent.length > 0
    ? topContent.map(c => `
        <tr>
          <td style="padding:8px 0;color:#0d1f4e;font-size:13px;border-bottom:1px solid #e2e8f0;">
            <strong>${c.title}</strong><br/>
            <span style="color:#4a5568;font-size:11px;">${c.platform} · ${c.content_type} · ${c.posted_date}</span>
          </td>
          <td style="padding:8px 0;text-align:right;color:#4a5568;font-size:12px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
            ${c.tips > 0 ? `$${Number(c.tips).toFixed(2)} tips` : ''}<br/>
            ${c.likes > 0 ? `${c.likes} likes` : ''}${c.views > 0 ? ` · ${c.views} views` : ''}
          </td>
        </tr>
      `).join('')
    : '<tr><td colspan="2" style="color:#4a5568;font-size:13px;padding:8px 0;">No content logged yet.</td></tr>'

  const platformLinks = [
    onlyfansUrl ? `<a href="${onlyfansUrl}" style="color:#2563eb;text-decoration:none;font-size:13px;margin-right:16px;">→ OnlyFans</a>` : '',
    chaturbateUrl ? `<a href="${chaturbateUrl}" style="color:#2563eb;text-decoration:none;font-size:13px;">→ Chaturbate</a>` : '',
  ].filter(Boolean).join('')

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://signal.dating'

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Weekly Creator Report · ${weekStart} – ${weekEnd}`,
    html: emailWrapper(`
      <p style="color:${TEXT_SECONDARY};font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px 0;">Creator Report</p>
      <h2 style="font-family:Georgia,serif;color:${TEXT_PRIMARY};font-size:22px;margin:0 0 4px 0;">Week of ${weekStart}</h2>
      <p style="color:${TEXT_SECONDARY};font-size:13px;margin:0 0 32px 0;">${weekStart} → ${weekEnd}</p>

      <div style="display:flex;gap:16px;margin-bottom:32px;">
        <div style="flex:1;border:1px solid ${BORDER};padding:20px;border-radius:6px;">
          <p style="color:${TEXT_SECONDARY};font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 4px 0;">This Week</p>
          <p style="color:${TEXT_PRIMARY};font-size:28px;font-family:Georgia,serif;margin:0;font-weight:600;">$${weekTotal.toFixed(2)}</p>
        </div>
        <div style="flex:1;border:1px solid ${BORDER};padding:20px;border-radius:6px;">
          <p style="color:${TEXT_SECONDARY};font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 4px 0;">Month to Date</p>
          <p style="color:${ACCENT};font-size:28px;font-family:Georgia,serif;margin:0;font-weight:600;">$${monthTotal.toFixed(2)}</p>
        </div>
      </div>

      <h3 style="font-family:Georgia,serif;color:${TEXT_PRIMARY};font-size:16px;margin:0 0 8px 0;">Monthly Goal Progress</h3>
      ${progressBar}

      ${platformRows ? `
        <h3 style="font-family:Georgia,serif;color:${TEXT_PRIMARY};font-size:16px;margin:28px 0 8px 0;">This Week by Platform</h3>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid ${BORDER};">
          ${platformRows}
        </table>
      ` : ''}

      <h3 style="font-family:Georgia,serif;color:${TEXT_PRIMARY};font-size:16px;margin:28px 0 8px 0;">Top Performing Content</h3>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid ${BORDER};">
        ${contentRows}
      </table>

      ${platformLinks ? `
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid ${BORDER};">
          <p style="color:${TEXT_SECONDARY};font-size:12px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px 0;">Your Platforms</p>
          ${platformLinks}
        </div>
      ` : ''}

      <div style="margin-top:28px;">
        ${ctaButton(`${APP_URL}/creator`, 'Open Dashboard')}
      </div>
    `),
  })
}

export async function sendSuspensionEmail(to: string, name: string, permanent: boolean = false) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: permanent ? 'Your Signal account has been permanently suspended' : 'Your Signal account has been suspended for 7 days',
    html: emailWrapper(`
      <h2 style="font-family:Georgia,serif;color:${TEXT_PRIMARY};font-size:22px;margin:0 0 16px 0;">${name}, your account has been ${permanent ? 'permanently ' : ''}suspended.</h2>
      <p style="color:${TEXT_SECONDARY};line-height:1.7;margin:0 0 16px 0;">
        ${permanent
          ? 'After multiple violations of the Signal Compact, your account has been permanently removed from the platform.'
          : 'Due to repeated non-responses to your matches, your account has been suspended for 7 days. You will regain access automatically after this period.'}
      </p>
      <p style="color:${TEXT_SECONDARY};line-height:1.7;margin:0;">
        Signal exists to create genuine connections. The Compact — responding to your matches within 72 hours — is fundamental to that experience.
      </p>
    `),
  })
}
