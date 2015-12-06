function AVSynth(){
    if(!(this instanceof  AVSynth)){
        return new AVSynth();
    }
    this.sustain = 0.02;
    this.release = 0.03;

    this.context = new AudioContext();
    this.compressor = this.context.createDynamicsCompressor();
    this.gain = this.context.createGain();

    this.compressor.connect(this.gain);
    this.gain.connect(this.context.destination);
}

AVSynth.prototype.sound = function(freq){
    var ctx = this.context;
    var comp = this.compressor;

    var gain = ctx.createGain();
    gain.connect(comp);

    var osc = ctx.createOscillator();
    osc.connect(gain);
    osc.frequency.value = freq;
    osc.type = 'square';

    osc.start(ctx.currentTime);
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.setValueAtTime(1, ctx.currentTime+this.sustain);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime+this.sustain+this.release);
    osc.stop(ctx.currentTime+this.sustain+this.release);
};

AVSynth.prototype.setVolume = function(value){
    this.gain.gain.value = value/100;
};

module.exports = AVSynth;