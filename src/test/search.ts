import { createClient } from '../index'

const client = createClient()
try {
	const result = await client.searchVideos({
		q: 'ドーナツホール',
		targets: {
			title: true,
		},
		limit: 3,
		sort: { likeCounter: 'desc' },
		fields: {
			contentId: true, // コンテンツID
			title: true, // タイトル
			description: true, // 説明文
			userId: true, // ユーザー投稿動画の場合、投稿者のユーザーID
			channelId: true, // チャンネル動画の場合、チャンネルID
			viewCounter: true, // 再生数
			mylistCounter: true, // マイリスト数またはのお気に入り数
			likeCounter: true, // いいね！数
			lengthSeconds: true, // 再生時間(秒)
			thumbnailUrl: true, // サムネイルのURL
			startTime: true, // コンテンツの投稿時間 (ISO8601形式)
			lastResBody: true, // 最新のコメント
			commentCounter: true, // コメント数
			lastCommentTime: true, // 最終コメント時間 (ISO8601形式)
			categoryTags: true, // カテゴリタグ
			tags: true, // タグ(空白区切り)
			genre: true, // ジャンル
		},
		jsonFilter: {
			type: 'and',
			filters: [
				{
					type: 'equal',
					field: 'tags',
					value: 'VOCALOID殿堂入り',
				},
				{
					type: 'equal',
					field: 'tags',
					value: 'ハチ',
				},
				{
					type: 'range',
					field: 'startTime',
					from: '2020-07-07T00:00:00+09:00',
					to: '2024-10-01T00:00:00+09:00',
					include_lower: true,
				},
			],
		},
		filters: {
			likeCounter: {
				min: 24700,
				max: 99999,
			},
			startTime: {
				from: '2021', // 2022年のデータのみを抽出する
				to: '2025',
			},
		},
	})
	console.info(result)
} catch (error) {
	console.error('Error fetching data from NicoVideo API:', error)
}
