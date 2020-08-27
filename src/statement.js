caculateAmount = (audience, play) => {
  let thisAmount = 0;
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (audience > 30) {
        thisAmount += 1000 * (audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (audience > 20) {
        thisAmount += 10000 + 500 * (audience - 20);
      }
      thisAmount += 300 * audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

formatUSD = (thisAmount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(thisAmount / 100)
}

caculateTotalAmount = (invoice, plays) => {
  let total = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    total += caculateAmount(perf.audience, play);
  }
  return total;
}

caculateCredit = (invoice, plays) => {
  let totalCredit = 0;
  for (let perf of invoice.performances) {
    let credit = 0;
    const play = plays[perf.playID];
    credit += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === play.type) credit += Math.floor(perf.audience / 5);

    totalCredit += credit;
  }
  return totalCredit
}

renderEnding = (totalAmount, volumeCredits) => {
  let result = `Amount owed is ${formatUSD(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

renderInfo = (audience,play) => {
  return ` ${play.name}: ${formatUSD(caculateAmount(audience, play))} (${audience} seats)\n`;
}

function statement(invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    result += renderInfo(perf.audience,plays[perf.playID])
  }
  return result += renderEnding(caculateTotalAmount(invoice, plays), caculateCredit(invoice, plays));
}


module.exports = {
  statement,
};
