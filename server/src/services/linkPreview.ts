import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { LinkPreview } from '../types';

export async function fetchLinkPreview(url: string): Promise<LinkPreview> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BookmarkApp/1.0)',
      },
      timeout: 5000,
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract metadata
    const title = $('title').first().text().trim() ||
                  $('meta[property="og:title"]').attr('content') ||
                  $('meta[name="twitter:title"]').attr('content') ||
                  'No title available';

    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') ||
                       $('meta[name="twitter:description"]').attr('content') ||
                       'No description available';

    const image = $('meta[property="og:image"]').attr('content') ||
                  $('meta[name="twitter:image"]').attr('content') ||
                  $('meta[name="twitter:image:src"]').attr('content');

    // Extract site name from URL
    const urlObj = new URL(url);
    const site = urlObj.hostname.replace('www.', '');

    return {
      url,
      title: title.substring(0, 200), // Limit title length
      description: description.substring(0, 500), // Limit description length
      image: image || undefined,
      site
    };
  } catch (error) {
    console.error('Error fetching link preview:', error);
    throw new Error(`Failed to fetch preview for ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
