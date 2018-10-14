const parse = require('ret');

/**
 * From substack/safe-regex - this is temporarly copied here to
 * make testing star-height easier. The safe-regex library
 * only returns a boolean value, and I need to compare the actual
 * number calculated.
 */

module.exports = function(re, opts) {
  if (!opts) opts = {};
  var replimit = opts.limit === undefined ? 25 : opts.limit;

  if (isRegExp(re)) re = re.source;
  else if (typeof re !== 'string') re = String(re);

  try {
    re = parse(re);
  } catch (err) {
    return 0;
    // return false;
  }

  var reps = 0;
  var starHeight = 0;

  (function walk(node) {

    // console.log(node)
    if (node.type === parse.types.REPETITION) {
      starHeight++;
      reps++;
      // if (starHeight > 1 || reps > replimit) {
      //   return false;
      // }
    }

    var stack = node.stack || (node.value && node.value.stack);
    if (!stack) return true;

    for (var i = 0; i < stack.length; i++) {
      var ok = walk(stack[i], starHeight);
      if (!ok) return false;
    }

    return true;
  })(re);

  return starHeight;
};

function isRegExp(x) {
  return {}.toString.call(x) === '[object RegExp]';
}
