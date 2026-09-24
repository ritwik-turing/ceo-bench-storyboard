// Run with: node verify.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const { scenes, acts } = vm.runInNewContext(read('scenes.js') + ';({scenes,acts})');
assert.equal(scenes.length, 12);
let elapsed = 0;
for (const scene of scenes) {
  const [start, end] = scene.time.split('–').map(t => Number(t.split(':')[0]));
  assert.equal(start, elapsed);
  elapsed += scene.minutes;
  assert.equal(end, elapsed);
  for (const field of ['narration','director','journalist','evidence','transition','cue','asset','status']) {
    assert(scene[field], `Scene ${scene.id} missing ${field}`);
  }
  assert(read('storyboard.md').includes(`Scene ${String(scene.id).padStart(2, '0')} · ${scene.title}`));
}
assert.equal(elapsed, 82);
acts.forEach((act, i) => assert.equal(scenes.filter(s => s.act === i + 1).reduce((n,s) => n+s.minutes,0), act.minutes));
for (const file of ['index.html','scenes.js','storyboard.js','storyboard.md']) assert(!read(file).includes('\u2014'), `${file}: em dash`);
for (const file of ['assets/turing-logo.svg','assets/Poppins-Regular.ttf','assets/Poppins-SemiBold.ttf','assets/Poppins-OFL.txt']) assert(fs.statSync(path.join(__dirname,file)).size > 0);
console.log('PASS: complete scenes, contiguous 82-minute timeline, act totals, script coverage, punctuation, and bundled assets.');
