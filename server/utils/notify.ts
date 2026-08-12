import type {H3Event} from 'h3'

function parseRecipients(raw: string) {
  return raw
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function notifyStaff(
  event: H3Event,
  options: {
    subject: string
    lines: string[]
  },
) {
  const config = useRuntimeConfig(event)
  const apiKey = config.resendApiKey
  const recipients = parseRecipients(config.notifyEmail || '')

  if (!apiKey || !recipients.length) return

  const text = options.lines.join('\n')
  const html = options.lines
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')

  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        from: config.notifyFrom,
        to: recipients,
        subject: options.subject,
        text,
        html,
      },
    })
  } catch (error) {
    console.error('[notifyStaff]', error)
  }
}
