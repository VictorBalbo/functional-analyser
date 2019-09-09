declare module 'chartjs-node' {
    class ChartjsNode {
        /**
         * Creates an instance of ChartjsNode.
         * @param {number} width The width of the chart canvas.
         * @param {number} height The height of the chart canvas.
         */
        constructor(width: number, height: number, devicePixelRatio?: number);

        /**
         * Draws the chart given the Chart.js configuration
         */
        drawChart({}) : Promise<void>

        /**
         * Writes chart to a file
         */
        writeImageToFile(imageType: string, filePath: string): Promise<void>

        /**
         * Destroys the virtual DOM and canvas -- releasing any native resources
         */
        destroy(): void
    }
    export = ChartjsNode
}
declare module 'git-downloader' {
    const download: ({}: {source: string, destination: string}) => Promise<void>
    export = download
}

declare module 'await-exec' {
    const exec: (command: string, options?: {log: boolean, cwd: any}) => Promise<void>
    export = exec
}

declare module "*.json" {
    const value: any;
    export default value;
}