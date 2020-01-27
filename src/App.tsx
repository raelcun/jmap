import React, { useState } from 'react'
import JMapForm from './components/JMapForm'
import JiraGraph from './components/JiraGraph'

const App: React.FC = () => {
	const [issueOrEpic, setIssueOrEpic] = useState('')

	const handleSubmit = (issueNumber: string) => {
		setIssueOrEpic(issueNumber)
	}

	// const [result, setResult] = useState('')

	// useEffect(() => {
	// 	fetch('/api/foo')
	// 		.then(result => result.text())
	// 		.then(result => setResult(result))
	// }, [])

	return (
		<>
			{/* {result} */}
			<JMapForm onSubmit={handleSubmit} />
			<JiraGraph issueOrEpic={issueOrEpic} />
		</>
	)
}

export default App
