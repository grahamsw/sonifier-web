import { BaseSonifier } from '../BaseSonifier.js';
export class PurrSynth extends BaseSonifier {
    breathGain = null;
    breathLFO = null;
    breathLFOGain = null;
    exciter = null;
    exciterLPF = null;
    f1Res = null;
    f2Res = null;
    f1Gain = null;
    f2Gain = null;
    rumbleOsc = null;
    rumbleLPF = null;
    rumbleGain = null;
    jitterOsc = null;
    jitterGain = null;
    params = {
        engine: 'classic',
        purrRate: 0.2, // (28 - 10) / (100 - 10) = 18/90 = 0.2
        baseFreq: 0.0256, // (40 - 20) / (800 - 20) = 20/780 = 0.0256
        jitterDepth: 0.2,
        f1Ratio: 0.1428, // (1.0 - 0.5) / (4 - 0.5) = 0.5/3.5 = 0.1428
        f1Amp: 0.5,
        f1Decay: 0.198, // (0.1 - 0.001) / (0.5 - 0.001) = 0.099/0.499 = 0.198
        f2Ratio: 0.2, // (2.0 - 0.5) / (8 - 0.5) = 1.5/7.5 = 0.2
        f2Amp: 0.35,
        f2Decay: 0.118, // (0.06 - 0.001) / (0.5 - 0.001) = 0.059/0.499 = 0.118
        rumbleAmp: 0.25,
        breathDepth: 0.3,
        breathRate: 0.038 // (0.2 - 0.01) / (5 - 0.01) = 0.19/4.99 = 0.038
    };
    descriptor = {
        name: 'purr-synth',
        description: 'Complex additive and subtractive synthesis of a feline purr',
        parameters: {
            engine: {
                type: 'enum',
                label: 'Engine',
                description: 'Synthesis engine type',
                options: [
                    { value: 'classic', label: 'Classic', description: 'Pulse-wave based exciter' },
                    { value: 'buzz', label: 'Buzz', description: 'Sawtooth based exciter' }
                ],
                default: 'classic',
                nominatable: false
            },
            purrRate: {
                type: 'number',
                label: 'Purr Rate',
                description: 'Repetition rate of the purr cycle',
                min: 10,
                max: 100,
                default: 28,
                unit: 'Hz',
                nominatable: true
            },
            baseFreq: {
                type: 'number',
                label: 'Base Frequency',
                description: 'Fundamental frequency of the resonance',
                min: 20,
                max: 800,
                default: 40,
                unit: 'Hz',
                nominatable: true
            },
            jitterDepth: {
                type: 'number',
                label: 'Jitter Depth',
                description: 'Amount of frequency instability',
                min: 0,
                max: 1,
                default: 0.2,
                nominatable: true
            },
            f1Ratio: {
                type: 'number',
                label: 'F1 Ratio',
                description: 'Frequency ratio for the first formant',
                min: 0.5,
                max: 4,
                default: 1.0,
                nominatable: true
            },
            f1Amp: {
                type: 'number',
                label: 'F1 Amplitude',
                description: 'Volume of the first formant',
                min: 0,
                max: 1,
                default: 0.5,
                nominatable: true
            },
            f1Decay: {
                type: 'number',
                label: 'F1 Decay',
                description: 'Decay time for the first formant',
                min: 0.001,
                max: 0.5,
                default: 0.1,
                nominatable: true
            },
            f2Ratio: {
                type: 'number',
                label: 'F2 Ratio',
                description: 'Frequency ratio for the second formant',
                min: 0.5,
                max: 8,
                default: 2.0,
                nominatable: true
            },
            f2Amp: {
                type: 'number',
                label: 'F2 Amplitude',
                description: 'Volume of the second formant',
                min: 0,
                max: 1,
                default: 0.35,
                nominatable: true
            },
            f2Decay: {
                type: 'number',
                label: 'F2 Decay',
                description: 'Decay time for the second formant',
                min: 0.001,
                max: 0.5,
                default: 0.06,
                nominatable: true
            },
            rumbleAmp: {
                type: 'number',
                label: 'Rumble Amplitude',
                description: 'Volume of the low-frequency rumble',
                min: 0,
                max: 1,
                default: 0.25,
                nominatable: true
            },
            breathDepth: {
                type: 'number',
                label: 'Breath Depth',
                description: 'Amplitude modulation depth for breathing effect',
                min: 0,
                max: 1,
                default: 0.3,
                nominatable: true
            },
            breathRate: {
                type: 'number',
                label: 'Breath Rate',
                description: 'Rate of the breathing modulation',
                min: 0.01,
                max: 5,
                default: 0.2,
                unit: 'Hz',
                nominatable: true
            }
        }
    };
    constructor(context) {
        super(context);
    }
    getDescriptor() {
        return this.descriptor;
    }
    initialize() {
        if (this.isInitialized)
            return;
        this.breathGain = this.context.createGain();
        this.breathGain.gain.value = 1.0;
        this.breathGain.connect(this.masterGain);
        this.breathLFO = this.context.createOscillator();
        this.breathLFOGain = this.context.createGain();
        this.breathLFO.connect(this.breathLFOGain);
        const breathBase = this.context.createGain();
        breathBase.gain.value = 1.0;
        this.breathLFOGain.connect(breathBase.gain);
        breathBase.connect(this.breathGain);
        this.exciter = this.context.createOscillator();
        this.exciterLPF = this.context.createBiquadFilter();
        this.exciterLPF.type = 'lowpass';
        this.exciter.connect(this.exciterLPF);
        this.jitterOsc = this.context.createOscillator();
        this.jitterGain = this.context.createGain();
        this.jitterOsc.connect(this.jitterGain);
        this.jitterGain.connect(this.exciter.frequency);
        this.f1Res = this.context.createBiquadFilter();
        this.f1Res.type = 'bandpass';
        this.f1Gain = this.context.createGain();
        this.exciterLPF.connect(this.f1Res);
        this.f1Res.connect(this.f1Gain);
        this.f1Gain.connect(this.breathGain);
        this.f2Res = this.context.createBiquadFilter();
        this.f2Res.type = 'bandpass';
        this.f2Gain = this.context.createGain();
        this.exciterLPF.connect(this.f2Res);
        this.f2Res.connect(this.f2Gain);
        this.f2Gain.connect(this.breathGain);
        this.rumbleOsc = this.context.createOscillator();
        this.rumbleOsc.type = 'square';
        this.rumbleLPF = this.context.createBiquadFilter();
        this.rumbleLPF.type = 'lowpass';
        this.rumbleGain = this.context.createGain();
        this.rumbleOsc.connect(this.rumbleLPF);
        this.rumbleLPF.connect(this.rumbleGain);
        this.rumbleGain.connect(this.breathGain);
        this.jitterGain.connect(this.rumbleOsc.frequency);
        const now = this.context.currentTime;
        this.exciter.start(now);
        this.jitterOsc.start(now);
        this.rumbleOsc.start(now);
        this.breathLFO.start(now);
        this.updateNodes(true);
        this.isInitialized = true;
    }
    setParameter(name, value) {
        if (this.descriptor.parameters[name]) {
            this.params[name] = value;
            this.updateNodes();
        }
    }
    getParameter(name) {
        return this.params[name] ?? this.descriptor.parameters[name].default;
    }
    createPulseWave() {
        const n = 64;
        const real = new Float32Array(n);
        const imag = new Float32Array(n);
        for (let i = 1; i < n; i++) {
            real[i] = 1.0 / (i * i);
        }
        return this.context.createPeriodicWave(real, imag);
    }
    updateNodes(immediate = false) {
        if (!this.isInitialized && !immediate)
            return;
        // Ensure nodes exist before update
        if (!this.exciter || !this.exciterLPF || !this.f1Res || !this.f2Res || !this.f1Gain || !this.f2Gain || !this.rumbleOsc || !this.rumbleLPF || !this.rumbleGain || !this.jitterOsc || !this.jitterGain || !this.breathLFO || !this.breathLFOGain)
            return;
        const now = this.context.currentTime;
        const ramp = immediate ? 0 : 0.05;
        if (this.params.engine === 'buzz') {
            this.exciter.type = 'sawtooth';
        }
        else {
            this.exciter.setPeriodicWave(this.createPulseWave());
        }
        const mapParam = (id) => {
            const desc = this.descriptor.parameters[id];
            const val = this.params[id];
            const clampedVal = Math.max(0, Math.min(1, val));
            return desc.min + clampedVal * (desc.max - desc.min);
        };
        const purrRateHz = mapParam('purrRate');
        const baseFreqHz = mapParam('baseFreq');
        const setFreq = (param, val) => {
            if (immediate)
                param.setValueAtTime(val, now);
            else
                param.setTargetAtTime(val, now, ramp);
        };
        const setGain = (param, val) => {
            if (immediate)
                param.setValueAtTime(val, now);
            else
                param.setTargetAtTime(val, now, ramp);
        };
        setFreq(this.exciter.frequency, purrRateHz);
        setFreq(this.exciterLPF.frequency, Math.min(20000, baseFreqHz * 1.5));
        setFreq(this.jitterOsc.frequency, 4);
        setGain(this.jitterGain.gain, purrRateHz * this.params.jitterDepth * 0.5);
        setFreq(this.rumbleOsc.frequency, purrRateHz * 0.5);
        setFreq(this.rumbleLPF.frequency, Math.min(1000, baseFreqHz * 0.8));
        setGain(this.rumbleGain.gain, mapParam('rumbleAmp') * 0.6);
        setFreq(this.f1Res.frequency, Math.min(20000, baseFreqHz * mapParam('f1Ratio')));
        setGain(this.f1Res.Q, 5 + 10 * this.params.f1Decay);
        setGain(this.f1Gain.gain, mapParam('f1Amp') * 0.4);
        setFreq(this.f2Res.frequency, Math.min(20000, baseFreqHz * mapParam('f2Ratio')));
        setGain(this.f2Res.Q, 3 + 8 * this.params.f2Decay);
        setGain(this.f2Gain.gain, mapParam('f2Amp') * 0.3);
        setFreq(this.breathLFO.frequency, mapParam('breathRate'));
        setGain(this.breathLFOGain.gain, this.params.breathDepth * 0.4);
    }
    stop() {
        super.stop();
        this.exciter?.disconnect();
        this.rumbleOsc?.disconnect();
        this.jitterOsc?.disconnect();
        this.breathLFO?.disconnect();
    }
}
