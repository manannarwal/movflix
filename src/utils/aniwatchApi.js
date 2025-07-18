// Use proxy for production to avoid CORS issues, direct proxy for development
const API_BASE = import.meta.env.PROD 
  ? "https://aniwatch-api-three-nu.vercel.app/api/v2/hianime"
  : "/api/v2/hianime";

// Helper function to make API requests with CORS handling
const fetchWithCORS = async (url) => {
  if (import.meta.env.PROD) {
    // In production, use a CORS proxy
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    // AllOrigins wraps the response in a 'contents' field
    return JSON.parse(data.contents);
  } else {
    // In development, direct fetch
    const response = await fetch(url);
    return await response.json();
  }
};

// Helper function to get the correct API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE}${endpoint}`;
};

// Search anime by query
export async function searchAnime(query) {
  const data = await fetchWithCORS(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  return data?.data?.animes || [];
}

// Get anime info by ID (requires kebab-case ID from search)
export async function getAnimeInfoById(animeId) {
  const data = await fetchWithCORS(`${API_BASE}/anime/${animeId}`);
  return data?.data?.anime?.info || null;
}

// Get episodes for an anime (requires kebab-case ID)
export async function getAnimeEpisodes(animeId) {
  const data = await fetchWithCORS(`${API_BASE}/anime/${animeId}/episodes`);
  return data?.data?.episodes || [];
}

// Get available servers for an episode
export async function getEpisodeServers(animeEpisodeId) {
  const data = await fetchWithCORS(`${API_BASE}/episode/servers?animeEpisodeId=${encodeURIComponent(animeEpisodeId)}`);
  return data?.data || null;
}

// Get streaming sources for an episode
export async function getEpisodeSources(animeEpisodeId, server = "vidstreaming", category = "sub") {
  // First, get available servers
  const serverData = await getEpisodeServers(animeEpisodeId);
  if (!serverData) {
    console.error('No server data available');
    return [];
  }
  
  // Get the first available server for the selected category
  const availableServers = serverData[category] || [];
  if (availableServers.length === 0) {
    console.error(`No ${category} servers available`);
    return [];
  }
  
  const serverName = availableServers[0].serverName;
  
  const url = `${API_BASE}/episode/sources?animeEpisodeId=${encodeURIComponent(animeEpisodeId)}&server=${serverName}&category=${category}`;
  
  const data = await fetchWithCORS(url);
  return data?.data?.sources || [];
}
