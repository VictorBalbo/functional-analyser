import fs from 'async-file'
import path from 'path'
import { Repository, getFolder } from './models/Repository'
import { Language } from './models/Language'

export class Analyser {
	lang: Language

	constructor(_lang: Language) {
		this.lang = _lang
	}

	async checkRepo(repo: Repository) {
		let traverseFileSystem = async (currentPath: string) => {
			let files = await fs.readdir(currentPath)
			files.forEach(async (file) => {
				let currentFile = currentPath + '/' + file
				let stats = await fs.stat(currentFile)
				if (stats.isFile()) {
					let fileExt = path.extname(currentFile)
					if (fileExt && this.lang.extensions.indexOf(fileExt) != -1)
						this.checkFile(currentFile)
				} else if (stats.isDirectory()) {
					traverseFileSystem(currentFile)
				}
			})
		}
		traverseFileSystem(getFolder(repo))
	}

	checkFile(file: string) {
		console.log(file)
	}
}
