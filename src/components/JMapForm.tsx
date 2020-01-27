import React, { useState } from 'react'
import { Button, TextField } from '@material-ui/core'

const JMapForm: React.FC<{ onSubmit: (issueNumber: string) => void }> = ({ onSubmit }) => {
	const [issueNumber, setIssueNumber] = useState('')
	const handleSubmit = () => {
		if (!!issueNumber) {
			onSubmit(issueNumber)
		}
	}

	return (
		<>
			<TextField required label='issue or epic' onChange={event => setIssueNumber(event.target.value)} />
			<Button variant='contained' color='primary' onClick={handleSubmit}>
				Submit
			</Button>
		</>
	)
}

export default JMapForm
