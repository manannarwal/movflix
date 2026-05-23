// Utility to get player URLs securely
// In development: returns URLs directly from .env
// In production (Vercel): calls the backend API

const isDevelopment = import.meta.env.VITE_USE_LOCAL_API === 'true';

// In development, parse the server URLs from environment variables. In production, this will be empty.
const serverUrls = {
  movie: isDevelopment ? JSON.parse(import.meta.env.VITE_MOVIE_SERVERS_JSON || '{}') : {},
  tv: isDevelopment ? JSON.parse(import.meta.env.VITE_TV_SERVERS_JSON || '{}') : {},
};

// This function now constructs the final URL from the base URLs provided by the environment variables.
const constructUrl = (baseUrl, type, id, season, episode) => {
    if (type === 'movie') {
        if (baseUrl.includes('multiembed.mov')) {
            return `${baseUrl}${id}&tmdb=1`;
        }
        if (baseUrl.includes('tmdb=')) {
            return `${baseUrl}${id}`;
        }
        return `${baseUrl}${id}`;
    }

    if (type === 'tv') {
        if (baseUrl.includes('multiembed.mov')) {
             return `${baseUrl}${id}&tmdb=1&s=${season}&e=${episode}`;
        }
        if (baseUrl.includes('tmdb=')) {
            return `${baseUrl}${id}&season=${season}&episode=${episode}`;
        }
        if (baseUrl.includes('vidsrc.wtf')) {
             return `${baseUrl}${id}&s=${season}&e=${episode}`;
        }
        if (baseUrl.includes('moviesapi.club')) {
            return `${baseUrl}${id}-${season}-${episode}`;
        }
        if (baseUrl.includes('rivestream.net')) {
            return `${baseUrl}${id}&season=${season}&episode=${episode}`;
        }
        // Default structure for many servers
        return `${baseUrl}${id}/${season}/${episode}`;
    }
    return '';
};


export const getPlayerUrl = async (type, id, server, season = null, episode = null) => {
  // In production on Vercel, always use the API. The URLs are not in the browser.
  if (!isDevelopment) {
    const params = new URLSearchParams({
      type,
      id,
      server,
      ...(season && { season }),
      ...(episode && { episode })
    });

    const response = await fetch(`/api/getPlayerUrl?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch player URL from API');
    }
    const data = await response.json();
    return data.playerUrl;
  }

  // In development, generate URL locally using .env variables
  if (!serverUrls[type]?.[server]) {
    throw new Error('Invalid type or server in local development');
  }

  const baseUrl = serverUrls[type][server];
  return constructUrl(baseUrl, type, id, season, episode);
};
