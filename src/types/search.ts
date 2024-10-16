type NicoVideoMetadata = {
	contentId: string // コンテンツID
	title: string // タイトル
	description: string // 説明文
	userId?: number // ユーザー投稿動画の場合、投稿者のユーザーID
	channelId?: number // チャンネル動画の場合、チャンネルID
	viewCounter: number // 再生数
	mylistCounter: number // マイリスト数またはのお気に入り数
	likeCounter: number // いいね！数
	lengthSeconds: number // 再生時間(秒)
	thumbnailUrl: string // サムネイルのURL
	startTime: string // コンテンツの投稿時間 (ISO8601形式)
	lastResBody: string // 最新のコメント
	commentCounter: number // コメント数
	lastCommentTime: string // 最終コメント時間 (ISO8601形式)
	categoryTags: string // カテゴリタグ
	tags: string // タグ(空白区切り)
	tagsExact: string // タグ完全一致(空白区切り)
	genre: string // ジャンル
	genreKeyword: string // ジャンル完全一致
}

export type SearchField = Omit<NicoVideoMetadata, 'tagsExact' | 'genreKeyword'>
type SortingField = Pick<
	NicoVideoMetadata,
	| 'viewCounter'
	| 'mylistCounter'
	| 'likeCounter'
	| 'lengthSeconds'
	| 'startTime'
	| 'commentCounter'
	| 'lastCommentTime'
>
export type FilteringField = Omit<
	NicoVideoMetadata,
	| 'title'
	| 'description'
	| 'userId'
	| 'channelId'
	| 'thumbnailUrl'
	| 'lastResBody'
>
export type TargetsField =
	| 'categoryTags'
	| 'title'
	| 'description'
	| 'tags'
	| 'genre'
	| 'lastResBody'
	| 'tagsExact'

// 数値範囲指定の型
export type NumberRange = {
	min?: number
	max?: number
}

export type TimeRange = {
	from?: string // ISO8601形式
	to?: string // ISO8601形式
}

// フィルター用の型
export type FilterField = {
	viewCounter?: NumberRange // 再生数の範囲
	mylistCounter?: NumberRange // マイリスト数の範囲
	likeCounter?: NumberRange // いいね数の範囲
	lengthSeconds?: NumberRange // 再生時間の範囲
	commentCounter?: NumberRange // コメント数の範囲
	startTime?: TimeRange // 投稿時間の範囲 (ISO8601形式)
	genre?: string // ジャンル
	tagsExact?: string // タグ完全一致
	genreKeyword?: string
	tags?: string
	categoryTags?: string
	cmsid?: string // 動画ID "sm12345"
	contentId?: string
}

export type SearchParams = {
	q: string // 検索キーワード
	targets: Partial<Record<TargetsField, true>> // 検索対象フィールドのオブジェクト
	fields?: Partial<Record<keyof SearchField, true>> // レスポンスに含めるフィールド (任意)
	filters?: FilterField
	jsonFilter?: JsonFilter // 複雑なフィルタ条件 (任意)
	sort?: Partial<Record<keyof SortingField, 'asc' | 'desc'>>
	offset?: number // 取得オフセット (任意、デフォルト: 0)
	limit?: number // 取得最大数 (任意、デフォルト: 10)
	context?: string // サービスまたはアプリケーション名 (任意)
}

type Meta = {
	status: number
	id: string
	totalCount: number
}

type DataItem = {
	[key: string]: string
}

export type ResponseData = {
	meta: Meta
	data: DataItem[]
}

// equalフィルター
interface EqualFilter {
	type: 'equal'
	field: keyof FilteringField // 対象フィールド
	value: string | number // 比較する値
}

// rangeフィルター
interface RangeFilter {
	type: 'range'
	field: keyof SortingField // 対象フィールド
	from: string | number // 範囲の始点
	to: string | number // 範囲の終点
	include_lower?: boolean // 範囲の始点を含むか
	include_upper?: boolean // 範囲の終点を含むか
}

// orフィルター (フィルターの配列)
interface OrFilter {
	type: 'or'
	filters: JsonFilter[] // 内包するフィルタの配列
}

// andフィルター (フィルターの配列)
interface AndFilter {
	type: 'and'
	filters: JsonFilter[] // 内包するフィルタの配列
}

// notフィルター (一つのフィルタ)
interface NotFilter {
	type: 'not'
	filter: JsonFilter // 否定するフィルタ
}

// フィルターの総合型
type JsonFilter = EqualFilter | RangeFilter | OrFilter | AndFilter | NotFilter
