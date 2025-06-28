import fs from 'fs'
import path from 'path'
import { parseProgramPage } from './parseProgramPage'

async function testFirstLink() {
  const all = fs.readFileSync('./s25-program-links.txt', 'utf-8')
  const links = all.split('\n').map(l => l.trim()).filter(Boolean)
  
  // 2. Grab the first URL
  const url = links[0]
  console.log('⏳ Fetching and parsing:', url)

  // 3. Parse and print
  try {
    const program = await parseProgramPage(url)
    console.log('✅ Parsed program object:')
    console.dir(program, { depth: null, colors: true })
  } catch (err) {
    console.error('❌ Error parsing page:', err)
  }
}

testFirstLink()
