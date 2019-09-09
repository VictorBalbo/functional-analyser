import ChartjsNode from 'chartjs-node'
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
			return `${color}\n\t${t[0]} -> ${t[2]} [label=${JSON.stringify(t[1] === '\n' ? '\\n' : t[1])}]`
		})
		.join('')
	diagram += '\n}'
	return diagram
}

export const CreateMetricsGraphic = async (lang: Language) => {
	const chartJsOptions = {
		...CHART_OPTIONS,
		data: {
			labels: lang.repositories.map((r) => r.name),
			datasets: [
				{
					label: 'Total Lambdas',
					data: lang.repositories.map((r) => (r.lambdasTotal / lang.lambdasTotal) * 100),
					backgroundColor: 'rgba(0, 0, 255, 0.5)',
					borderColor: 'rgba(0, 0, 255, 1)',
					borderWidth: 1,
				},
				{
					label: 'Lambdas Per File',
					data: lang.repositories.map((r) => (r.avgLambdasPerFile / lang.avgLambdasPerFile) * 100),
					backgroundColor: 'rgba(0, 255, 0, 0.5)',
					borderColor: 'rgba(0, 255, 0, 1)',
					borderWidth: 1,
				},
				{
					label: 'Lambdas Per Valid File',
					data: lang.repositories.map((r) => (r.avgLambdasPerValidFile / lang.avgLambdasPerValidFile) * 100),
					backgroundColor: 'rgba(255, 0, 0, 0.5)',
					borderColor: 'rgba(255, 0, 0, 1)',
					borderWidth: 1,
				},
			],
		},
	}
	const chartNode = new ChartjsNode(800, 600)
	await chartNode.drawChart(chartJsOptions)
	await chartNode.writeImageToFile('image/png', `./Diagrams/${lang.name}.png`)
	chartNode.destroy()
}
