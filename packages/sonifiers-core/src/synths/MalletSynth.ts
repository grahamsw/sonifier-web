import { BaseSonifier } from '../BaseSonifier.js';
import { SonifierDescriptor } from '../types.js';

export class MalletSynth extends BaseSonifier {
  private timerId: any = null;

  private params: Record<string, number> = {
    strikeRate: 0.1, // Normalized 0-1
    boxSize: 0.5,
    resonance: 0.4,
    force: 0.7,
    hardness: 0.5
  };

  private descriptor: SonifierDescriptor = {
    name: 'mallet-synth',
    description: 'Modal synthesis of a resonant mallet instrument',
    parameters: {
      strikeRate: {
        type: 'number',
        label: 'Strike Rate',
        description: 'How often the mallet strikes',
        min: 0.1,
        max: 20,
        default: 0.1,
        unit: 'Hz',
        nominatable: true
      },
      boxSize: {
        type: 'number',
        label: 'Box Size',
        description: 'Size of the resonant body',
        min: 0.5,
        max: 2.0,
        default: 0.5,
        nominatable: true
      },
      resonance: {
        type: 'number',
        label: 'Resonance',
        description: 'Q factor of the modal bank',
        min: 5,
        max: 155,
        default: 0.4,
        nominatable: true
      },
      force: {
        type: 'number',
        label: 'Force',
        description: 'Impact strength',
        min: 0,
        max: 2,
        default: 0.7,
        nominatable: true
      },
      hardness: {
        type: 'number',
        label: 'Hardness',
        description: 'Hardness of the mallet head',
        min: 500,
        max: 15000,
        default: 0.5,
        unit: 'Hz',
        nominatable: true
      }
    }
  };

  constructor(context?: AudioContext) {
    super(context);
  }

  getDescriptor(): SonifierDescriptor {
    return this.descriptor;
  }

  initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;
    // Initial state is held in this.params and this.descriptor.parameters
  }

  setParameter(name: string, value: number | string | boolean): void {
    if (this.descriptor.parameters[name] && typeof value === 'number') {
      this.params[name] = value;
    }
  }

  getParameter(name: string): number | string | boolean {
    return this.params[name] ?? (this.descriptor.parameters[name] as any).default;
  }

  private strike = () => {
    if (!this.isStarted || !this.context) return;
    
    const now = this.context.currentTime;
    
    // 1. Create Noise Buffer
    const bufferSize = this.context.sampleRate * 0.05;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.context.createBufferSource();
    noiseSource.buffer = buffer;

    // 2. Setup Excitation
    const excitFilter = this.context.createBiquadFilter();
    excitFilter.type = "lowpass";
    
    const hardnessDesc = this.descriptor.parameters.hardness as any;
    const hardnessFreq = hardnessDesc.min + this.params.hardness * (hardnessDesc.max - hardnessDesc.min);
    excitFilter.frequency.setValueAtTime(hardnessFreq, now);

    const excitGain = this.context.createGain();
    const forceDesc = this.descriptor.parameters.force as any;
    const impactLevel = forceDesc.min + this.params.force * (forceDesc.max - forceDesc.min);
    excitGain.gain.setValueAtTime(impactLevel, now);
    excitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    noiseSource.connect(excitFilter);
    excitFilter.connect(excitGain);

    // 3. Connect Modal Bank
    const baseFreqs = [120, 285, 410, 650];
    const boxSizeDesc = this.descriptor.parameters.boxSize as any;
    // Map boxSize normalized to the [0.5, 2.0] physical range
    const sizeScale = boxSizeDesc.min + this.params.boxSize * (boxSizeDesc.max - boxSizeDesc.min); 

    const resonanceDesc = this.descriptor.parameters.resonance as any;
    const resonanceQ = resonanceDesc.min + this.params.resonance * (resonanceDesc.max - resonanceDesc.min);

    baseFreqs.forEach(f => {
      const filter = this.context.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(f * (2.5 - sizeScale), now); // Inverting for intuitive mapping
      filter.Q.setValueAtTime(resonanceQ, now);
      
      excitGain.connect(filter);
      filter.connect(this.masterGain);
    });

    noiseSource.start(now);
    noiseSource.stop(now + 0.05);
  };

  private scheduleNextStrike = () => {
    if (!this.isStarted) return;
    this.strike();
    
    const strikeRateDesc = this.descriptor.parameters.strikeRate as any;
    const rateHz = strikeRateDesc.min + this.params.strikeRate * (strikeRateDesc.max - strikeRateDesc.min);
    const interval = 1000 / rateHz;
    
    this.timerId = setTimeout(this.scheduleNextStrike, interval);
  };

  start(): void {
    super.start();
    if (!this.timerId) {
      this.scheduleNextStrike();
    }
  }

  stop(): void {
    super.stop();
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
