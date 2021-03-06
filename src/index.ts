import exec from 'await-exec'
import { Presets, SingleBar } from 'cli-progress'
import fs from 'fs-extra'
import gitDownloader from 'git-downloader'
import moment from 'moment'
import fetch from 'node-fetch'
import Semaphore from 'semaphore-async-await'
import langs from '../languages.json'
import { Analyser } from './Analyser.js'
import { GITHUB_API } from './constants'
import { CreateDiagram, CreateMetricsGraphic, Language } from './models/Language'
import { calculateMetrics, getFolderPath, Repository } from './models/Repository'

const getRepos = async (lang: Language) => {
	const url = GITHUB_API + encodeURIComponent(lang.name)

	// Get most used repositories by language
	const response = await fetch(url)
	const repos = await response
		.json()
		.then((data) => data.items as Repository[])

	const analyser = new Analyser(lang)

	const progressBar = new SingleBar({}, Presets.shades_classic)
	progressBar.start(50, 0)

	const repoPromises = repos.map(async (repo) => {
		try {
			// Check if folder already exists and is up to date
			const repoFolderPath = getFolderPath(repo)
			if (await fs.pathExists(repoFolderPath)) {
				const folder = await fs.stat(repoFolderPath)
				if (moment(folder.mtime) > moment(repo.pushed_at)) {
					const computedRepository = await analyser.checkRepo(repo)

					progressBar.increment()
					return calculateMetrics(computedRepository)
				} else {
					console.log(`Removing ${repo.name}`)
					await fs.remove(repoFolderPath)
				}
			}

			// else, download it
			try {
				// console.log(`Downloading ${repo.name}`)
				await gitDownloader({ source: repo.clone_url, destination: repoFolderPath})
			} catch (e) {
				await fs.remove(repoFolderPath)
				console.log(`Error on downloading Repository '${repo.full_name}'`, e)
			}
			const computedRepo = await analyser.checkRepo(repo)

			progressBar.increment()
			return calculateMetrics(computedRepo)
		} catch (e) {
			console.log(`Error on processing Repository '${repo.full_name}'`, e)
		}
	})
	const computedRepos = await Promise.all(repoPromises)
	lang.repositories = computedRepos.filter((r) => r !== undefined) as Repository[]
	lang.repositories.forEach((r) => {
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
	progressBar.stop()
	CreateMetricsGraphic(lang)
}

const main = async (l: Language[], diagramsOnly: boolean = false) => {
	const lock = new Semaphore(1)
	const promises = l.map(async (lang) => {
		try {
			await lock.acquire()
			console.log(`Start processing ${lang.name}`)

			// Save language diagram
			const diagram = CreateDiagram(lang)
			await fs.writeFile(`Diagrams/${lang.name}.dot`, diagram, { encoding: 'utf8' })
			await exec(`dot -Tpng -o Diagrams/${lang.name}-Diagram.png Diagrams/${lang.name}.dot`)
			console.log(`Saved diagram for ${lang.name}`)
			// Process repository if needed
			if (!diagramsOnly) {
				await getRepos(lang)
			}
			console.log(`Finished processing ${lang.name}`)
		} catch (e) {
			console.log(`Error getting repository for ${lang.name}`, e)
		} finally {
			lock.release()
		}
	})
	return Promise.all(promises)
}

(async () => {
	const diagramsOnly = process.argv.includes('-d')
	await main(langs, diagramsOnly)
})()
