import BN from 'bn.js';
import fs from 'fs';
import { groupByIgnoringDigits } from '.';

export function coveredCallOption(strikePrice: BN, max: BN) {}

type CETRange = {
  indexFrom: BN;
  indexTo: BN;
};

type CETPayout = {
  range: CETRange;
  payout: BN;
};

class CoveredCallContractCurve {
  constructor(
    private quantity: BN,
    private strikePrice: BN,
    private upperBound: BN,
    private oracleBound: BN
  ) {}

  // price = (strikePrice * contractQuantity)/(contractQuantity - payout)
  getPriceForPayout(payout: BN): BN {
    return this.strikePrice.mul(this.quantity).div(this.quantity.sub(payout));
  }

  generatePayouts(rounding: BN) {
    const OTMPayout = {
      payout: new BN(0),
      range: {
        indexFrom: new BN(0),
        indexTo: this.strikePrice.sub(new BN(1)),
      },
    };

    const result: CETPayout[] = [OTMPayout];

    let nextIndex = new BN(this.strikePrice);

    for (let i = new BN(rounding); i.lt(this.quantity); i = i.add(rounding)) {
      const price = this.getPriceForPayout(i);

      if (price.gte(this.upperBound)) {
        result.push({
          payout: this.quantity,
          range: {
            indexFrom: nextIndex,
            indexTo: this.oracleBound,
          },
        });

        break;
      }

      result.push({
        payout: i,
        range: {
          indexFrom: nextIndex,
          indexTo: price,
        },
      });

      nextIndex = price.add(new BN(1));
    }

    return result;
  }
}

const contractQuantity = new BN(1000000);
const strikePrice = new BN(15000);

const oracleDigits = 20;
const upperBoundDigits = 20;

const upperBound = new BN('1'.repeat(upperBoundDigits), 2);
const oracleBound = new BN('1'.repeat(oracleDigits), 2);

const ROUNDING = new BN(250);

console.log(
  `Computing CET payout ranges for 1 BTC covered call strike: ${strikePrice.toNumber()}, price upperBound: $${upperBound.toNumber()}, rounding: ${
    ROUNDING.toNumber() / 100000000
  } BTC`
);
console.time('Generating CET payouts ranges');

const test = new CoveredCallContractCurve(
  contractQuantity,
  strikePrice,
  upperBound,
  oracleBound
);

const payouts = test.generatePayouts(ROUNDING);

const groups: any[] = [];

payouts.forEach((p) => {
  groups.push({
    payout: p.payout.toNumber(),
    groups: groupByIgnoringDigits(p.range.indexFrom, p.range.indexTo, 2, 20),
  });
});

console.log(groups[0]);
console.log(groups[1]);

console.timeEnd('Generating CET payouts ranges');

console.log(`Generated ${groups.length} payout ranges.`);

fs.writeFileSync('output.json', JSON.stringify(groups));

console.log(groups.reduce((acc, group) => acc + group.groups.length, 0));
