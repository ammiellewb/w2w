import axios from "axios";
import { CheerioAPI, load } from "cheerio";
import { config } from "dotenv";
config();
const HOME_URL =
  "https://uwaterloo-horizons.symplicity.com/?s=programs&mode=list";

export interface Program {
  program_id: string;
  name: string;
  university: string;
  type: string;
  duration: string;
  location: string;
  likeliness: string;
  spots_available: number;
  requirements: string;
  is_new: boolean;
  languages: string[];
  term: string[];
  programs_available: string[];
  faculties: string[];
  academic_level: string[];
  relevant_links: string[];
  lat: number;
  lng: number;
  url: string;
}

// extract text from a label-driven field
function getTableField($: CheerioAPI, labelText: string): string {
  const labelEl = $("label").filter(
    (_: number, el: any) => $(el).text().trim() === labelText
  );
  const row = labelEl.parents("tr").first();
  const widget = row.find(".widget.inline").first();
  return widget.text().trim();
}

function getSidebarField($: CheerioAPI, labelText: string): string {
  // find .p_right .pfield whose span.label text matches
  const field = $(".p_right .pfield")
    .filter((_, el) => {
      const lbl = $(el).find("span.label").first().text().trim();
      return lbl === labelText;
    })
    .first();
  // the rest of the text after <br>
  const html = field.html() || "";
  const parts = html.split(/<br\s*\/?/i);
  return parts[1]?.replace(/<[^>]+>/g, "").trim() || "";
}

export async function parseProgramPage(url: string): Promise<Program> {
  const { data: html } = await axios.get(url, {
    headers: {
      // send the exact same cookie string your browser had
      Cookie: process.env.SYMP_COOKIE || "",
    },
  });
  const $ = load(html);

  const { data: listHtml } = await axios.get(HOME_URL, {
    headers: {
      Cookie: process.env.SYMP_COOKIE || "",
    },
  });
  const $$ = load(listHtml);

  const rawTitle = $("h1.titlebar").text().trim();
  const isNew = rawTitle.startsWith("*NEW*");
  const name = rawTitle.replace("*NEW*", "").trim();
  const university = $("#dnf_class_values_institution__name__widget")
    .text()
    .trim();
  const type = getSidebarField($, "Type:").replace(/^>/, "").trim();
  const duration = getSidebarField($, "Duration:").replace(/^>/, "").trim();

  // top detail summaries
  const summary = $(".program__top_detail .pfield.summary");
  // location text without link
  const locClone = summary.eq(3).clone();
  locClone.find("a").remove();
  const location = locClone.text().trim();

  // geographic coordinates
  const locInfo = $(".location_info").first();
  const lat = parseFloat(locInfo.attr("data-lat") || "0");
  const lng = parseFloat(locInfo.attr("data-lng") || "0");

  // programs available
  const progText = $(".program_info .p_left .pfield.summary > p")
    .filter((_, el) => $(el).text().trim().startsWith("Programs available:"))
    .text()
    .replace(/Programs available:/i, "")
    .trim();
  const programsAvailable = progText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // faculties
  const faculties = getTableField($, "Open to students in:")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // competitiveness row: likeliness & spots
  const compRaw = getTableField($, "Competitiveness:");
  // extract likeliness level
  const likelinessMatch = compRaw.match(/Likeliness\s*-\s*([^-]+)/);
  const likeliness = likelinessMatch?.[1]?.trim() || "";
  // extract spots number (e.g., "0" from "Approximately 0 spots available")
  const spotsMatch = compRaw.match(/Approximately\s+(\d+)/);
  const spotsAvailable = spotsMatch?.[1] || "";

  // academic level
  const academicLevel = getTableField($, "Academic Level:")
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);

  // languages and terms array
  const programId = new URL(url).searchParams.get("id")!;
  // console.log(programId)
  const row = $$(`tr#row_${programId}`);
  // console.log('fetched HTML snippet:', listHtml.slice(0, 1000))
  // console.log('  › found row count:', row.length)
  // console.log('  › row HTML snippet:', row.html()?.slice(0,200))

  // const languages: string[] = []
  // const term: string[] = []

  const term = row
    .find(".lst-cl-_term_list > div > div")
    .map((_, el) => $$(el).text().trim())
    .get()
    .filter(Boolean);

  const languages = row.find(".lst-cl-language div").text().trim()
    ? row
        .find(".lst-cl-language div")
        .text()
        .trim()
        .split(",")
        .map((s) => s.trim())
    : [];

  const requirements = getTableField($, "What are the requirements?");

  const urlLink = `https://uwaterloo-horizons.symplicity.com/?s=programs&mode=form&id=${programId}`;

  // all relevant links - only keep http/https links
  const relevantLinks = $("a[href]")
    .map((_, el) => $(el).attr("href") || "")
    .get()
    .filter((href) => href.startsWith("http"));

  return {
    program_id: programId,
    name,
    university,
    type,
    duration,
    location,
    likeliness,
    spots_available: parseInt(spotsAvailable, 10),
    requirements,
    is_new: isNew,
    languages,
    term,
    programs_available: programsAvailable,
    faculties,
    academic_level: academicLevel,
    relevant_links: relevantLinks,
    lat,
    lng,
    url: urlLink,
  };
}
