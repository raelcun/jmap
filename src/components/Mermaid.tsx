import React, { useState, useEffect } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
	startOnLoad: false,
})

type MermaidProps = {
	chartMarkup: string
}

const Mermaid: React.FC<MermaidProps> = ({ chartMarkup }) => {
	const [svg, setSvg] = useState('')

	useEffect(() => {
		if (!!chartMarkup) {
			mermaid.render('myDiagram', chartMarkup, svg => setSvg(svg))
		}
	}, [chartMarkup])

	return <div className='mermaid' dangerouslySetInnerHTML={{ __html: svg }}></div>
}

export default Mermaid
