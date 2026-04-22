import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
})

const fromEmail = process.env.BREVO_EMAIL_FROM || 'noreply@birdiefund.com'
const fromName = process.env.BREVO_EMAIL_FROM_NAME || 'Birdie Fund'

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  return transporter.sendMail({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    html,
  })
}

export function getWelcomeEmailHtml(name?: string): string {
  const displayName = name || 'there'
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background: #0A0A0F; color: #F0EEE9; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #00C896; }
        .button { background: #00C896; color: #0A0A0F; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Birdie Fund, ${displayName}!</h1>
        <p>You're now part of something amazing — a community that plays golf, wins prizes, and supports charity.</p>
        <p>Ready to start? Enter your first score and get in the draw!</p>
        <a href="#" class="button">Enter Your Score</a>
      </div>
    </body>
    </html>
  `
}

export function getDrawResultsEmailHtml(
  userName: string,
  drawnNumbers: number[],
  matchCount: number,
  prizeAmount?: number
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background: #0A0A0F; color: #F0EEE9; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #00C896; }
        .numbers { display: flex; gap: 10px; margin: 20px 0; }
        .number { background: #1A1A1F; padding: 15px 20px; border-radius: 50%; border: 2px solid #00C896; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Draw Results — ${matchCount} Match${matchCount !== 1 ? 'es' : ''}!</h1>
        <p>Hi ${userName}, here are this month's results:</p>
        <div class="numbers">
          ${drawnNumbers.map(n => `<span class="number">${n}</span>`).join('')}
        </div>
        <p>You matched ${matchCount} number${matchCount !== 1 ? 's' : ''}!</p>
        ${prizeAmount ? `<p><strong>Prize: £${prizeAmount.toFixed(2)}</strong></p>` : ''}
      </div>
    </body>
    </html>
  `
}

export function getWinnerEmailHtml(userName: string, prizeAmount: number, matchType: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background: #0A0A0F; color: #F0EEE9; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { color: #F5A623; }
        .prize { font-size: 48px; color: #00C896; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎉 Congratulations, ${userName}!</h1>
        <p>You've won with a ${matchType}!</p>
        <div class="prize">£${prizeAmount.toFixed(2)}</div>
        <p>Upload your proof of play on your dashboard to claim your prize.</p>
      </div>
    </body>
    </html>
  `
}