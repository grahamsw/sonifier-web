import { BaseSonifier } from '../BaseSonifier.js';
import { SonifierDescriptor, ParameterDescriptor } from '../types.js';

export class LiquidSynth extends BaseSonifier {
  private workletNode: AudioWorkletNode | null = null;
  private processorUrl: string;

  private params: Record<string, number> = {
    frequency: 0.4, // Normalized 0-1
    viscosity: 0.5,
    volume: 0.5
  };

  private descriptor: SonifierDescriptor = {
    name: 'liquid-synth',
    description: 'Physical modeling liquid resonator',
    parameters: {
      frequency: {
        type: 'number',
        label: 'Frequency',
        description: 'Excitation frequency of the resonator',
        min: 5,
        max: 100,
        default: 0.4,
        unit: 'Hz',
        nominatable: true
      },
      viscosity: {
        type: 'number',
        label: 'Viscosity',
        description: 'Thickness of the liquid',
        min: 0,
        max: 1,
        default: 0.5,
        nominatable: true
      },
      volume: {
        type: 'number',
        label: 'Liquid Volume',
        description: 'Amount of liquid in the container',
        min: 0,
        max: 1,
        default: 0.5,
        nominatable: true
      }
    }
  };

  constructor(processorUrl: string, context?: AudioContext) {
    super(context);
    this.processorUrl = processorUrl;
  }

  getDescriptor(): SonifierDescriptor {
    return this.descriptor;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.context.audioWorklet.addModule(this.processorUrl);
      this.workletNode = new AudioWorkletNode(this.context, 'liquid-resonator-processor');
      this.workletNode.connect(this.masterGain);
      this.updateParameters(true); // Immediate update for initialization
      this.isInitialized = true;
    } catch (e) {
      console.error('LiquidSynth init failed:', e);
      throw e;
    }
  }

  setParameter(name: string, value: number | string | boolean): void {
    if (this.descriptor.parameters[name] && typeof value === 'number') {
      this.params[name] = value;
      this.updateParameters();
    }
  }

  getParameter(name: string): number | string | boolean {
    return this.params[name] ?? (this.descriptor.parameters[name] as any).default;
  }

  private updateParameters(immediate: boolean = false): void {
    if (!this.workletNode) return;

    const parameters = this.workletNode.parameters as unknown as Map<string, AudioParam>;
    const now = this.context.currentTime;
    const rampTime = immediate ? 0 : 0.05;

    for (const [id, value] of Object.entries(this.params)) {
      const audioParam = parameters.get(id);
      if (audioParam) {
        const desc = this.descriptor.parameters[id] as any;
        // Map normalized 0-1 to physical range
        const physicalValue = desc.min + value * (desc.max - desc.min);
        
        if (immediate) {
          audioParam.setValueAtTime(physicalValue, now);
        } else {
          audioParam.setTargetAtTime(physicalValue, now, rampTime);
        }
      }
    }
  }

  stop(): void {
    super.stop();
    this.workletNode?.disconnect();
  }
}
