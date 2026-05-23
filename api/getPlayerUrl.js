export default function handler(req, res) {
  const { type, id, server, season, episode } = req.query;

  if (!type || !id || !server) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const serverUrls = {
    movie: {
      vidsrc1: 'https://vidlink.pro/movie/',
      vidsrc2: 'https://vidsrcme.su/embed/movie?tmdb=',
      vidsrc3: 'https://vidsrc.wtf/api/2/movie/?id=',
      vidsrc4: 'https://moviesapi.club/movie/',
      vidsrc5: 'https://player.videasy.net/movie/',
      vidsrc6: 'https://player.vidify.top/embed/movie/',
      vidsrc7: 'https://vidnest.fun/movie/',
      vidsrc8: 'https://player.vidplus.to/embed/movie/',
      vidsrc9: 'https://rivestream.net/embed?type=movie&id=',
      vidsrc10: 'https://vidsrc.wtf/api/3/movie/?id=',
      vidsrc11: 'https://111movies.com/movie/',
      vidsrc12: 'https://multiembed.mov/directstream.php?video_id=',
    },
    tv: {
      vidsrc1: 'https://vidlink.pro/tv/',
      vidsrc2: 'https://vidsrcme.su/embed/tv?tmdb=',
      vidsrc3: 'https://vidsrc.wtf/api/2/tv/?id=',
      vidsrc4: 'https://moviesapi.club/tv/',
      vidsrc5: 'https://player.videasy.net/tv/',
      vidsrc6: 'https://player.vidify.top/embed/tv/',
      vidsrc7: 'https://vidnest.fun/tv/',
      vidsrc8: 'https://player.vidplus.to/embed/tv/',
      vidsrc9: 'https://rivestream.net/embed?type=tv&id=',
      vidsrc10: 'https://111movies.com/tv/',
      vidsrc11: 'https://vidsrc.wtf/api/3/tv/?id=',
      vidsrc12: 'https://multiembed.mov/directstream.php?video_id=',
    },
  };

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
      return `${baseUrl}${id}/${season}/${episode}`;
    }
    return '';
  };

  try {
    if (!serverUrls[type] || !serverUrls[type][server]) {
      return res.status(400).json({ error: 'Invalid type or server' });
    }

    const baseUrl = serverUrls[type][server];
    const playerUrl = constructUrl(baseUrl, type, id, season, episode);

    return res.status(200).json({ playerUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
