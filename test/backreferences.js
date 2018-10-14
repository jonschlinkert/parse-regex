'use strict';

require('mocha');
const assert = require('assert');

describe('backrefences', () => {
  it('should ', () => {
    // (abc|def)=\1
    // (foo)\/(bar)/\1/\2 => foo/bar/foo/bar
  });
});
