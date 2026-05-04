export class BaseSonifier {
    context;
    masterGain;
    gateGain;
    isStarted = false;
    isInitialized = false;
    constructor(context) {
        if (context) {
            this.context = context;
        }
        else if (typeof window !== 'undefined') {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
        else {
            // Mock or handle Node.js environment (for testing/build)
            this.context = {};
        }
        this.masterGain = (this.context.createGain ? this.context.createGain() : {});
        this.gateGain = (this.context.createGain ? this.context.createGain() : {});
        if (this.gateGain.gain) {
            this.gateGain.gain.value = 0;
        }
        if (this.masterGain.connect) {
            this.masterGain.connect(this.gateGain);
            if (this.context.destination) {
                this.gateGain.connect(this.context.destination);
            }
        }
    }
    start() {
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
        this.isStarted = true;
        this.gateGain.gain.setTargetAtTime(1, this.context.currentTime, 0.1);
    }
    stop() {
        this.isStarted = false;
        this.gateGain.gain.setTargetAtTime(0, this.context.currentTime, 0.1);
    }
    setAmplitude(value) {
        this.masterGain.gain.setTargetAtTime(value, this.context.currentTime, 0.05);
    }
    getAmplitude() {
        return this.masterGain.gain.value;
    }
}
