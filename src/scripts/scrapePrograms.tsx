import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { parseProgramPage, Program } from './parseProgramPage'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function scrapePrograms() {
    
    const content = fs.readFileSync('./s25-program-links.txt', 'utf-8')
    const links = content.split('\n').map(l => l.trim()).filter(Boolean)

    for (const url of links) {
        try {
            // console.log(`Fetching: ${url}`)
            const program: Program = await parseProgramPage(url)

            // upsert by id to update existing entries
            const { error } = await supabase
            .from('exchangeprograms')
            .upsert(program, { onConflict: 'program_id' })

            if (error) console.log(`Error upserting ${program.program_id}:`, error)
            else console.log(`Upserted program ${program.program_id}`)
        } catch (e: any) {
            console.error(`Failed to parse ${url}: `, e.message)
        }
    }
}

scrapePrograms().catch(console.error)