const { join } = require('path');
const execa = require('execa');

describe('babel-register', () => {
  xit('works', async () => {
    await execa(process.execPath, [
      '--require',
      'babel-register',
      '--presets',
      'cljs',
      join(__dirname, 'fixtures/server.cljs'),
    ]);
  });
});
