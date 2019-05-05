import fs from 'fs-extra'
import path from 'path'
import { Language } from './models/Language'
import { getFolderPath, Repository } from './models/Repository'

export class Analyser {
	public lang: Language

	constructor(lang: Language) {
		this.lang = lang
	}

	public async checkRepo(repo: Repository): Promise<Repository> {
		const repoFolder = getFolderPath(repo)
		const computedLambdas = await this.checkFolder(
			repoFolder,
			this.lang.extensions,
		)
		return {
			...repo,
			totalFiles: computedLambdas.length,
			lamdasPerFiles: computedLambdas.filter((l) => l > 0),
		}
	}

	public async checkFolder(
		currentPath: string,
		extensions: string[],
	): Promise<number[]> {
		const files = await fs.readdir(currentPath)
		// Iterate over each 'file' in folder
		const promises = files.map(async (file) => {
			const currentFile = currentPath + '/' + file
			const stats = await fs.stat(currentFile)

			// Check if 'file' is really a file
			if (stats.isFile()) {
				const fileExt = path.extname(currentFile)

				// If is a file and has correct extension, check file
				if (fileExt && extensions.indexOf(fileExt) !== -1) {
					return this.checkFile(currentFile)
				}
				// If is a directory, check the directory
			} else if (stats.isDirectory()) {
				return this.checkFolder(currentFile, extensions)
			}
			return [-1]
		})
		const lambdas = await Promise.all(promises)
		return lambdas
			.reduce((accumulator, value) => accumulator.concat(value), [])
			.filter((n) => n > -1)
	}

	public async checkFile(filePath: string): Promise<number[]> {
		let lambdasInFile = 0
		let file = (await fs.readFile(filePath, 'utf8')) as string
		file = file.replace(/\s/, ' ')
		let currentState = this.lang.grammar.initial

		for (let i = 0; i < file.length; i++) {
			// Get a possible transition from current state with current char
			const nextState = this.lang.grammar.transitions.find(
				(t) =>
					t[0] === currentState &&
					file.substr(i, t[1].length) === t[1],
			)
			// If found any, go to next state
			if (nextState) {
				currentState = nextState[2]

				// As this is an AFN, its possible a transition to have multiple chars
				i += nextState[1].length - 1

				// If found a lambda defined by grammar, incremment counter
				if (nextState[0] === this.lang.grammar.lambda) {
					lambdasInFile++
				}
			}
		}
		return [lambdasInFile]
	}
}
