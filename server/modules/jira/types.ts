import { Issue } from './wrapper-types'

export type DescendentList = {
	root: Issue
	descendents: { [key: string]: Issue }
}
