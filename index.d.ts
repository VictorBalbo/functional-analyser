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

declare module 'cli-progress' {
    export class SingleBar extends GenericBar {
        constructor(options: any, presets: any);
        start(total: number, startValue: number, payload?: any): void;
    }
    export class MultiBar extends GenericBar {
        constructor(options: any, presets: any);
        create(total: number, startValue: number, payload?: any): SingleBar;
    }
    class GenericBar {
        update(current: number, payload?: any): void;
        increment(step?: number, payload?: any): void;
        stop(): void;
    }
    module Presets {
        export const shades_classic: any
    } 
}

declare module "*.json" {
    const value: any;
    export default value;
}