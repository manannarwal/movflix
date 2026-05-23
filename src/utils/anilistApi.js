const anilistApi = async (query, variables) => {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables })
  });
  return response.json();
};

export const fetchAnilistTrending = async () => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
          }
          bannerImage
        }
      }
    }
  `;
  const variables = { page: 1, perPage: 15 };
  const data = await anilistApi(query, variables);
  return data.data.Page.media.map(item => ({
    id: item.id,
    title: item.title.english || item.title.romaji,
    image: item.coverImage.large,
    cover: item.bannerImage || item.coverImage.extraLarge,
  }));
};

export const fetchAnilistPopular = async () => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          bannerImage
        }
      }
    }
  `;
  const variables = { page: 1, perPage: 20 };
  const data = await anilistApi(query, variables);
  return data.data.Page.media.map(item => ({
    id: item.id,
    title: item.title.english || item.title.romaji,
    image: item.coverImage.large,
  }));
};

export const fetchAnilistRecent = async () => {
  try {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(sort: UPDATED_AT_DESC, type: ANIME, isAdult: false) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
          }
        }
      }
    `;
    const variables = { page: 1, perPage: 20 };
    const data = await anilistApi(query, variables);
    return data.data.Page.media.map(item => ({
      id: item.id,
      title: item.title.english || item.title.romaji,
      image: item.coverImage.large,
    }));
  } catch (error) {
    console.error("Error fetching recent animes:", error);
    return [];
  }
};

export const searchAnilist = async (searchTerm) => {
  const query = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(search: $search, type: ANIME, isAdult: false) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
        }
      }
    }
  `;
  const variables = { search: searchTerm, page: 1, perPage: 20 };
  const data = await anilistApi(query, variables);
  return data.data.Page.media.map(item => ({
    id: item.id,
    title: item.title.english || item.title.romaji,
    image: item.coverImage.large,
    media_type: "anime"
  }));
};

export const getAnilistInfoById = async (id) => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        description(asHtml: false)
        status
        seasonYear
        genres
        averageScore
        coverImage {
          extraLarge
        }
        bannerImage
        episodes
      }
    }
  `;
  const variables = { id };
  const data = await anilistApi(query, variables);
  const media = data.data.Media;

  // Get anime info to find on Jikan
  const title = media.title.english || media.title.romaji;
  let totalEpisodes = media.episodes;

  // If AniList doesn't have episode count, fetch from Jikan (MAL)
  if (!totalEpisodes) {
    try {
      const jikanSearch = await fetch(
        `https://api.jikan.moe/v4/anime?query=${encodeURIComponent(title)}`
      );
      const jikanData = await jikanSearch.json();

      if (jikanData.data && jikanData.data.length > 0) {
        // Find exact match or use first result
        const exactMatch = jikanData.data.find(a =>
          a.title?.toLowerCase() === title.toLowerCase() ||
          a.title_english?.toLowerCase() === title.toLowerCase()
        );
        const anime = exactMatch || jikanData.data[0];
        totalEpisodes = anime.episodes || null;
        console.log('Fetched episode count from Jikan:', totalEpisodes);
      }
    } catch (error) {
      console.error('Error fetching from Jikan:', error);
    }
  }

  return {
    id: media.id,
    title: title,
    description: media.description ? media.description.replace(/<br>/g, '') : '',
    status: media.status,
    totalEpisodes: totalEpisodes,
    image: media.coverImage.extraLarge,
    cover: media.bannerImage || media.coverImage.extraLarge,
    genres: media.genres,
    rating: media.averageScore,
    year: media.seasonYear,
  };
};

export const getMegaPlayUrl = (anilistId, episodeNum, language = 'sub') => {
  return `https://megaplay.buzz/stream/ani/${anilistId}/${episodeNum}/${language}`;
};
