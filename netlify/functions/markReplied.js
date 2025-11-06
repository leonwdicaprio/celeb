/* ========= markReplied.js ========= */
// production-ready Netlify Function / server route

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nnuvrnztrfmipnwbnbzn.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5udXZybnp0cmZtaXBud2JuYnpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTY5NDUsImV4cCI6MjA3NzkzMjk0NX0.WCPq3ZeUu3fiEEEbWkAIuQfz6Ka428zud7qMIc4hHds'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function handler(event) {
  try {
    const { id, type } = JSON.parse(event.body)
    if (!id || !type) {
      return { statusCode: 400, body: 'Missing id or type' }
    }

    const tableMap = {
      contact: 'contact_submissions',
      donation: 'donation_submissions',
      application: 'job_applications',
      newsletter: 'newsletter_subscriptions'
    }
    const table = tableMap[type]
    if (!table) {
      return { statusCode: 400, body: 'Invalid submission type' }
    }

    const { error } = await supabase
      .from(table)
      .update({ replied: true })
      .eq('id', id)

    if (error) throw error

    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}