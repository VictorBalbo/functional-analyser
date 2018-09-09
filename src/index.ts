import fs from 'async-file'
import download from 'download-git-repo'
import moment from 'moment'
import fetch from 'node-fetch'
import langs from '../languages.json'
import CONSTANTS from './constants'
import { Language } from './models/Language'
import { getFolder, Repository } from './models/Repository'

const checkGramatics = (error: Error, repo: Repository) => {
	if (error) {
		console.log(error.message)
		return
	}
	/// TODO: Implement gramatic checker
}

const getRepos = async (lang: Language) => {
	const url = CONSTANTS.GITHUB_API + encodeURIComponent(lang.name)

	// Get most used repositories by language
	const response = await fetch(url)
	const repos = await response
		.json()
		.then((data) => data.items as Repository[])

	repos.map(async (repo) => {
		// Check if folder already exists and is up to date
		if (await fs.exists(getFolder(repo))) {
			const folder = await fs.stat(getFolder(repo))
			if (moment(folder.mtime) > moment(repo.pushed_at)) {
				console.log('Existe', repo.name)
				return
			}
		}
		console.log('Nao Existe', repo.name)

		// else, download it
		download(repo.full_name, getFolder(repo), (error: Error) => {
			checkGramatics(error, repo)
		})
	})
}

const main = async (l: Language[]) => {
	l.map((lang) => getRepos(lang))
}

main(langs)
