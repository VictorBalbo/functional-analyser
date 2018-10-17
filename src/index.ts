import fs from 'async-file'
import download from 'download-git-repo'
import moment from 'moment'
import fetch from 'node-fetch'
import langs from '../languages.json'
import CONSTANTS from './constants'
import { Language } from './models/Language'
import { getFolder, Repository } from './models/Repository'
import { Analyser } from './Analyser.js'

const getRepos = async (lang: Language) => {
	const url = CONSTANTS.GITHUB_API + encodeURIComponent(lang.name)

	// Get most used repositories by language
	const response = await fetch(url)
	const repos = await response
		.json()
		.then((data) => data.items as Repository[])
	
	let analyser = new Analyser(lang)
	let promises = repos.map(async (repo) => {
		// Check if folder already exists and is up to date
		if (await fs.exists(getFolder(repo))) {
			const folder = await fs.stat(getFolder(repo))
			if (moment(folder.mtime) > moment(repo.pushed_at)) {
				analyser.checkRepo(repo)
				return
			} else {
				fs.delete(getFolder(repo))
			}
		}

		// else, download it
		download(repo.full_name, getFolder(repo), (error: Error) => {
			if (error) {
				console.log(`Error on Repository '${repo.full_name}': `, error.message)
				return
			}
			analyser.checkRepo(repo)
		})
	})
	return Promise.all(promises)
}

const main = async (l: Language[]) => {
	let promises = l.map(async (lang) => await getRepos(lang))
	return Promise.all(promises)
}

(async ()=>{
	await main(langs)
})()
