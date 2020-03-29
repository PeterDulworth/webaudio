const impulses = [
  'http://nickdulworth.com/webaudio/impulses/impulse0.m4a',
  'http://nickdulworth.com/webaudio/impulses/impulse1.m4a',
  'http://nickdulworth.com/webaudio/impulses/impulse2.m4a',
];

const sourceAudio = [
  'http://reverbjs.org/Library/SampleBachCMinorPrelude.m4a',
  'http://nickdulworth.com/webaudio/sources/clip.m4a',
  'http://nickdulworth.com/webaudio/sources/clarinet_solo.m4a',
];

let is_stopped = true;
let togglePlayBtn;
let cur_impulse = 0;
let cur_source = 0;

// 1) Setup your audio context (once) and extend with Reverb.js.
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
reverbjs.extend(audioContext);

function playSampleWithImpulse(impulseUrl, sourceUrl) {
  // 2) Load the impulse response; upon load, connect it to the audio output.
  const reverbNode = audioContext.createReverbFromUrl(impulseUrl, function() {
    reverbNode.connect(audioContext.destination);
  });

  // 3) Load a test sound; upon load, connect it to the reverb node.
  const sourceNode = audioContext.createSourceFromUrl(sourceUrl, function() {
    sourceNode.connect(reverbNode);
  });

  return sourceNode;
}

//start playback
function handleRunBtnClick(event) {
  console.log('Start', sourceNode);
  is_stopped = false;
  sourceNode.start();
  audioContext.resume();
}

//stop playback
function handleTogglePlayBtnClick(event) {
  if (is_stopped) {
    console.log('Resume');
    togglePlayBtn.innerHTML = 'Pause';
    audioContext.resume();
  } else {
    console.log('Stop');
    togglePlayBtn.innerHTML = 'Play';
    audioContext.suspend();
  }

  is_stopped = !is_stopped;
}

//switch impulse, load audio
function handleLoadImpulseBtnClick(impulseNum, sourceNum) {
  console.log('Load impulse ', impulseNum);
  audioContext.suspend();
  audioContext.close();
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  reverbjs.extend(audioContext);

  sourceNode = playSampleWithImpulse(impulses[impulseNum], sourceAudio[sourceNum]);
}

window.addEventListener('load', function() {
  togglePlayBtn = document.getElementById('toggle-play-btn');
  handleLoadImpulseBtnClick(cur_impulse, cur_source); // initialize impulse 0, audio 0
  document.getElementById('start-btn').onclick = handleRunBtnClick; //listen for play
  document.getElementById('toggle-play-btn').onclick = handleTogglePlayBtnClick; //listen for stop
  document.getElementById('load-impulse-0-btn').onclick = e => handleLoadImpulseBtnClick(0, 0); //load impulse 0
  document.getElementById('load-impulse-1-btn').onclick = e => handleLoadImpulseBtnClick(1, 1); // load impulse 1
  document.getElementById('load-impulse-2-btn').onclick = e => handleLoadImpulseBtnClick(2, 2); // load impulse 2

  document.getElementById('load-source-0-btn').onclick = e => handleLoadSourceBtnClick(0, 0); //load impulse 0
  document.getElementById('load-source-1-btn').onclick = e => handleLoadImpulseBtnClick(1, 1); // load impulse 1
  document.getElementById('load-source-2-btn').onclick = e => handleLoadImpulseBtnClick(2, 2); // load impulse 2
});
