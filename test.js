import { createClient } from './dist/index.cjs';

const nicovideo = createClient();

async function getTopVideos() {
  try {
    const result = await nicovideo.searchVideos('初音ミク');
    console.log(result);
  } catch (error) {
    console.error('Failed to fetch top videos:', error);
  }
}

getTopVideos();