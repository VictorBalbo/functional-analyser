import { Metrics } from './Metrics'

export interface Repository extends Metrics {
	default_branch?: string
	full_name?: string
	language?: string
	name?: string
	pushed_at?: Date
	clone_url: string

	// Computed properties
	lamdasPerFiles: number[]
	totalFiles: number
}
export const getFolderPath = (repo: Repository) =>
	`./Repositories/${repo.language}/${repo.name}`

export const calculateMetrics = (repo: Repository) => {
	repo.lambdasTotal = repo.lamdasPerFiles.reduce((accumulator, value) => accumulator + value, 0)
	repo.avgLambdasPerFile = repo.lambdasTotal / repo.totalFiles
	repo.filesWithLambda = repo.lamdasPerFiles.length
	repo.avgLambdasPerValidFile = repo.lambdasTotal / repo.filesWithLambda

	// console.log(`${repo.language} - ${repo.name}: ${repo.totalFiles} files, ${repo.filesWithLambda} valid files, ${repo.lambdasTotal} total lambdas, ${repo.avgLambdasPerFile.toFixed(2)} lambdas per file, ${repo.avgLambdasPerValidFile.toFixed(2)} lambdas per valid file.`)
	return repo
}
