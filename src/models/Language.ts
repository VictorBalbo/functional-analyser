import ChartjsNode from 'chartjs-node'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { CHART_OPTIONS } from '../constants'
import { Metrics } from './Metrics'
import { Repository } from './Repository'

export interface Language extends Metrics {
	/** Language Name */
	name: string
	/** Language Grammar to be analysed */
	grammar: Grammar
	/** File extensions to be analysed */
	extensions: string[]

	repositories: Repository[]
}

interface Grammar {
	/** Initial state */
	initial: string
	/** Lambda State */
	lambda: string
	/** Grammar transitions */
	transitions: string[][]
}

export const CreateDiagram = ({ name, grammar }: Language) => {
	let diagram = `digraph "AFER" {
	_nil0 [style="invis"]
	_nil0 -> ${grammar.initial} [label=""]
	${grammar.initial} [peripheries=2]`
	diagram += grammar.transitions
		.map((t) => {
			let color = ''
			if (t[0] === grammar.lambda) {
				color = `\n\t${t[0]} [color="red"]`
			}
			return `${color}\n\t${t[0]} -> ${t[2]} [label=${JSON.stringify(
				t[1] === '\n' ? '\\n' : t[1],
			)}]`
		})
		.join('')
	diagram += '\n}'
	return diagram
}

export const CreateMetricsGraphic = async (lang: Language) => {
	// Used just to validate lib import
	await ChartDataLabels
	const chartJsOptions = {
		type: 'bar',
		options: {
			...CHART_OPTIONS,
			title: {
				display: true,
				text: lang.name,
				position: 'bottom',
			},
		},
		data: {
			labels: lang.repositories.map((r) => r.name),
			totalLambdas: lang.repositories.map((r) => r.totalFiles),
			datasets: [
				{
					label: 'Arquivos com utilização de Lambdas',
					data: lang.repositories.map(
						(r) => Math.ceil((r.filesWithLambda / r.totalFiles) * 100),
					),
					backgroundColor: 'rgba(0, 0, 255, 0.5)',
					borderColor: 'rgba(0, 0, 255, 1)',
					borderWidth: 1,
					stack: 'Stack 1',
				},
				{
					label: 'Arquivos sem utilização de Lambdas',
					data: lang.repositories.map(
						(r) => Math.floor((1 - r.filesWithLambda / r.totalFiles) * 100),
					),
					backgroundColor: 'rgba(255, 0, 0, 0.5)',
					borderColor: 'rgba(255, 0, 0, 1)',
					borderWidth: 1,
					stack: 'Stack 1',
				},
			],
		},
	}
	const chartNode = new ChartjsNode(1000, 600)
	await chartNode.drawChart(chartJsOptions)
	await chartNode.writeImageToFile('image/png', `./Diagrams/${lang.name}.png`)
	chartNode.destroy()
}
