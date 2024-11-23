import { fetchComments } from '@/lib/get-comments'
import { convertFieldsToArray } from '@/lib/query'
import type { ThreadResponse } from '@/types/get-comments'
import type { ResponseData, SearchParams } from '@/types/search'

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
	getComments: (id: string) => Promise<ThreadResponse | undefined>
} {
	return {
		searchVideos: (searchParams) => searchVideos(proxyUrl || '', searchParams),
		getComments: async (id) => await fetchComments(id),
	}
}
export { createClient }
