import { fetchComments } from '@/lib/get-comments'
import { withProxyUrl } from '@/lib/proxy'
import { convertFieldsToArray } from '@/lib/query'
import type { ThreadResponse } from '@/types/get-comments'
import type { ResponseData, SearchParams } from '@/types/search'

const baseURL =
	'https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search'

async function searchVideos(
	proxyUrl: string,
	searchParams: SearchParams,
): Promise<ResponseData> {
	const url = withProxyUrl({
		url: `${baseURL}?${convertFieldsToArray(searchParams)}`,
		proxyUrl,
	})
	const response = await fetch(url)
	return await response.json()
}

function createClient({ proxyUrl }: { proxyUrl?: string } = {}): {
	searchVideos: (searchParams: SearchParams) => Promise<ResponseData>
	getComments: (id: string) => Promise<ThreadResponse | undefined>
} {
	return {
		searchVideos: (searchParams) => searchVideos(proxyUrl || '', searchParams),
		getComments: async (id) => await fetchComments(proxyUrl || '', id),
	}
}
export { createClient }
