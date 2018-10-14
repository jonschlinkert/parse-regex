'use strict';

require('mocha');
const assert = require('assert');

describe('lookarounds', () => {
  describe('positive lookaheads', () => {
    it('should ', () => {
      console.log(/(?=[^aeiuo])/)
      console.log(/(?=[^aeiuo])/)
      console.log(/(?=[^aeiuo])/)
      console.log(/(?=[^aeiuo])/)
    });
  });

  describe('negative lookaheads', () => {
    it('should ', () => {
      console.log(/(?![aeiuo])/)
      console.log(/(?![aeiuo])/)
      console.log(/(?![aeiuo])/)
      console.log(/(?![aeiuo])/)
    });
  });

  describe('positive lookbehinds', () => {
    it('should ', () => {
      console.log(/[a-z](?<=[^aeiuo])/.test('a'))
      console.log(/[a-z](?<=[^aeiuo])/.test('b'))
      console.log(/[a-z](?<=[^aeiuo])/.test('c'))
      console.log(/[a-z](?<=[^aeiuo])/.test('i'))
    });
  });

  describe('negative lookbehinds', () => {
    it('should ', () => {
      console.log(/[a-z](?<![aeiuo])/.test('a'))
      console.log(/[a-z](?<![aeiuo])/.test('b'))
      console.log(/[a-z](?<![aeiuo])/.test('c'))
      console.log(/[a-z](?<![aeiuo])/.test('i'))
    });
  });
});
