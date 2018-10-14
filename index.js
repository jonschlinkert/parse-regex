'use strict';

const TYPES = {
  '^': 'ANCHOR_START',
  '$': 'ANCHOR_END',
  '<': 'ANGLE',
  '>': 'ANGLE',
  '{': 'BRACE',
  '}': 'BRACE',
  '[': 'BRACKET',
  ']': 'BRACKET',
  '(': 'PAREN',
  ')': 'PAREN',
  '*': 'QUANTIFIER_STAR',
  '+': 'QUANTIFIER_PLUS',
  '?': 'QUANTIFIER_QMARK',
  '.': 'DOT',
  '\s': 'SPACE',
  '\S': 'NOT_SPACE',
  '\n': 'NEWLINE',
  '\r': 'CARRIAGE_RETURN',
  '\t': 'TAB',
  '\v': 'VERTICAL_TAB',
  '\f': 'FORM_FEED',
  '\b': 'WORD_BOUNDARY',
  '\B': 'NOT_WORD_BOUNDARY',
  '\d': 'DIGIT',
  '\D': 'NOT_DIGIT',
  '\w': 'WORD',
  '\W': 'NOT_WORD',
};

const scan = (input, options = {}) => {
  if (input instanceof RegExp) {
    input = input.source;
  }

  let string = input;
  let ast = new Node();
  let stack = [ast];
  let queue = [];
  let prev = ast;
  let bracket;
  let block;
  let value;
  let inner;
  let type;
  let node;
  let idx;
  let i = -1;

  const last = (arr = []) => arr[arr.length - 1];
  const peek = () => string[i + 1];
  const next = () => string[++i];
  const eos = () => queue.length === 0 && i >= string.length - 1;

  while (!eos()) {
    value = next();
    block = last(stack);
    type = TYPES[value] || 'TEXT';
    node = new Node({ type, value });

    if (block.type === 'BRACKET' && value !== ']') {
      block.chars.push(value);
      prev = block;
      continue;
    }

    switch (value) {
      case '\\':
        if (!eos()) node.value += next();
        node.type = TYPES[node.value] || 'BACKSLASH';
        block.push(node);
        break;

      case '[':
      case '(':
      case '{':
      case '<':
        if (value === '<' && prev.value === '?' && block.type === 'PAREN' && block.chars.length === 2) {
          block.chars.push(value);
          break;
        }

        node = new Block({ type }, value);
        block.push(node);
        stack.push(node);
        break;
      case ']':
      case ')':
      case '}':
      case '>':
        if (value === '>' && block.type === 'PAREN') {
          block.named = true;
          block.name = block.chars.slice(block.chars.indexOf('<') + 1).join('');
          block.chars.push(value);
          break;
        }

        bracket = stack.pop();

        if (bracket.type !== type) {
          error(`Missing opening ${type}: "${value}"`, bracket, i, options.strictErrors);
          bracket.chars.push('\\' + value);
          stack.push(bracket);
          break;
        }

        bracket.close(value);
        block = last(stack);
        block.chars.push(...bracket.chars);
        inner = bracket.chars.join('');
        block.height += bracket.height;

        switch (value) {
          case ']':
            if (bracket.chars[1] === '^') {
              bracket.negated = true;
            }
            break;
          case ')':
            bracket.capture = true;

            if (!bracket.named && bracket.chars[1] === '?') {
              bracket.capture = false;
              bracket.negative = bracket.positive = false;
              bracket.lookahead = bracket.lookbehind = false;

              switch (bracket.chars[2]) {
                case ':': break;
                case '!': bracket.lookahead = bracket.negative = true; break;
                case '=': bracket.lookahead = bracket.positive = true; break;
                case '<':
                  bracket.lookbehind = true;
                  bracket.positive = bracket.chars[3] === '=';
                  bracket.negative = bracket.chars[3] === '!';
                  break;
                default: {
                  error(`Invalid expression: "${inner}"`, bracket, i, true);
                  block.chars[0] = '\\' + block.chars[0];
                }
              }
            }
            break;
          case '}':
            if (options.nobrace !== true) {
            }

            // if (bracket.chars[1] === ',') {
            //   error(`Invalid quantifier: "${inner}"`, bracket, i, true);
            // }

            quantifier(bracket);
            block.height++;

            if (bracket.min > bracket.max) {
              error(`Invalid quantifier: "${inner}"`, bracket, i, true);
            }
            break;
          case '>':
            break;
          default: {
            break;
          }
        }

        break;
      case '^':
      case '$':
        block.push(node);
        break;
      case '?':
        if (block.type === 'PAREN' && block.chars.length === 1) {
          node.type = 'QMARK';
        } else if (prev.type === 'QUANTIFIER_STAR' || prev.type === 'QUANTIFIER_PLUS') {
          block.height--;
        } else {
          block.height++;
        }
        node.min = 0;
        node.max = 1;
        block.push(node);
        break;
      case '*':
        node.min = 0;
        node.max = Infinity;
        block.push(node);
        block.height++;
        break;
      case '+':
        node.min = 1;
        node.max = Infinity;
        block.push(node);
        block.height++;
        break;
      default: {
        if (prev.type === 'TEXT' && node.type === 'TEXT') {
          block.chars.push(value);
          block.nodes[block.nodes.length - 1].value += value;
          break;
        }

        block.push(node);
        break;
      }
    }

    prev = node;
  }

  node = stack.pop();
  block = last(stack);

  while (node !== ast) {
    error(`Unmatched: "${node.chars[0]}"`, node, i, options.strictErrors);
    node.chars[0] = '\\' + node.chars[0];
    node = stack.pop();
  }

  return ast;
};

function error(msg, node, index, strictErrors) {
  if (strictErrors) {
    let i = index - node.chars.length + 1;
    throw new SyntaxError(`${msg}, at column ${i}`);
  }
}

function quantifier(node) {
  let inner = node.chars.slice(1, -1);
  let idx = inner.indexOf(',');

  if (idx === inner.length - 1) {
    inner.pop();

    node.min = parseInt(inner.join(''), 10);
    node.max = Infinity;
    return;
  }

  if (idx === -1) {
    node.min = node.max = parseInt(inner.join(''), 10);
    return;
  }

  // shuld be NaN if the left side is undefined: i.e. "{,3}"
  node.min = parseInt(inner.slice(0, idx).join(''), 10);
  node.max = parseInt(inner.slice(idx + 1).join(''), 10);
}

class Node {
  constructor(node) {
    this.type = 'root';
    Object.assign(this, node);
    this.height = 0;
  }
  push(node) {
    Reflect.defineProperty(node, 'parent', { value: this });
    this.chars = this.chars || [];
    this.nodes = this.nodes || [];
    this.nodes.push(node);
    if (node.value) {
      this.chars.push(node.value);
    }
  }
  get parts() {
    return this.nodes ? this.nodes.map(n => n.parts) : this.value;
  }
}

class Block extends Node {
  constructor(node, value) {
    super(node);
    this.open(value);
  }
  open(value) {
    this.push(new Node({ type: `${this.type}_OPEN`, value }));
  }
  close(value) {
    this.push(new Node({ type: `${this.type}_CLOSE`, value }));
  }
}

module.exports = scan;
