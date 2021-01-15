import { expect } from 'chai';
import { dropUntil } from '../utils';

describe('utils', function () {
  it('drop until non-zero', function () {
    const input = [0, 0, 0, 0, 1, 2, 3, 4, 5];
    const expected = [1, 2, 3, 4, 5];

    const result = dropUntil(input, (d) => d !== 0);
    expect(result).eql(expected);
  });

  it('drop until non-zero, all zero', function () {
    const input = [0, 0, 0, 0];
    const expected: number[] = [];

    const result = dropUntil(input, (d) => d !== 0);
    expect(result).eql(expected);
  });
});
