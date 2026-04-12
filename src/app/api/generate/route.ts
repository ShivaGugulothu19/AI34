import { NextResponse } from 'next/server';
import { load } from 'cheerio';

function generateFakeAI(adInput: string, pageData: any) {
  // simple keyword extraction
  const keyword = adInput.split(" ")[0] || "Solution";

  return {
    headline: `${keyword} that helps you succeed faster`,
    subheadline: "Designed to match your needs",
    sections: pageData.sections.map((s: string) => s + " Optimized for better results."),
    cta_text: "Get Started Now"
  };
}

export async function POST(req: Request) {
  try {
    const { ad_input, url } = await req.json();

    if (!ad_input || !url) {
      return NextResponse.json({ error: 'Missing ad_input or url' }, { status: 400 });
    }

    let html = '';
    
    // 1. Scrape the URL
    try {
      console.log(`Fetching URL: ${url}`);
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch the landing page URL.' }, { status: 400 });
      }
      html = await response.text();
    } catch (e: any) {
        return NextResponse.json({ error: 'Invalid URL or network error fetching the landing page.' }, { status: 400 });
    }
    
    const $ = load(html);

    // Extract text elements intelligently
    const headline = $('h1').first().text().trim() || $('title').text().trim() || 'No headline found';
    const subheadline = $('h2').first().text().trim() || $('h3').first().text().trim() || 'No subheadline found';
    
    const sections: string[] = [];
    $('p, li').each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 30 && sections.length < 5) { // Grab up to 5 substantive paragraphs
        sections.push(text);
      }
    });

    const cta_text = $('button, a.btn, a[class*="button"], a[class*="btn"]').first().text().trim() || 'Submit';

    const originalData = {
      headline,
      subheadline,
      sections,
      cta_text,
    };

    const optimized = generateFakeAI(ad_input, originalData);

    return NextResponse.json({
      original: originalData,
      optimized: optimized,
    });
  } catch (error: any) {
    console.error('Error generating:', error);
    return NextResponse.json({ error: error.message || 'Server error occurred during generation.' }, { status: 500 });
  }
}
