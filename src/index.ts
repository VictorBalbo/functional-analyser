import download from 'download-git-repo'
import fs from 'fs-extra'
import moment from 'moment'
import fetch from 'node-fetch'
import langs from '../languages.json'
import { Analyser } from './Analyser.js'
import { GITHUB_API } from './constants'
import { CreateDiagram, CreateMetricsGraphic, Language } from './models/Language'
import { calculateMetrics, getFolderPath, Repository } from './models/Repository'

const getRepos = async (lang: Language) => {
	const url = GITHUB_API + encodeURIComponent(lang.name)
	// Save language diagram
	const diagram = CreateDiagram(lang)
	await fs.writeFile(`Diagrams/${lang.name}.dot`, diagram, { encoding: 'utf8' })

	// Get most used repositories by language
	const response = await fetch(url)
	const repos = await response
		.json()
		.then((data) => data.items as Repository[])

	const analyser = new Analyser(lang)
	const repoPromises = repos.map(async (repo) => {
		// Check if folder already exists and is up to date
		const repoFolderPath = getFolderPath(repo)
		if (await fs.pathExists(repoFolderPath)) {
			const folder = await fs.stat(repoFolderPath)
			if (moment(folder.mtime) > moment(repo.pushed_at)) {
				const computedRepo = await analyser.checkRepo(repo)
				return calculateMetrics(computedRepo)
			} else {
				await fs.remove(repoFolderPath)
			}
		}

		// else, download it
		return new Promise((resolve, reject) => {
			download(repo.full_name, repoFolderPath, async (error: Error) => {
				if (error) {
					await fs.remove(repoFolderPath)
					console.log(`Error on downloading Repository '${repo.full_name}': `)
					resolve()
				} else {
					const computedRepo = await analyser.checkRepo(repo)
					resolve(calculateMetrics(computedRepo))
				}
			})
		})
	})
	const computedRepos = await Promise.all(repoPromises)
	lang.repositories = computedRepos.filter((r) => r !== undefined) as Repository[]
	lang.repositories.map((r) => {
		if (!lang.avgLambdasPerFile || r.avgLambdasPerFile > lang.avgLambdasPerFile) {
			lang.avgLambdasPerFile = r.avgLambdasPerFile
		}
		if (!lang.avgLambdasPerValidFile || r.avgLambdasPerValidFile > lang.avgLambdasPerValidFile) {
			lang.avgLambdasPerValidFile = r.avgLambdasPerValidFile
		}
		if (!lang.lambdasTotal || r.lambdasTotal > lang.lambdasTotal) {
			lang.lambdasTotal = r.lambdasTotal
		}
		if (!lang.filesWithLambda || r.filesWithLambda > lang.filesWithLambda) {
			lang.filesWithLambda = r.filesWithLambda
		}
	})
	CreateMetricsGraphic(lang)
}

const main = async (l: Language[]) => {
	const promises = l.map(async (lang) => await getRepos(lang))
	return Promise.all(promises)
}

(async () => {
	await main(langs)
})()
