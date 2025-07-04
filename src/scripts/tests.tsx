import axios from 'axios'
import fs from 'fs'
import { CheerioAPI, load } from 'cheerio'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
config()

export interface ProgramPatch {
  program_id: string
  programs_available: string[]
  requirements: string
}

function getTableField($: CheerioAPI, labelText: string): string {
  const labelEl = $('label').filter((_: number, el: any) => $(el).text().trim() === labelText)
  const row = labelEl.parents('tr').first()
  const widget = row.find('.widget.inline').first()
  return widget.text().trim()
}

export async function parseProgramPage(url: string): Promise<ProgramPatch> {
  const { data: html } = await axios.get(url, {
    headers: {
      // send the exact same cookie string your browser had
      Cookie: process.env.SYMP_COOKIE || ''
    }
  })
  const $ = load(html)

  const programId = new URL(url).searchParams.get('id')!

  const progText = $('.program_info .p_left .pfield.summary > p')
  .filter((_, el) => $(el).text().trim().startsWith('Programs available:'))
  .text()
  .replace(/Programs available:/i, '')
  .trim()

  const programsAvailable = progText
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  
  const requirements = getTableField($, 'What are the requirements?')

  return {
    program_id: programId,
    programs_available: programsAvailable,
    requirements,
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function main() {
  console.log('🔄 Fetching all exchangeprograms rows…')
  const { data: rows, error: fetchErr } = await supabase
    .from('exchangeprograms')
    .select('program_id, url')
  if (fetchErr) throw fetchErr
  if (!rows || rows.length === 0) {
    console.log('⚠️ No rows found in exchangeprograms.')
    return
  }

  for (const row of rows) {
    try {
      console.log(`\n✨ Processing ${row.program_id}`)
      const patch = await parseProgramPage(row.url)
      console.log('  › parsed:', patch)

      const { error: upsertErr } = await supabase
        .from('exchangeprograms')
        .upsert(patch, { onConflict: 'program_id' })

      if (upsertErr) {
        console.error(`  ❌ Failed to upsert ${row.program_id}:`, upsertErr)
      } else {
        console.log(`  ✔️ Updated ${row.program_id}`)
      }
    } catch (err) {
      console.error(`  ❌ Error on ${row.program_id}:`, err)
    }
  }

  console.log('\n✅ All done!')
  }

  main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
  })