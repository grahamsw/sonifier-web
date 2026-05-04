import { SonifierLibrary } from './index.js';
class MockSynth {
    name;
    constructor(name) {
        this.name = name;
    }
    getDescriptor() {
        return {
            name: this.name,
            description: 'Mock',
            parameters: {}
        };
    }
    async initialize() { }
    start() { }
    stop() { }
    setParameter() { }
    getParameter() { return 0; }
    setAmplitude() { }
    getAmplitude() { return 1; }
}
function testRegisterMany() {
    console.log('--- Testing registerMany ---');
    const lib = new SonifierLibrary();
    const synths = [
        { descriptor: new MockSynth('synth1').getDescriptor(), factory: () => new MockSynth('synth1') },
        { descriptor: new MockSynth('synth2').getDescriptor(), factory: () => new MockSynth('synth2') }
    ];
    lib.registerMany(synths);
    const registered = lib.list().map(s => s.name);
    console.log('Registered synths:', registered);
    if (registered.includes('synth1') && registered.includes('synth2') && registered.length === 2) {
        console.log('✓ Success: Both synths registered via registerMany');
    }
    else {
        console.error('✗ Failure: Synths not registered correctly');
        process.exit(1);
    }
    // Test overwrite
    const overwrite = [
        { descriptor: new MockSynth('synth1').getDescriptor(), factory: () => new MockSynth('synth1-v2') }
    ];
    lib.registerMany(overwrite);
    console.log('✓ Success: registerMany tests passed');
}
testRegisterMany();
