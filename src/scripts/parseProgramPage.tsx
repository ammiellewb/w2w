import axios from 'axios'
import { load, CheerioAPI } from 'cheerio'

export interface Program {
  name: string
  university: string
  type: string
  duration: string
  location: string
  likeliness: string
  spotsAvailable: string
  isNew: boolean
  languages: string[]
  term: string[]
  programsAvailable: string[]
  faculties: string[]
  academicLevel: string[]
  relevantLinks: string[]
  lat: number
  lng: number
}

// extract text from a label-driven field
function getTableField($: CheerioAPI, labelText: string): string {
    console.log(labelText)
    const labelEl = $('label').filter((_: number, el: any) => $(el).text().trim() === labelText)
    const row = labelEl.parents('tr').first()
    const widget = row.find('.widget.inline').first()
    return widget.text().trim()
}

function getSidebarField($: CheerioAPI, labelText: string): string {
    console.log(labelText)
    // find .p_right .pfield whose span.label text matches
    const field = $('.p_right .pfield').filter((_, el) => {
      const lbl = $(el).find('span.label').first().text().trim()
      return lbl === labelText
    }).first()
    // the rest of the text after <br>
    const html = field.html() || ''
    const parts = html.split(/<br\s*\/?/i)
    return parts[1]?.replace(/<[^>]+>/g, '').trim() || ''
  }
  
  export async function parseProgramPage(url: string): Promise<Program> {
    const { data: html } = await axios.get(url)
    const $ = load(html)
  
    // Debug logs
    console.log('Title:', $('h1.titlebar').text().trim())
    console.log('Summary count:', $('.program__top_detail .pfield.summary').length)
  
    const rawTitle = $('h1.titlebar').text().trim()
    const isNew = rawTitle.startsWith('*NEW*')
    const name = rawTitle.replace('*NEW*', '').trim()
  
    const university = $('#dnf_class_values_institution__name__widget').text().trim()
  
    const type = getSidebarField($, 'Type:')
    const duration = getSidebarField($, 'Duration:')
  
  // Top detail summaries
  const summary = $('.program__top_detail .pfield.summary')
  // location text without link
  const locClone = summary.eq(3).clone()
  locClone.find('a').remove()
  const location = locClone.text().trim()
  // terms array
  const term = summary.eq(2).text().split(',').map(s => s.trim()).filter(Boolean)

  // Geographic coordinates
  const locInfo = $('.location_info').first()
  const lat = parseFloat(locInfo.attr('data-lat') || '0')
  const lng = parseFloat(locInfo.attr('data-lng') || '0')

  // Programs available
  const progText = summary.eq(4).find('p').text().replace(/Programs available:/i, '')
  const programsAvailable = progText.split(',').map(s => s.trim()).filter(Boolean)

  // Faculties
  const faculties = getTableField($, 'Open to students in:')
    .split(',').map(s => s.trim()).filter(Boolean)

  // Competitiveness row: likeliness & spots
  const compRaw = getTableField($, 'Competitiveness:')
  const [likelinessPart, spotsPart] = compRaw.split('–').map(s => s.trim())
  const likeliness = likelinessPart
  const spotsAvailable = spotsPart || compRaw.replace(likelinessPart, '').trim()

  // Academic level
  const academicLevel = getTableField($, 'Academic Level:')
    .split('/').map(s => s.trim()).filter(Boolean)

  // Languages placeholder
  const languages: string[] = []

  // All relevant links
  const relevantLinks = $('a[href]').map((_, el) => $(el).attr('href') || '').get()
  
    return {
      name,
      university,
      type,
      duration,
      location,
      likeliness,
      spotsAvailable,
      isNew,
      languages,
      term: term,
      programsAvailable,
      faculties,
      academicLevel,
      relevantLinks,
      lat,
      lng
    }
  }
