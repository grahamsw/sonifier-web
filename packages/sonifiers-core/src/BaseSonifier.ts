import { Sonifier, SonifierDescriptor } from './types.js';

export abstract class BaseSonifier implements Sonifier {
  protected context: AudioContext;
  protected masterGain: GainNode;
  protected gateGain: GainNode;
  protected isStarted: boolean = false;
  protected isInitialized: boolean = false;

  constructor(context?: AudioContext) {
    if (context) {
      this.context = context;
    } else if (typeof window !== 'undefined') {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    } else {
      // Mock or handle Node.js environment (for testing/build)
      this.context = {} as AudioContext;
    }
    
    this.masterGain = (this.context.createGain ? this.context.createGain() : {}) as GainNode;
    this.gateGain = (this.context.createGain ? this.context.createGain() : {}) as GainNode;
    
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

  abstract getDescriptor(): SonifierDescriptor;
  
  abstract initialize(): void | Promise<void>;

  start(): void {
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    this.isStarted = true;
    this.gateGain.gain.setTargetAtTime(1, this.context.currentTime, 0.1);
  }

  stop(): void {
    this.isStarted = false;
    this.gateGain.gain.setTargetAtTime(0, this.context.currentTime, 0.1);
  }

  abstract setParameter(name: string, value: number | string | boolean): void;
  abstract getParameter(name: string): number | string | boolean;

  setAmplitude(value: number): void {
    this.masterGain.gain.setTargetAtTime(value, this.context.currentTime, 0.05);
  }

  getAmplitude(): number {
    return this.masterGain.gain.value;
  }
}
