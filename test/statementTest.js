const test = require('ava');
const { statement ,statementHtml} = require('../src/statement');

test('case1 ', t => {
  //given
  const invoice = {
      'customer': 'BigCo',
      'performances': [
          {
              'playID': 'hamlet',
              'audience': 55,
          },
          {
              'playID': 'as-like',
              'audience': 35,
          },
          {
              'playID': 'othello',
              'audience': 40,
          },
      ],
  };
  //when
  const result = statement(invoice, plays);
  const expectResult = 'Statement for BigCo\n'
      + ` Hamlet: $650.00 (55 seats)\n`
      + ` As You Like It: $580.00 (35 seats)\n`
      + ` Othello: $500.00 (40 seats)\n`
      + `Amount owed is $1,730.00\n`
      + `You earned 47 credits \n`;
  //then
  t.is(result, expectResult);
});

test('case2 without performance ', t => {
  //given
  const invoice = {
      'customer': 'BigCo',
      'performances': [],
  };
  //when
  const result = statement(invoice, plays);
  const expectResult = `Statement for BigCo\nAmount owed is $0.00\nYou earned 0 credits \n`;
  //then
  t.is(result, expectResult);
});

test('case3 one performance and audience is 30', t => {
  //given
  const invoice = {
      'customer': 'BigCo',
      'performances': [{
        'playID': 'hamlet',
        'audience': 30,
      }],
  };
  //when
  const result = statement(invoice, plays);
  const expectResult = 'Statement for BigCo\n'
  + ` Hamlet: $400.00 (30 seats)\n`
  + `Amount owed is $400.00\n`
  + `You earned 0 credits \n`;
  //then
  t.is(result, expectResult);
});

test('case4 one performance hamlet and audience is 31', t => {
  //given
  const invoice = {
      'customer': 'BigCo',
      'performances': [{
        'playID': 'hamlet',
        'audience': 31,
      }],
  };
  //when
  const result = statement(invoice, plays);
  const expectResult = 'Statement for BigCo\n'
  + ` Hamlet: $410.00 (31 seats)\n`
  + `Amount owed is $410.00\n`
  + `You earned 1 credits \n`;
  //then
  t.is(result, expectResult);
});

test('case5 one performance aslike and audience is 20', t => {
  //given
  const invoice = {
      'customer': 'BigCo',
      'performances': [{
        'playID': 'as-like',
        'audience': 20,
      }],
  };
  //when
  const result = statement(invoice, plays);
  const expectResult = 'Statement for BigCo\n'
  + ` As You Like It: $360.00 (20 seats)\n`
  + `Amount owed is $360.00\n`
  + `You earned 4 credits \n`;
  //then
  t.is(result, expectResult);
});

test('case6 one performance aslike and audience is 21', t => {
  //given
  const invoice = {
      'customer': 'BigCo',
      'performances': [{
        'playID': 'as-like',
        'audience': 21,
      }],
  };
  //when
  const result = statement(invoice, plays);
  const expectResult = 'Statement for BigCo\n'
  + ` As You Like It: $468.00 (21 seats)\n`
  + `Amount owed is $468.00\n`
  + `You earned 4 credits \n`;
  //then
  t.is(result, expectResult);
});

test('case7 one unknown performance', t => {
  //given
  const invoice = {
      'customer': 'BigCo',
      'performances': [{
        'playID': '6666',
        'audience': 21,
      }],
  }
  //when
  try{
    statement(invoice, plays);
    t.fail();
  }catch(e){
    t.is(e.message,`unknown type: tragedyX`)
  }
  
});

test('case8 html', t => {
  const invoice = {
    'customer': 'BigCo',
    'performances': [
        {
            'playID': 'hamlet',
            'audience': 55,
        },
        {
            'playID': 'as-like',
            'audience': 35,
        },
        {
            'playID': 'othello',
            'audience': 40,
        },
    ],
};
//when
const result = statementHtml(invoice, plays);
//then
t.is(result, '<h1>Statement for BigCo</h1>\n' +
    '<table>\n' +
    '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
    ' <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n' +
    ' <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
    ' <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
    '</table>\n' +
    '<p>Amount owed is <em>$1,730.00</em></p>\n' +
    '<p>You earned <em>47</em> credits</p>\n');
});


const invoice = {
  'customer': 'BigCo',
  'performances': [
    {
      'playID': 'hamlet',
      'audience': 55,
    },
    {
      'playID': 'as-like',
      'audience': 35,
    },
    {
      'playID': 'othello',
      'audience': 40,
    },
  ],
};


const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy',
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy',
  },
  '6666': {
    'name': 'Othello',
    'type': 'tragedyX',
  }
};