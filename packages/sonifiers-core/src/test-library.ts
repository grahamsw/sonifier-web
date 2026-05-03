import { library, LiquidSynth, MalletSynth, PurrSynth, Runner } from './index.js';

// Register synths
library.register({
  descriptor: new LiquidSynth('').getDescriptor(),
  factory: () => new LiquidSynth('audio/LiquidResonatorProcessor.js')
});

library.register({
  descriptor: new MalletSynth().getDescriptor(),
  factory: () => new MalletSynth()
});

library.register({
  descriptor: new PurrSynth().getDescriptor(),
  factory: () => new PurrSynth()
});

console.log('Library initialized with synths:', library.list().map(s => s.name));

async function test() {
  try {
    // We can't actually initialize synths in Node.js because of missing Web Audio
    // but we can test the library and runner logic with a mock
    
    const mockSynth = {
      getDescriptor: () => ({
        name: 'mock-synth',
        description: 'Mock',
        parameters: {
          pitch: { type: 'number', label: 'Pitch', description: 'P', min: 0, max: 100, default: 0.5, nominatable: true }
        }
      }),
      initialize: () => {},
      start: () => {},
      stop: () => {},
      setParameter: (n: string, v: any) => console.log(`SET ${n} = ${v}`),
      getParameter: (n: string) => 0.5,
      setAmplitude: (v: number) => {},
      getAmplitude: () => 1
    } as any;

    const runner = new Runner(mockSynth);
    console.log('Runner created for mock-synth');

    runner.nominate('pitch', {
      type: 'static',
      curve: 'linear',
      inMin: 0,
      inMax: 100
    });

    console.log('Parameter nominated. Feeding values...');
    runner.feed('pitch', 50); // Should set 0.5
    
    const config = runner.getConfig();
    console.log('Current config:', JSON.stringify(config, null, 2));

    runner.start();
    console.log('Runner started');
    
    runner.stop();
    console.log('Runner stopped');
    
  } catch (e) {
    console.error('Test failed:', e);
  }
}

test();
