export interface Repository {
	default_branch?: string
	full_name?: string
	language?: string
	name?: string
	pushed_at?: Date
}
export const getFolderPath = (repo: Repository) => `./Repositories/${repo.language}/${repo.name}`