import { searchManyIssuesFactory } from './wrapper'
import { SearchResults, Issue } from './wrapper-types'
import JiraApi from 'jira-client'

const createMockClient = (options: Partial<JiraApi> = {}): JiraApi => options as JiraApi

const createMockIssue = (issueKey: string): Issue => ({
	expand: 'operations,versionedRepresentations,editmeta,changelog,renderedFields',
	id: '10003',
	self: 'https://raelcun.atlassian.net/rest/api/2/issue/10003',
	key: issueKey,
	fields: {
		issuetype: {
			name: 'Story',
			subtask: false,
		},
		issuelinks: [],
	},
})

describe('searchManyIssuesFactory', () => {
	test('should handle more results', async () => {
		const searchJiraFn = jest
			.fn<Promise<SearchResults>, []>()
			.mockResolvedValueOnce({
				expand: '',
				maxResults: 2,
				startAt: 0,
				total: 3,
				issues: [createMockIssue('Issue1'), createMockIssue('Issue2')],
			})
			.mockResolvedValueOnce({
				expand: '',
				maxResults: 2,
				startAt: 2,
				total: 3,
				issues: [createMockIssue('Issue3')],
			})
		const mockClient = createMockClient({ searchJira: searchJiraFn })

		const results = await searchManyIssuesFactory(mockClient)('foo')

		expect(results.map(e => e.key)).toEqual(['Issue1', 'Issue2', 'Issue3'])
	})

	test('should not return more than specified number of results', async () => {
		const searchJiraFn = jest
			.fn<Promise<SearchResults>, []>()
			.mockResolvedValueOnce({
				expand: '',
				maxResults: 2,
				startAt: 0,
				total: 3,
				issues: [createMockIssue('Issue1'), createMockIssue('Issue2')],
			})
			.mockResolvedValueOnce({
				expand: '',
				maxResults: 2,
				startAt: 2,
				total: 3,
				issues: [createMockIssue('Issue3'), createMockIssue('Issue4')],
			})
		const mockClient = createMockClient({ searchJira: searchJiraFn })

		const results = await searchManyIssuesFactory(mockClient)('foo', { getUntil: 3 })

		expect(results.map(e => e.key)).toEqual(['Issue1', 'Issue2', 'Issue3'])
	})
})
