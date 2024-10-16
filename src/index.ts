import { convertFieldsToArray } from './lib/query';
import { ResponseData, SearchParams } from './types/search';

const baseURL = 'https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search';

async function searchVideos(searchParams: SearchParams): Promise<ResponseData> {
  const response = await fetch(baseURL + '?' + convertFieldsToArray(searchParams));

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json() as ResponseData;
  process.env.DUBUG && console.info(result.data);
  return result
}

function createClient(): { searchVideos: (searchParams: SearchParams) => Promise<ResponseData> } {
  return {
    searchVideos,
  };
}

export { createClient };
