export type IssueLink = {
	id: string
	self: string
	type: {
		id: string
		self: string
		name: string
		inward: string
		outward: string
	}
	outwardIssue?: {
		key: string
		[key: string]: any
	}
	inwardIssue?: {
		key: string
		[key: string]: any
	}
}

export type Issue = {
	expand: string
	id: string
	self: string
	key: string
	fields: {
		issuetype: {
			name: string
			subtask: boolean
			[key: string]: any
		}
		issuelinks: IssueLink[]
		[key: string]: any
	}
}

export type SearchResults = {
	expand: string
	startAt: number
	maxResults: number
	total: number
	issues: Issue[]
}
