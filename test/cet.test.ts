import BN from 'bn.js';
import { expect } from 'chai';
import {
  backGroupings,
  decompose,
  frontGroupings,
  groupByIgnoringDigits,
  separatePrefix,
} from '../lib';

describe('calculate', function () {
  it('add', function () {
    let result = 5 + 2;
    expect(result).equal(7);
  });

  it('decomposes BN binary', function () {
    const expected = [1, 0, 1, 1, 1, 1];
    const digits = decompose(new BN('101111', 2), 2, 6);

    expect(digits).eql(expected);
  });

  it('decomposes BN binary – truncated digits', function () {
    const expected = [1, 1, 1, 1];
    const digits = decompose(new BN('101111', 2), 2, 4);

    expect(digits).eql(expected);
  });

  it('decomposes BN binary – exceeds digits', function () {
    const expected = [0, 0, 1, 0, 1, 1, 1, 1];
    const digits = decompose(new BN('101111', 2), 2, 8);

    expect(digits).eql(expected);
  });

  it('separates prefix binary', function () {
    const start = new BN('101001', 2);
    const end = new BN('101111', 2);

    const expected = {
      prefixDigits: [1, 0, 1],
      startDigits: [0, 0, 1],
      endDigits: [1, 1, 1],
    };

    const result = separatePrefix(start, end, 2, 6);
    expect(result).eql(expected);
  });

  it('performs front groupings decimal', function () {
    const input = [1, 1, 5];
    const expected = [
      [1, 1, 5],
      [1, 1, 6],
      [1, 1, 7],
      [1, 1, 8],
      [1, 1, 9],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
      [1, 7],
      [1, 8],
      [1, 9],
    ];
    console.log(frontGroupings(input, 10));
    expect(frontGroupings(input, 10)).eql(expected);
  });

  it('performs back groupings decimal', function () {
    const input = [1, 1, 5];
    const expected = [
      [1, 0],
      [1, 1, 0],
      [1, 1, 1],
      [1, 1, 2],
      [1, 1, 3],
      [1, 1, 4],
      [1, 1, 5],
    ];

    expect(backGroupings(input, 10)).eql(expected);
  });

  it('perform groupByIgnoringDigits', function () {
    const start = new BN(1101);
    const end = new BN(1453);
    const base = 10;
    const numDigits = 4;

    const expected = [
      [1, 1, 0, 1],
      [1, 1, 0, 2],
      [1, 1, 0, 3],
      [1, 1, 0, 4],
      [1, 1, 0, 5],
      [1, 1, 0, 6],
      [1, 1, 0, 7],
      [1, 1, 0, 8],
      [1, 1, 0, 9],
      [1, 1, 1],
      [1, 1, 2],
      [1, 1, 3],
      [1, 1, 4],
      [1, 1, 5],
      [1, 1, 6],
      [1, 1, 7],
      [1, 1, 8],
      [1, 1, 9],
      [1, 2],
      [1, 3],
      [1, 4, 0],
      [1, 4, 1],
      [1, 4, 2],
      [1, 4, 3],
      [1, 4, 4],
      [1, 4, 5, 0],
      [1, 4, 5, 1],
      [1, 4, 5, 2],
      [1, 4, 5, 3],
    ];

    expect(groupByIgnoringDigits(start, end, base, numDigits)).to.eql(expected);
  });
});
