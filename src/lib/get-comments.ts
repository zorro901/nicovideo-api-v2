import { withProxyUrl } from '@/lib/proxy'
import type { ThreadRequestBody, ThreadResponse } from '@/types/get-comments'

export async function fetchComments(
	proxyUrl: string,
	id: string,
): Promise<ThreadResponse | undefined> {
	const endpoint = 'https://public.nvcomment.nicovideo.jp/v1/threads'

	try {
		const { threadId, threadKey } = await getThreadInfo(proxyUrl, id)

		if (!(threadId && threadKey)) {
			console.error('Failed to extract threadId or threadKey.')
			return
		}

		const payload: ThreadRequestBody = {
			params: {
				targets: [
					{ id: threadId, fork: 'owner' },
					{ id: threadId, fork: 'main' },
					{ id: threadId, fork: 'easy' },
				],
				language: 'ja-jp',
			},
			threadKey: threadKey,
			additionals: {},
		}

		const threadResponse = await fetch(endpoint, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
				'x-frontend-id': '2',
			},
		})

		if (!threadResponse.ok) {
			console.error('Failed to fetch thread data:', threadResponse.status)
			return
		}

		return await threadResponse.json()
	} catch (error) {
		console.error('Error fetching comments:', error)
	}
}

async function getThreadInfo(
	proxyUrl: string,
	id: string,
): Promise<{ threadId: string; threadKey: string }> {
	const url = withProxyUrl({
		url: `https://nvapi.nicovideo.jp/v1/comment/keys/thread?videoId=${id}`,
		proxyUrl,
	})
	const data = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			'x-frontend-id': '3',
		},
	}).then((response) => response.json())

	return {
		threadId: decodeJWT(data.data.threadKey).payload.tids.at(0) ?? '',
		threadKey: data.data.threadKey,
	}
}

type Jwt = {
	header: { typ: 'JWT'; alg: 'HS512' }
	payload: {
		jti: string
		exp: number
		typ: 'Thread-Key'
		tids: string[]
		f184s: []
	}
}

function decodeJWT(jwt: string): Jwt {
	// JWTを分割する
	const parts = jwt.split('.')
	if (parts.length !== 3) {
		throw new Error('Invalid JWT format')
	}

	// Base64URLをデコードする関数
	function base64UrlDecode(base64Url: string) {
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const decoded = atob(base64) // atobでデコード
		return decodeURIComponent(
			decoded
				.split('')
				.map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
				.join(''),
		)
	}

	// header と payload をデコード
	const header = JSON.parse(base64UrlDecode(parts[0]))
	const payload = JSON.parse(base64UrlDecode(parts[1]))

	return { header, payload }
}
