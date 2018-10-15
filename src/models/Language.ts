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
	transitions: string[]
}
