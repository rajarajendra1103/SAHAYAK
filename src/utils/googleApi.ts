// Google API Configuration and Utilities
// API Keys provided by user
const GOOGLE_API_KEY_1 = 'AIzaSyA-ECuJ_4YIXs8AUw1WFkrzGrBeXf5R4zU';
const GOOGLE_API_KEY_2 = 'AIzaSyDwSA7ufpX8fAEKgkGe_UKHd_fCzTzv3d0';

// Use the first API key as primary, second as fallback
const PRIMARY_API_KEY = GOOGLE_API_KEY_1;
const FALLBACK_API_KEY = GOOGLE_API_KEY_2;

// Google Calendar API endpoints
const CALENDAR_BASE_URL = 'https://www.googleapis.com/calendar/v3';
const INDIAN_HOLIDAYS_CALENDAR_ID = 'en.indian%23holiday%40group.v.calendar.google.com';

// Google Translate API
const TRANSLATE_BASE_URL = 'https://translation.googleapis.com/language/translate/v2';

// Google Custom Search API (for educational content)
const CUSTOM_SEARCH_BASE_URL = 'https://www.googleapis.com/customsearch/v1';

interface GoogleApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    date?: string;
    dateTime?: string;
  };
  end: {
    date?: string;
    dateTime?: string;
  };
}

interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  pagemap?: {
    cse_image?: Array<{ src: string }>;
  };
}

/**
 * Fetch Indian holidays from Google Calendar
 */
export async function fetchIndianHolidays(
  timeMin: string,
  timeMax: string
): Promise<GoogleApiResponse<CalendarEvent[]>> {
  try {
    const url = `${CALENDAR_BASE_URL}/calendars/${INDIAN_HOLIDAYS_CALENDAR_ID}/events`;
    const params = new URLSearchParams({
      key: PRIMARY_API_KEY,
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime'
    });

    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      // Try with fallback API key
      const fallbackParams = new URLSearchParams({
        key: FALLBACK_API_KEY,
        timeMin,
        timeMax,
        singleEvents: 'true',
        orderBy: 'startTime'
      });
      
      const fallbackResponse = await fetch(`${url}?${fallbackParams}`);
      
      if (!fallbackResponse.ok) {
        throw new Error(`API request failed: ${fallbackResponse.status}`);
      }
      
      const data = await fallbackResponse.json();
      return { success: true, data: data.items || [] };
    }

    const data = await response.json();
    return { success: true, data: data.items || [] };
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Translate text using Google Translate API
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<GoogleApiResponse<TranslationResult>> {
  try {
    const body = {
      q: text,
      target: targetLanguage,
      ...(sourceLanguage && { source: sourceLanguage }),
      format: 'text'
    };

    const response = await fetch(`${TRANSLATE_BASE_URL}?key=${PRIMARY_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      // Try with fallback API key
      const fallbackResponse = await fetch(`${TRANSLATE_BASE_URL}?key=${FALLBACK_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!fallbackResponse.ok) {
        throw new Error(`Translation API request failed: ${fallbackResponse.status}`);
      }

      const data = await fallbackResponse.json();
      const translation = data.data.translations[0];
      
      return {
        success: true,
        data: {
          translatedText: translation.translatedText,
          detectedSourceLanguage: translation.detectedSourceLanguage
        }
      };
    }

    const data = await response.json();
    const translation = data.data.translations[0];
    
    return {
      success: true,
      data: {
        translatedText: translation.translatedText,
        detectedSourceLanguage: translation.detectedSourceLanguage
      }
    };
  } catch (error) {
    console.error('Error translating text:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Translation failed' 
    };
  }
}

/**
 * Search for educational content using Google Custom Search
 */
export async function searchEducationalContent(
  query: string,
  fileType?: string,
  siteSearch?: string
): Promise<GoogleApiResponse<SearchResult[]>> {
  try {
    const params = new URLSearchParams({
      key: PRIMARY_API_KEY,
      cx: '017576662512468239146:omuauf_lfve', // Educational content search engine ID
      q: query,
      ...(fileType && { fileType }),
      ...(siteSearch && { siteSearch }),
      safe: 'active',
      num: '10'
    });

    const response = await fetch(`${CUSTOM_SEARCH_BASE_URL}?${params}`);

    if (!response.ok) {
      // Try with fallback API key
      const fallbackParams = new URLSearchParams({
        key: FALLBACK_API_KEY,
        cx: '017576662512468239146:omuauf_lfve',
        q: query,
        ...(fileType && { fileType }),
        ...(siteSearch && { siteSearch }),
        safe: 'active',
        num: '10'
      });

      const fallbackResponse = await fetch(`${CUSTOM_SEARCH_BASE_URL}?${fallbackParams}`);

      if (!fallbackResponse.ok) {
        throw new Error(`Search API request failed: ${fallbackResponse.status}`);
      }

      const data = await fallbackResponse.json();
      return { success: true, data: data.items || [] };
    }

    const data = await response.json();
    return { success: true, data: data.items || [] };
  } catch (error) {
    console.error('Error searching content:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Search failed' 
    };
  }
}

/**
 * Get current date in ISO format for API calls
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString();
}

/**
 * Get date range for calendar queries
 */
export function getDateRange(months: number = 1): { timeMin: string; timeMax: string } {
  const now = new Date();
  const timeMin = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const timeMax = new Date(now.getFullYear(), now.getMonth() + months, 0).toISOString();
  
  return { timeMin, timeMax };
}

/**
 * Language codes for translation
 */
export const LANGUAGE_CODES = {
  english: 'en',
  hindi: 'hi',
  kannada: 'kn',
  telugu: 'te',
  tamil: 'ta',
  marathi: 'mr',
  gujarati: 'gu',
  bengali: 'bn',
  punjabi: 'pa',
  malayalam: 'ml'
} as const;

/**
 * Check if Google APIs are available
 */
export function checkApiAvailability(): boolean {
  return !!(PRIMARY_API_KEY && FALLBACK_API_KEY);
}

export default {
  fetchIndianHolidays,
  translateText,
  searchEducationalContent,
  getCurrentDateISO,
  getDateRange,
  LANGUAGE_CODES,
  checkApiAvailability
};