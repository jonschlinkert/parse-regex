console.time('total');
const scan = require('./');
const safe = require('./vendor/safe-regex');

// console.log(scan('(beep|boop)*'));
// console.log(safe('(beep|boop)*'));
// console.log(safe('(x+x+)+y'));
// console.log(safe('(x+(x*)*)+y'));
// console.log(safe('(x+(x*)*?)+y'));
// console.log(safe('(x+((x*x*)*?)*)+y*'));
console.log(safe('(ab*|a*)*(c)*d+'));
console.log(safe('(a*b*)*c*d?'));
console.log('---')
// console.log(scan('(beep|boop)*').height);
// console.log(scan('(x+x+)+y').height);
// console.log(scan('(x+(x*)*)+y').height);
// console.log(scan('(x+(x*)*?)+y').height);
// console.log(scan('(x+((x*x*)*?)*)+y*').height);
console.log(scan('(ab*|a*)*(c)*d+').height);
console.log(scan('(a*b*)*c*d?'));
console.timeEnd('total');
// console.log(scan('(beep|boop)*').height);
// console.log(scan('(x+x+)+y').height);

// console.log(new RegExp('(beep|boop)*'))

// console.log(scan('(?<foo>)').nodes[0]);
// console.log(scan('(?<=foo)').nodes[0]);
// console.log(scan('(?<!foo)').nodes[0]);
// console.log(scan('(?=foo)').nodes[0]);
// console.log(scan('(?!foo)').nodes[0]);
// console.log(scan('(?:foo)').nodes[0]);
// console.log(scan('*(?:foo)'));
// console.log(scan('^[^foo]$').nodes);

function compare(pattern) {
  // console.log(scan(pattern).starHeight);
  console.log(scan(pattern).height, safe(pattern), pattern);
}
// compare('abbb{3,1}');
// compare('ab{3,1}');

// compare('.*?');
// compare('a{0,}');
// compare('a{1,}');
// compare('a{1,1}');
// compare('a{1,2}');
// compare('a{8,}');
// compare('a{8,100}');
// compare('a{99}');
// compare('a{,99}');
// compare('^foo([^bar]{1,3})*baz$');
// compare('(?<foo>)');
// compare('(?<=foo)');
// compare('(?<!foo)');
// compare('(?=foo)');
// compare('(?!foo)');
// compare('(?:foo)');
// compare('.*(?:foo)');
// compare('^[^foo]$');
// compare('foo/(?<=[^abc])/bar');
// compare('foo');
// compare('(foo|bar)');

// // const good = [
// //   /\bOakland\b/,
// //   /\b(Oakland|San Francisco)\b/i,
// //   /^\d+1337\d+$/i,
// //   /^\d+(1337|404)\d+$/i,
// //   /^\d+(1337|404)*\d+$/i,
// //   RegExp(Array(26).join('a?') + Array(26).join('a'))
// // ];

// // const bad = [
// //   /^(a?){25}(a){25}$/,
// //   RegExp(Array(27).join('a?') + Array(27).join('a')),
// //   /(x+x+)+y/,
// //   /foo|(x+x+)+y/,
// //   /(a+){10}y/,
// //   /(a+){2}y/,
// //   /(.*){1,32000}[bc]/
// // ];

// // const invalid = ['*Oakland*', 'hey(yoo))', 'abcde(?>hellow)', '[[abc'];
// // // const invalid = ['[[abc'];

// // good.forEach(pat => scan(pat));
// // bad.forEach(pat => scan(pat));
// // invalid.forEach(pat => scan(pat));

// console.log(/^f{1,3}$/.test('fff'))
// console.log(scan('f{,3}'))
// console.log([/\n\w\W\v*.FOO\s/.source])
// console.log(scan(/\n\w\W\v*.FOO\\s/));
// console.log(scan('\\'));
// console.log(scan('\n\w\W\v*.FOO\s'));
