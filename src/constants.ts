const GITHUB_API =
	'https://api.github.com/search/repositories?per_page=50&s=stars&q=stars%3A>1+language%3A'
const CHART_OPTIONS = {
	plugins: {
		beforeDraw(chartInstance: any) {
			const ctx = chartInstance.chart.ctx
			ctx.fillStyle = 'white'
			ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height)
		},
		datalabels: {
			align: 'end',
			anchor: 'end',
			color: 'black',
			rotation: -45,
			formatter: (value: any, context: any) => {
				console.log(value)
				if (context.dataset.label === 'Arquivos sem utilização de Lambdas') {
					return Math.round(context.chart.data.totalLambdas[context.dataIndex])
				}
				return null
			},
		},
		annotation: {
			annotations: [{
				label: {
					content: 'Media',
					enabled: true,
				},
				type: 'line',
				mode: 'horizontal',
				borderColor: 'black',
				borderWidth: 5,

			}]
		},
	},
	scales: {
		xAxes: [{
			stacked: true,
			scaleLabel: {
				display: false,
				labelString: 'Repositórios',
			},
		}],
		yAxes: [{
			stacked: true,
			ticks: {
				beginAtZero: true,
			},
			scaleLabel: {
				display: true,
				labelString: 'Porcentagem',
			},
		}],
	},
	layout: {
		padding: {
			top: 45,
		},
	},
	legend: {
		position: 'bottom',
	},
}

export {
	GITHUB_API,
	CHART_OPTIONS,
}
