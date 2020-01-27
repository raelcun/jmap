import React, { useState, useEffect } from 'react'
import Mermaid from './Mermaid'

const JiraGraph: React.FC<{ issueOrEpic: string }> = ({ issueOrEpic }) => {
	const [markup, setMarkup] = useState('')

	useEffect(() => {
		let didCancel = false

		const setMermaidMarkup = async () => {
			const markup = await fetch(process.env.SERVER + '/api/getMermaidDependencies/' + issueOrEpic).then(result =>
				result.text()
			)

			if (!didCancel) {
				setMarkup(markup)
			}
		}

		if (!!issueOrEpic) {
			setMermaidMarkup()
		}
		return () => {
			didCancel = true
		}
	}, [issueOrEpic])

	return <Mermaid chartMarkup={markup} />
}

export default JiraGraph
