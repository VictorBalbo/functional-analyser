const GITHUB_API =
	'https://api.github.com/search/repositories?per_page=30&s=stars&q=stars%3A>1+language%3A'
const CHART_OPTIONS = {
	type: 'bar',
	options: {
		plugins: {
			beforeDraw(chartInstance: any) {
				const ctx = chartInstance.chart.ctx
				ctx.fillStyle = 'white'
				ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height)
			},
		},
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true,
				},
			}],
		},
	},
}

export {
	GITHUB_API,
	CHART_OPTIONS,
}
