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

Array.from(new Set(links)).forEach(url => console.log(url))
// console.log(`Found ${links.length} programs links`)
// console.log('---- getProgramLinks script done. ----')