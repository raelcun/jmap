import React, { useState, useEffect } from 'react'
import mermaid from 'mermaid'

type MermaidProps = {
	chartMarkup: string
}

mermaid.mermaidAPI.initialize({
	startOnLoad: true,
	// mermaid temporarily adds graph to the root document (which uses the Roboto font from Material)
	// so render with the Roboto font since that's what was used for the size measurements
	...{ themeCSS: '.label { font-family: Roboto; }' },
})

const Mermaid: React.FC<MermaidProps> = ({ chartMarkup }) => {
	const [svg, setSvg] = useState('graph TD;')
	const [message, setMessage] = useState<string | undefined>('No Content')

	useEffect(() => {
		if (!!chartMarkup && chartMarkup !== 'graph TD;') {
			setMessage(undefined)
			mermaid.render('myDiagram', chartMarkup, svg => setSvg(svg))
		} else {
			setMessage('No Content')
		}
	}, [chartMarkup])

	return message !== undefined ? (
		<div>{message}</div>
	) : (
		<div className='mermaid' dangerouslySetInnerHTML={{ __html: svg }}></div>
	)
}

export default Mermaid
