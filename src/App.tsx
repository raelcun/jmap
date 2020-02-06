import React, { useState } from 'react'
import JMapForm from './components/JMapForm'
import JiraGraph from './components/JiraGraph'
import '@material-ui/core'

const App: React.FC = () => {
	const [issueOrEpic, setIssueOrEpic] = useState('')

	const handleSubmit = (issueNumber: string) => {
		setIssueOrEpic(issueNumber)
	}

	return (
		<>
			<JMapForm onSubmit={handleSubmit} />
			<JiraGraph issueOrEpic={issueOrEpic} />
		</>
	)
}

export default App
