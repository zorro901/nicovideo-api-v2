export type ThreadRequestBody = {
	params: {
		targets: {
			id: string
			fork: 'owner' | 'main' | 'easy'
		}[]
		language: 'ja-jp'
	}
	threadKey: string
	additionals: Record<string | number | symbol, never>
}

export type ThreadResponse = {
	meta: {
		status: number
	}
	data: {
		globalComments: {
			id: string
			count: number
		}[]
		threads: Thread[]
	}
}

type Thread = {
	id: number
	fork: 'owner' | 'main' | 'easy'
	commentCount: number
	comments: {
		id: string
		no: number
		vposMs: number
		body: string
		commands: string[]
		userId: string
		isPremium: boolean
		score: number
		postedAt: string
		nicoruCount: number
		nicoruId: string | null
		source: 'trunk' | 'leaf' | 'nicoru'
		isMyPost: boolean
	}[]
}
