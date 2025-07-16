const API_BASE = "/api/v2/hianime";

// Search anime by query
export async function searchAnime(query) {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`, { credentials: 'omit' });
  const data = await res.json();
  return data?.data?.animes || [];
}

// Get anime info by ID (requires kebab-case ID from search)
export async function getAnimeInfoById(animeId) {
  const res = await fetch(`${API_BASE}/anime/${animeId}`, { credentials: 'omit' });
  const data = await res.json();
  return data?.data?.anime?.info || null;
}

// Get episodes for an anime (requires kebab-case ID)
export async function getAnimeEpisodes(animeId) {
  const res = await fetch(`${API_BASE}/anime/${animeId}/episodes`, { credentials: 'omit' });
  const data = await res.json();
  return data?.data?.episodes || [];
}

// Get available servers for an episode
export async function getEpisodeServers(animeEpisodeId) {
  const res = await fetch(`${API_BASE}/episode/servers?animeEpisodeId=${encodeURIComponent(animeEpisodeId)}`, { credentials: 'omit' });
  const data = await res.json();
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
  
  const res = await fetch(url, { credentials: 'omit' });
  const data = await res.json();
  return data?.data?.sources || [];
}
