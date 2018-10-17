import fs from 'async-file'
import path from 'path'
import { Repository, getFolder } from './models/Repository'
import { Language } from './models/Language'

export class Analyser {
	lang: Language
	lambdas: number

	constructor(_lang: Language) {
		this.lang = _lang
		this.lambdas = 0
	}

	async checkRepo(repo: Repository) {
		let traverseFileSystem = async (currentPath: string) => {
			let files = await fs.readdir(currentPath)
			let promises = files.map(async (file) => {
				let currentFile = currentPath + '/' + file
				let stats = await fs.stat(currentFile)
				if (stats.isFile()) {
					let fileExt = path.extname(currentFile)
					if (fileExt && this.lang.extensions.indexOf(fileExt) != -1)
						await this.checkFile(currentFile)
				} else if (stats.isDirectory()) {
					await traverseFileSystem(currentFile)
				}
			})
			return Promise.all(promises)
		}
		await traverseFileSystem(getFolder(repo))
		return this.lambdas
	}

	async checkFile(filePath: string) {
		let file = (await fs.readFile(filePath, 'utf8')) as string
		file = file.replace(/\s/, ' ')
		let currentState = this.lang.grammar.initial

		for (let i = 0; i < file.length; i++) {
			let c = file.charAt(i)
			let nextState = this.lang.grammar.transitions.find(
				(t) =>
					t[0] === currentState &&
					file.substr(i, t[1].length) === t[1],
			)
			if (nextState) {
				currentState = nextState[2]
				i += nextState[1].length - 1
				if (nextState[0] === this.lang.grammar.lambda) {
					this.lambdas++
				}
			}
		}
	}
}
