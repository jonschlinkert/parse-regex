'use strict';

require('mocha');
const assert = require('assert');

describe('quantifiers', () => {
  it('should ', () => {
    console.log(/a{8,100}/);
    console.log(/a{0,}/);
    console.log(/a{1,}/);
    console.log(/a{1,1}/);
    console.log(/a{1,2}/);
    console.log(/a{8,}/);
    console.log(/a{8,100}/);
    console.log(/a{99}/);
    console.log(/a{,99}/);
    console.log(/a{99,}/);
  });
});
