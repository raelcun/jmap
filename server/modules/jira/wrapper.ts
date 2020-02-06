import JiraClient, { SearchQuery } from 'jira-client'
import { SearchResults, Issue } from './wrapper-types'

export const searchJira = (baseClient: JiraClient) => (
	searchString: string,
	options?: SearchQuery
): Promise<SearchResults> => baseClient.searchJira(searchString, options) as Promise<SearchResults>

export const findIssue = (baseClient: JiraClient) => (issueNumber: string): Promise<Issue> =>
	baseClient.findIssue(issueNumber) as Promise<Issue>

export const getEpicIssuesFactory = (baseClient: JiraClient) => (epic: string) =>
	searchManyIssuesFactory(baseClient)(`"epic link"=${epic}`)

export const searchManyIssuesFactory = (baseClient: JiraClient) => async (
	searchString: string,
	options: SearchQuery & { getUntil: number } = { getUntil: 500 }
): Promise<Issue[]> => {
	const { getUntil, ...searchOptions } = options
	const results = await searchJira(baseClient)(searchString, searchOptions)

	if (results.startAt + results.issues.length >= getUntil) return results.issues.slice(0, getUntil - results.startAt)
	if (results.startAt + results.issues.length >= results.total) return results.issues

	const moreResults = await searchManyIssuesFactory(baseClient)(searchString, {
		...options,
		startAt: results.startAt + results.issues.length,
	})
	return [...results.issues, ...moreResults]
}
