import type { ThreadRequestBody, ThreadResponse } from '@/types/get-comments'

export async function fetchComments(
	id: string,
): Promise<ThreadResponse | undefined> {
	const endpoint = 'https://public.nvcomment.nicovideo.jp/v1/threads'
	const threadIdRegex = /threadIds&quot;:\[\{&quot;id&quot;:(.*?),&quot;/
	const threadKeyRegex =
		/{&quot;threadKey&quot;:&quot;(eyJ0eXAiOiJKV1Qi.*?)&quot/

	try {
		const videoPage = await (
			await fetch(`https://www.nicovideo.jp/watch/${id}`)
		).text()

		const threadId = videoPage.match(threadIdRegex)?.at(1)
		const threadKey = videoPage.match(threadKeyRegex)?.at(1)

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
				'x-frontend-id': '6',
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
