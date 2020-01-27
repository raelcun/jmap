import JiraClient from 'jira-client'
import { Issue } from './wrapper-types'
import { findIssue, getEpicIssuesFactory, searchManyIssuesFactory } from './wrapper'
import { DescendentList } from './types'

const client = new JiraClient({
	protocol: process.env.JIRA_PROTOCOL,
	host: process.env.JIRA_HOST || '',
	username: process.env.JIRA_USERNAME,
	password: process.env.JIRA_PASSWORD,
})

const doesIssueHaveParentWithLinkType = (issue: Issue, parent: string, linkFilter: string[]): boolean =>
	issue.fields.issuelinks.find(link => linkFilter.includes(link.type.inward) && link.outwardIssue?.key === parent) !==
	undefined

const doesIssueHaveChildWithLinkType = (issue: Issue, linkFilter: string[]): boolean =>
	issue.fields.issuelinks.find(link => linkFilter.includes(link.type.inward) && !!link.inwardIssue) !== undefined

const getAllDescendentsNodeByNode = (client: JiraClient) => async (
	issue: Issue,
	linkFilter: string[]
): Promise<{ [key: string]: Issue }> => {
	let issuesWithProperLinks: Issue[] = []
	if (issue.fields.issuetype.name === 'Epic') {
		issuesWithProperLinks = await getEpicIssuesFactory(client)(issue.key)
	} else {
		const linkedIssues = await searchManyIssuesFactory(client)(`issue in linkedIssues("${issue.key}")`)
		issuesWithProperLinks = linkedIssues.filter(linkedIssue =>
			doesIssueHaveParentWithLinkType(linkedIssue, issue.key, linkFilter)
		)
	}

	const issuesNeedingRecursiveCall = issuesWithProperLinks.filter(linkedIssue =>
		doesIssueHaveChildWithLinkType(linkedIssue, linkFilter)
	)
	const issuesNotNeedingRecursiveCall = issuesWithProperLinks.filter(
		e => !issuesNeedingRecursiveCall.find(f => f.key === e.key)
	)
	const recursiveCalls = await Promise.all(
		issuesNeedingRecursiveCall.map(descendent => getAllDescendentsNodeByNode(client)(descendent, linkFilter))
	)

	const result = { [issue.key]: issue }

	issuesNotNeedingRecursiveCall.forEach(e => (result[e.key] = e))
	recursiveCalls.forEach(e => Object.values(e).forEach(f => (result[f.key] = f)))

	return result
}

const getAllDescendentsByEpic = (client: JiraClient) => async (issue: Issue): Promise<{ [key: string]: Issue }> => {
	const epicIssues = await getEpicIssuesFactory(client)(issue.key)

	const result = { [issue.key]: issue }
	epicIssues.forEach(e => (result[e.key] = e))
	return result
}

export const getAllDescendents = async (
	issueNumber: string,
	strategy: 'epic' | 'node' = 'node',
	linkFilter = ['is blocked by']
): Promise<DescendentList> => {
	const issue = await findIssue(client)(issueNumber)

	const result =
		strategy === 'epic'
			? await getAllDescendentsByEpic(client)(issue)
			: await getAllDescendentsNodeByNode(client)(issue, linkFilter)
	delete result[issueNumber]

	return {
		root: issue,
		descendents: result,
	}
}

const makeMermaid = (graph: DescendentList, linkFilter: string[]): string => {
	const relationships = Object.entries(graph.descendents).map(([, value]) => {
		return value.fields.issuelinks
			.filter(link => linkFilter.includes(link.type.inward) && link.outwardIssue !== undefined)
			.map(link => `${link.outwardIssue?.key} --> ${value.key}`)
	})
	const flattenedRelationships = ([] as string[]).concat(...relationships)
	return ['graph TD', ...flattenedRelationships, ...Object.keys(graph.descendents)].join('\r\n')
}

export const getAllDescendentsAsMermaidMarkup = async (issueNumber: string, strategy: 'epic' | 'node' = 'node') => {
	const linkFilter = ['is blocked by']
	return getAllDescendents(issueNumber, strategy, linkFilter).then(results => makeMermaid(results, linkFilter))
}
