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

renderTxt = (data) => {
  let result = `Statement for ${data.customer}\n`;
  for(let i=0;i<data.performances.length;i++){
    result += ` ${data.plays[data.performances[i].playID].name}: ${data.amounts[i]} (${data.performances[i].audience} seats)\n`;
  }
  result+=renderEnding(data.totalAmount,data.totalCredit);
  return result;
}

createData=(invoice, plays)=>{
  const data={
    customer:invoice.customer,
    amounts:[],
    plays:plays,
    performances:invoice.performances,
    totalAmount:0,
    totalCredit:0
  }
  for (let perf of invoice.performances) {
    data.amounts.push(formatUSD(caculateAmount(perf.audience, plays[perf.playID])));
  }
  data.totalAmount=caculateTotalAmount(invoice, plays);
  data.totalCredit= caculateCredit(invoice, plays);
  return data;
}

function statement(invoice, plays) {
  data=createData(invoice, plays);
  return renderTxt(data);
}

function statementHtml(invoice, plays){
  data=createData(invoice, plays);
  return renderHtml(data);
}

renderHtml = (data) =>{
  let result = `<h1>Statement for ${data.customer}</h1>\n<table>\n<tr><th>play</th><th>seats</th><th>cost</th></tr>`;
  for(let i=0;i<data.performances.length;i++){
    result+=` <tr><td>${data.plays[data.performances[i].playID].name}</td><td>${data.performances[i].audience}</td><td>${data.amounts[i]}</td></tr>\n`
    
  }
  result+=`</table>\n<p>Amount owed is <em>${formatUSD(data.totalAmount)}</em></p>\n<p>You earned <em>${data.totalCredit}</em> credits</p>\n`
  return result;
}


module.exports = {
  statement,statementHtml
};
