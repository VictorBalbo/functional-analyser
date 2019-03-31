import fs from 'async-file'
import download from 'download-git-repo'
import moment from 'moment'
import fetch from 'node-fetch'
import langs from '../languages.json'
import { Analyser } from './Analyser.js'
import CONSTANTS from './constants'
import { CreateDiagram, Language } from './models/Language'
import { getFolderPath, Repository } from './models/Repository'

const getRepos = async (lang: Language) => {
	const url = CONSTANTS.GITHUB_API + encodeURIComponent(lang.name)
	// Save language diagram
	const diagram = CreateDiagram(lang)
	await fs.writeTextFile(`Diagrams/${lang.name}.dot`, diagram, 'utf8')

	// Get most used repositories by language
	const response = await fetch(url)
	const repos = await response
		.json()
		.then((data) => data.items as Repository[])

	const analyser = new Analyser(lang)
	const promises = repos.map(async (repo) => {
		// Check if folder already exists and is up to date
		const repoFolderPath = getFolderPath(repo)
		if (await fs.exists(repoFolderPath)) {
			const folder = await fs.stat(repoFolderPath)
			if (moment(folder.mtime) > moment(repo.pushed_at)) {
				const calculatedRepo = await analyser.checkRepo(repo)
				console.log(`${repo.name}: ${calculatedRepo.totalFiles} files and ${calculatedRepo.lamdasPerFile} lambdas`)
				return
			} else {
				fs.delete(repoFolderPath)
			}
		}

		// else, download it
		// download(repo.full_name, repoFolderPath, (error: Error) => {
		// 	if (error) {
		// 		console.log(`Error on Repository '${repo.full_name}': `, error.message)
		// 		return
		// 	}
		// 	analyser.checkRepo(repo)
		// })
	})
	return Promise.all(promises)
}

const main = async (l: Language[]) => {
	const promises = l.map(async (lang) => await getRepos(lang))
	return Promise.all(promises)
}

(async () => {
	await main(langs)
})()
