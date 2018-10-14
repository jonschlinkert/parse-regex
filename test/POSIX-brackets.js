'use strict';

require('mocha');
const assert = require('assert');
const types = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

describe('POSIX brackets', () => {
  it('should ', () => {
    // [[:^alpha:]]
    // [^a-zA-Z]
    // [[:^alpha:]-[abc]] // when a negation POSIX bracket exists AND _other chars_, the other chars need to be moved to a lookbehind following the bracket.
    // [[:^alpha:][:digit:]] // <= invalid
    // [[:^alpha:][^:digit:]] // <= valid (both negative), converts to [^a-zA-Z0-9]
    // [[:alpha:][:digit:]] // <= valid (both positive)
    // [[:alpha:]]
    // [x-z[:digit:]]
  });
});
