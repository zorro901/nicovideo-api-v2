import { convertFieldsToArray } from './lib/query'
import type { ResponseData, SearchParams } from './types/search'

const baseURL =
	'https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search'

async function searchVideos(
	proxyUrl: string,
	searchParams: SearchParams,
): Promise<ResponseData> {
	const proxyUrlEndsWithSlash = proxyUrl.endsWith('/')
		? proxyUrl
		: `${proxyUrl}/`
	const url = `${proxyUrl === '' ? '' : proxyUrlEndsWithSlash}${baseURL}?${convertFieldsToArray(searchParams)}`

	const response = await fetch(url)
	return await response.json()
}

function createClient({ proxyUrl }: { proxyUrl?: string } = {}): {
	searchVideos: (searchParams: SearchParams) => Promise<ResponseData>
} {
	return {
		searchVideos: (searchParams: SearchParams): Promise<ResponseData> =>
			searchVideos(proxyUrl || '', searchParams),
	}
}
export { createClient }
