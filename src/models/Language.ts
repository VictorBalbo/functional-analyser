export interface Language {
	/** Language Name */
	name: string
	/** Language Grammar to be analysed */
	grammar: Grammar
	/** File extensions to be analysed */
	extensions: string[]
}

interface Grammar {
	/** States of the grammar */
	states: string[]
	/** Initial state */
	initial: string
	/** Lambda State */
	lambda: string
	/** Grammar transitions */
	transitions: string[][]
}

export const CreateDiagram = ({ name, grammar }: Language) => {
	let diagram = `digraph "AFER" {
	_nil0 [style="invis"]
	_nil0 -> ${grammar.initial} [label=""]
	${grammar.initial} [peripheries=2]`
	diagram += grammar.transitions.map((t) => {
		let color = ''
		if (t[0] === grammar.lambda) {
			color = `\n\t${t[0]} [color="red"]`
		}
		return `${color}\n\t${t[0]} -> ${t[2]} [label=${JSON.stringify(t[1])}]`
	}).join('')
	diagram += '\n}'
	return diagram
}