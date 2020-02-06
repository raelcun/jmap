import express from 'express'
import { join } from 'path'
import { getAllDescendentsAsMermaidMarkup } from './modules/jira'

const app = express()
const port = process.env.PORT || 4000

app.use(express.static(join(__dirname, '../build')))

app.get('/api/getMermaidDependencies/:issueOrEpic', async (req, res) => {
	await getAllDescendentsAsMermaidMarkup(req.params.issueOrEpic)
		.then(result => {
			console.log(result)
			res.send(result)
		})
		.catch(e => {
			console.error(e)
			res.sendStatus(500)
		})
})

app.listen(port, () => console.log(`Listening on port ${port}`))
