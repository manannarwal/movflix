// Anime API utilities using Jikan API (MyAnimeList) - CORS friendly
const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

// Rate limiting helper for Jikan API (1 request per second)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeJikanRequest = async (url) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  
  lastRequestTime = Date.now();
  const response = await fetch(url);
  return await response.json();
};

// Fetch popular anime
export const fetchPopularAnime = async (page = 1) => {
  try {
    const url = `${JIKAN_BASE_URL}/anime?page=${page}&limit=20&order_by=popularity&sort=asc`;
    const data = await makeJikanRequest(url);
    
    if (data.data) {
      return data.data.map(anime => ({
        id: anime.mal_id.toString(),
        title: anime.title,
        image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
        rating: anime.score || "N/A",
        description: anime.synopsis,
        year: anime.year,
        episodes: anime.episodes,
        status: anime.status
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching popular anime:", error);
    return [];
  }
};

// Fetch recent/trending anime (top scored recent anime)
export const fetchRecentAnime = async (page = 1) => {
  try {
    const url = `${JIKAN_BASE_URL}/anime?page=${page}&limit=20&order_by=start_date&sort=desc&min_score=7`;
    const data = await makeJikanRequest(url);
    
    if (data.data) {
      return data.data.map(anime => ({
        id: anime.mal_id.toString(),
        title: anime.title,
        image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
        rating: anime.score || "N/A",
        episodeNumber: anime.episodes || "?",
        description: anime.synopsis,
        year: anime.year,
        status: anime.status
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching recent anime:", error);
    return [];
  }
};

// Search anime
export const searchAnime = async (query, page = 1) => {
  try {
    const url = `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`;
    const data = await makeJikanRequest(url);
    
    if (data.data) {
      return data.data.map(anime => ({
        id: anime.mal_id.toString(),
        title: anime.title,
        image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
        rating: anime.score || "N/A",
        description: anime.synopsis,
        year: anime.year,
        episodes: anime.episodes
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error searching anime:", error);
    return [];
  }
};

// Get anime details and episodes
export const getAnimeInfo = async (animeId) => {
  try {
    const url = `${JIKAN_BASE_URL}/anime/${animeId}`;
    const data = await makeJikanRequest(url);
    
    if (data.data) {
      const anime = data.data;
      return {
        id: anime.mal_id.toString(),
        title: anime.title,
        description: anime.synopsis,
        image: anime.images?.jpg?.large_image_url,
        rating: anime.score,
        totalEpisodes: anime.episodes || 12,
        status: anime.status,
        releaseDate: anime.year,
        genres: anime.genres?.map(g => g.name) || [],
        episodes: Array.from({ length: anime.episodes || 12 }, (_, i) => ({
          id: `${animeId}-episode-${i + 1}`,
          number: i + 1,
          title: `Episode ${i + 1}`
        }))
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return null;
  }
};

// Get streaming links for an episode (placeholder - would need actual streaming service)
export const getEpisodeStreams = async (episodeId) => {
  // This would connect to your actual streaming service
  return {
    sources: [
      {
        url: `https://megaplay.buzz/stream/s-2/${episodeId}/sub`,
        quality: "1080p"
      }
    ]
  };
};

// Convert anime ID and episode number to Hianime format for your player
export const convertToHianimeId = (animeId, episodeNumber) => {
  // Create a Hianime-compatible episode ID
  // Based on Hianime URL patterns, episode IDs can have various formats
  
  // Common anime mappings with different possible formats
  const animeIdMappings = {
    // Popular anime mappings (MAL_ID: possible_hianime_patterns)
    "20": {
      patterns: [
        `naruto-92-episode-${episodeNumber}`,
        `naruto-episode-${episodeNumber}`,
        `naruto-92-${episodeNumber}`,
        `naruto-${episodeNumber}`
      ],
      title: "Naruto"
    },
    "21": {
      patterns: [
        `one-piece-100-episode-${episodeNumber}`,
        `one-piece-episode-${episodeNumber}`,
        `one-piece-100-${episodeNumber}`,
        `one-piece-${episodeNumber}`
      ],
      title: "One Piece"
    },
    "1535": {
      patterns: [
        `death-note-1143-episode-${episodeNumber}`,
        `death-note-episode-${episodeNumber}`,
        `death-note-1143-${episodeNumber}`,
        `death-note-${episodeNumber}`
      ],
      title: "Death Note"
    },
    "11061": {
      patterns: [
        `hunter-x-hunter-2011-136-episode-${episodeNumber}`,
        `hunter-x-hunter-2011-episode-${episodeNumber}`,
        `hunter-x-hunter-136-${episodeNumber}`,
        `hunter-x-hunter-${episodeNumber}`
      ],
      title: "Hunter x Hunter"
    },
    "16498": {
      patterns: [
        `attack-on-titan-112-episode-${episodeNumber}`,
        `attack-on-titan-episode-${episodeNumber}`,
        `attack-on-titan-112-${episodeNumber}`,
        `attack-on-titan-${episodeNumber}`,
        `shingeki-no-kyojin-episode-${episodeNumber}`
      ],
      title: "Attack on Titan"
    },
    "38524": {
      patterns: [
        `jujutsu-kaisen-534-episode-${episodeNumber}`,
        `jujutsu-kaisen-episode-${episodeNumber}`,
        `jujutsu-kaisen-534-${episodeNumber}`,
        `jujutsu-kaisen-${episodeNumber}`
      ],
      title: "Jujutsu Kaisen"
    },
    "40748": {
      patterns: [
        `jujutsu-kaisen-2nd-season-18413-episode-${episodeNumber}`,
        `jujutsu-kaisen-2nd-season-episode-${episodeNumber}`,
        `jujutsu-kaisen-s2-episode-${episodeNumber}`,
        `jujutsu-kaisen-season-2-${episodeNumber}`
      ],
      title: "Jujutsu Kaisen S2"
    },
    "49596": {
      patterns: [
        `blue-lock-18450-episode-${episodeNumber}`,
        `blue-lock-episode-${episodeNumber}`,
        `blue-lock-18450-${episodeNumber}`,
        `blue-lock-${episodeNumber}`
      ],
      title: "Blue Lock"
    },
    "52991": {
      patterns: [
        `oshi-no-ko-18590-episode-${episodeNumber}`,
        `oshi-no-ko-episode-${episodeNumber}`,
        `oshi-no-ko-18590-${episodeNumber}`,
        `oshi-no-ko-${episodeNumber}`
      ],
      title: "Oshi no Ko"
    },
    "48569": {
      patterns: [
        `86-eighty-six-part-ii-17593-episode-${episodeNumber}`,
        `86-eighty-six-episode-${episodeNumber}`,
        `86-part-2-episode-${episodeNumber}`,
        `eighty-six-${episodeNumber}`
      ],
      title: "86"
    }
  };
  
  const animeMapping = animeIdMappings[animeId];
  
  if (animeMapping) {
    // Try the first pattern (most likely to work)
    const episodeId = animeMapping.patterns[0];
    
    return episodeId;
  }
  
  // Fallback: create a generic ID
  return `anime-${animeId}-episode-${episodeNumber}`;
};

// Get all possible episode ID patterns for testing
export const getAllPatterns = (animeId, episodeNumber) => {
  const animeIdMappings = {
    "20": {
      patterns: [
        `naruto-92-episode-${episodeNumber}`,
        `naruto-episode-${episodeNumber}`,
        `naruto-92-${episodeNumber}`,
        `naruto-${episodeNumber}`
      ],
      title: "Naruto"
    },
    "1535": {
      patterns: [
        `death-note-1143-episode-${episodeNumber}`,
        `death-note-episode-${episodeNumber}`,
        `death-note-1143-${episodeNumber}`,
        `death-note-${episodeNumber}`
      ],
      title: "Death Note"
    },
    "16498": {
      patterns: [
        `attack-on-titan-112-episode-${episodeNumber}`,
        `attack-on-titan-episode-${episodeNumber}`,
        `attack-on-titan-112-${episodeNumber}`,
        `attack-on-titan-${episodeNumber}`,
        `shingeki-no-kyojin-episode-${episodeNumber}`
      ],
      title: "Attack on Titan"
    }
  };
  
  return animeIdMappings[animeId]?.patterns || [];
};

// Check if anime has a known Hianime mapping
export const hasHianimeMapping = (animeId) => {
  const mappings = {
    "20": true, "21": true, "1535": true, "11061": true, "16498": true,
    "38524": true, "40748": true, "49596": true, "52991": true, "48569": true
  };
  
  return mappings[animeId] || false;
};

export default {
  fetchPopularAnime,
  fetchRecentAnime,
  searchAnime,
  getAnimeInfo,
  getEpisodeStreams,
  convertToHianimeId,
  hasHianimeMapping,
  getAllPatterns
};
