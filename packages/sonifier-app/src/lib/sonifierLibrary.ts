import { library, LiquidSynth, MalletSynth, PurrSynth } from 'sonifiers-core';

// Initialize the library with available synths
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

export { library };
