#!/usr/bin/env node

/**
 * Cron script — Publish Scheduled Blog Posts
 *
 * Runs every 5 minutes via crontab on the VPS.
 * Calls POST /api/publish-scheduled to publish any posts
 * whose scheduled_at <= NOW() and status = 'scheduled'.
 *
 * Crontab entry:
 *   * /5 * * * * node /path/to/scripts/publish-scheduled.js >> /var/log/cron-blog.log 2>&1
 */

const path = require('path')
const fs = require('fs')

// Load .env from app root (one level up from scripts/)
require('dotenv').config({ path: path.join(__dirname, '../.env') })

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

const LOG_FILE = path.join(logsDir, 'cron.log')

function log(message) {
  const timestamp = new Date().toISOString()
  const line = `[${timestamp}] ${message}\n`
  process.stdout.write(line)
  try {
    fs.appendFileSync(LOG_FILE, line)
  } catch (err) {
    process.stderr.write(`[LOG ERROR] Could not write to log file: ${err.message}\n`)
  }
}

async function main() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const cronSecret = process.env.CRON_SECRET

  if (!siteUrl) {
    log('ERROR: NEXT_PUBLIC_SITE_URL is not set')
    process.exit(1)
  }

  if (!cronSecret) {
    log('ERROR: CRON_SECRET is not set')
    process.exit(1)
  }

  const endpoint = `${siteUrl}/api/publish-scheduled`

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 401) {
      log('ERROR: Unauthorized — check CRON_SECRET value')
      process.exit(1)
    }

    if (!response.ok) {
      const text = await response.text()
      log(`ERROR: HTTP ${response.status} — ${text}`)
      process.exit(1)
    }

    const result = await response.json()

    if (result.published > 0) {
      log(`Published ${result.published} post(s): ${result.posts.join(', ')}`)
    } else {
      log('No posts to publish.')
    }
  } catch (err) {
    log(`ERROR: ${err.message}`)
    process.exit(1)
  }
}

main()
