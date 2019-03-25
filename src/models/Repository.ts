export interface Repository {
	default_branch?: string
	full_name?: string
	language?: string
	name?: string
	pushed_at?: Date

	// Computed properties
	lamdasPerFile?: number[]
	totalFiles?: number
}
export const getFolderPath = (repo: Repository) => `./Repositories/${repo.language}/${repo.name}`