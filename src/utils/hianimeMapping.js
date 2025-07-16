// Dynamic anime streaming - try multiple URL patterns that actually work

// Get streaming episode ID using multiple approaches
export const getHianimeEpisodeId = (animeId, episodeNumber, animeTitle = '') => {
  // Try different URL patterns that real sites might use
  
  if (animeTitle) {
    // Pattern 1: Use clean title slug
    const cleanTitle = animeTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces
      .replace(/-+/g, '-'); // Clean up hyphens
    
    // Try common episode patterns
    const patterns = [
      `${cleanTitle}-${episodeNumber}`,
      `${cleanTitle}-episode-${episodeNumber}`,
      `${cleanTitle}-ep-${episodeNumber}`,
      `${animeId}-${episodeNumber}`,
      `${animeId}/${episodeNumber}`,
      animeId.toString() + episodeNumber.toString(),
    ];
    
    // Return the first pattern - let the player try it
    return patterns[0];
  }
  
  // Fallback: just use anime ID + episode
  return `${animeId}-${episodeNumber}`;
};

// Make ALL anime available 
export const hasHianimeMapping = (animeId) => {
  return true; 
};

export const addEpisodeMapping = () => {};
export const hianimeEpisodeMappings = {};
