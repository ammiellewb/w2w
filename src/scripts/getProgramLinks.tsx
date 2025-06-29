import path from 'path'
import { load } from 'cheerio'
import fs from 'fs'

const html = fs.readFileSync('../../S25_Waterloo_Passport_Search_Programs.html', 'utf-8')

// console.log('---- getProgramLinks script starting… ----')

const $ = load(html)

const base = 'https://uwaterloo-horizons.symplicity.com'

const links = $('td.lst-cl-p_name a')
  .map((_, el) => {
    const href = $(el).attr('href')!
    return new URL(href, base).href
  })
  .get()

fs.writeFileSync('s25-program-links.txt', Array.from(new Set(links)).join('\n'))
// console.log(`Found ${links.length} programs links`)
// console.log('---- getProgramLinks script done. ----')