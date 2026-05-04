export class BaseMapping {
    config;
    constructor(config) {
        this.config = {
            clamp: true,
            outMin: 0,
            outMax: 1,
            ...config
        };
    }
    applyCurve(normalized) {
        const val = Math.max(0, Math.min(1, normalized));
        switch (this.config.curve) {
            case 'exponential':
                // Mapping [0, 1] to [0, 1] with exponential curve
                // (exp(x) - 1) / (exp(1) - 1)
                return (Math.exp(val) - 1) / (Math.E - 1);
            case 'logarithmic':
                // log(x + 1) / log(2)
                return Math.log1p(val) / Math.LN2;
            case 'linear':
            default:
                return val;
        }
    }
    lerp(normalized) {
        const min = this.config.outMin;
        const max = this.config.outMax;
        return min + normalized * (max - min);
    }
}
export class StaticMapping extends BaseMapping {
    staticConfig;
    constructor(config) {
        super(config);
        this.staticConfig = config;
    }
    map(value) {
        const { inMin, inMax, clamp } = this.staticConfig;
        let normalized = (value - inMin) / (inMax - inMin);
        if (clamp) {
            normalized = Math.max(0, Math.min(1, normalized));
        }
        return this.lerp(this.applyCurve(normalized));
    }
}
export class DynamicMapping extends BaseMapping {
    dynamicConfig;
    samples = [];
    mean = 0;
    stdDev = 0;
    currentMin;
    currentMax;
    constructor(config) {
        super(config);
        this.dynamicConfig = {
            warmupSamples: 30,
            windowSize: 100,
            sensitivity: 2,
            outOfRange: 'expand',
            ...config
        };
        this.currentMin = config.startRange[0];
        this.currentMax = config.startRange[1];
    }
    map(value) {
        this.updateStats(value);
        let normalized = (value - this.currentMin) / (this.currentMax - this.currentMin);
        if (this.config.clamp) {
            normalized = Math.max(0, Math.min(1, normalized));
        }
        return this.lerp(this.applyCurve(normalized));
    }
    updateStats(value) {
        this.samples.push(value);
        if (this.samples.length > this.dynamicConfig.windowSize) {
            this.samples.shift();
        }
        const n = this.samples.length;
        this.mean = this.samples.reduce((a, b) => a + b, 0) / n;
        if (n > 1) {
            const squareDiffs = this.samples.map(val => Math.pow(val - this.mean, 2));
            const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / n;
            this.stdDev = Math.sqrt(avgSquareDiff);
        }
        // Blend from start range to observed range
        const warmupFactor = Math.min(1, n / this.dynamicConfig.warmupSamples);
        const observedMin = this.mean - (this.dynamicConfig.sensitivity * this.stdDev);
        const observedMax = this.mean + (this.dynamicConfig.sensitivity * this.stdDev);
        const targetMin = (1 - warmupFactor) * this.dynamicConfig.startRange[0] + warmupFactor * observedMin;
        const targetMax = (1 - warmupFactor) * this.dynamicConfig.startRange[1] + warmupFactor * observedMax;
        if (this.dynamicConfig.outOfRange === 'expand') {
            this.currentMin = Math.min(value, targetMin);
            this.currentMax = Math.max(value, targetMax);
        }
        else {
            this.currentMin = targetMin;
            this.currentMax = targetMax;
        }
    }
}
