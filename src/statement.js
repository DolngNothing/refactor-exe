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

caculateCredit = (audience, play) => {
  let credit=0;
  credit += Math.max(audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === play.type) credit += Math.floor(audience / 5);
    return credit;
}

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    thisAmount = caculateAmount(perf.audience, play);
    totalAmount += thisAmount;
    // add volume credits
    volumeCredits += caculateCredit(perf.audience, play);
    //print line for this order
    result += ` ${play.name}: ${formatUSD(thisAmount)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${formatUSD(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

module.exports = {
  statement,
};
