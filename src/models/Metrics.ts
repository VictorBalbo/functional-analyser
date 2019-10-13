export interface Metrics {
	/** Total number of Lambdas */
	lambdasTotal: number
	/** Total number of files with Lambdas */
	filesWithLambda: number
	/** Ammount of Lambdas per file with more the 1 lambda */
	avgLambdasPerValidFile: number
	/** Ammount of Lambdas per file */
	avgLambdasPerFile: number
}