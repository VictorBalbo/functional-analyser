const GITHUB_API =
	'https://api.github.com/search/repositories?per_page=50&s=stars&q=stars%3A>1+language%3A'
const CHART_OPTIONS = {
	plugins: {
		beforeDraw(chartInstance: any) {
			const ctx = chartInstance.chart.ctx
			ctx.fillStyle = 'white'
			ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height)
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
}

export {
	GITHUB_API,
	CHART_OPTIONS,
}
