export interface Language {
	/** Language Name */
	name: string
	/** Language Gramatic to be analysed */
	gramatic?: string
	/** File extensions to be analysed */
	extensions?: string[]

	// constructor(name: string, gramatic?: string) {
	// 	this.name = name
	// 	this.gramatic = gramatic
	// }
}
