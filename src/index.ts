interface Video {
  contentId: string;
  title: string;
  viewCounter: number;
}

interface NicoVideoAPI {
  searchVideos: (query: string, minViewCount?: number, limit?: number) => Promise<Video[]>;
}

const baseURL = 'https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search';

async function searchVideos(query: string, minViewCount: number = 10000, limit: number = 3): Promise<Video[]> {
  try {
    const response = await fetch(baseURL + '?' + new URLSearchParams({
      q: query,
      targets: 'title',
      fields: 'contentId,title,viewCounter',
      'filters[viewCounter][gte]': minViewCount.toString(),
      _sort: '-viewCounter',
      _offset: "0",
      _limit: limit.toString(),
      _context: 'apiguide'
    }));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data from NicoVideo API:', error);
    throw error;
  }
}

// createClient関数
function createClient(): NicoVideoAPI {
  return {
    searchVideos
  };
}

// モジュールエクスポート
export { createClient };
