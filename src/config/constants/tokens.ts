const tokens = {
  bnb: {
    symbol: 'BNB',
    projectLink: 'https://www.binance.com/',
  },
  cake: {
    symbol: 'CAKE',
    address: {
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  wbnb: {
    symbol: 'BNB',
    address: {
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  busd: {
    symbol: 'BUSD',
    address: {
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.paxos.com/busd/',
  },
  eth: {
    symbol: 'ETH',
    address: {
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://ethereum.org/en/',
  },
  usdc: {
    symbol: 'USDC',
    address: {
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.centre.io/usdc',
  },
  dai: {
    symbol: 'DAI',
    address: {
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      97: '',
    },
    decimals: 18,
    projectLink: 'http://www.makerdao.com/',
  },
  dot: {
    symbol: 'DOT',
    address: {
      56: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://polkadot.network/',
  },
  usdt: {
    symbol: 'USDT',
    address: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x55d398326f99059ff775485246999027b3197955',
    },
    decimals: 18,
    projectLink: 'https://tether.to/',
  },
  btcb: {
    symbol: 'BTCB',
    address: {
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://bitcoin.org/',
  },
  cub: {
    symbol: 'CUB',
    address: {
      56: '0x50d809c74e0b8e49e7b4c65bb3109abe3ff4c1c1',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://cubdefi.com/',
  },
  bleo: {
    symbol: 'bLEO',
    address: {
      56: '0x6421531af54c7b14ea805719035ebf1e3661c44a',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://cubdefi.com/',
  },
  dec: {
    symbol: 'DEC',
    address: {
      56: '0xe9d7023f2132d55cbd4ee1f78273cb7a3e74f10a',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://cubdefi.com/',
  },
  bake: {
    symbol: 'BAKE',
    address: {
      56: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://www.bakeryswap.org/',
  },
  belt: {
    symbol: 'BELT',
    address: {
      56: '0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://beta.belt.fi/',
  },
  beltbtc: {
    symbol: 'beltBTC',
    address: {
      56: '0x51bd63f240fb13870550423d208452ca87c44444',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://belt.fi/bsc',
  },
  belteth: {
    symbol: 'beltETH',
    address: {
      56: '0xaa20e8cb61299df2357561c2ac2e1172bc68bc25',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://belt.fi/bsc',
  },
  beltusd: {
    symbol: '4belt',
    address: {
      56: '0x9cb73f20164e399958261c289eb5f9846f4d1404',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://belt.fi/bsc',
  },
  /* For IDOs */
  hzn: {
    symbol: 'HZN',
    address: {
      56: '0xC0eFf7749b125444953ef89682201Fb8c6A917CD',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://horizonprotocol.com/',
  },
  watch: {
    symbol: 'WATCH',
    address: {
      56: '0x7A9f28EB62C791422Aa23CeAE1dA9C847cBeC9b0',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://yieldwatch.net/',
  },
  bry: {
    symbol: 'BRY',
    address: {
      56: '0xf859Bf77cBe8699013d6Dbc7C2b926Aaf307F830',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://berrydata.co/',
  },
  wsote: {
    symbol: 'wSOTE',
    address: {
      56: '0x541E619858737031A1244A5d0Cd47E5ef480342c',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://soteria.finance/#/',
  },
  helmet: {
    symbol: 'Helmet',
    address: {
      56: '0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.helmet.insure/',
  },
  ten: {
    symbol: 'TEN',
    address: {
      56: '0xdFF8cb622790b7F92686c722b02CaB55592f152C',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.tenet.farm/',
  },
  ditto: {
    symbol: 'DITTO',
    address: {
      56: '0x233d91A0713155003fc4DcE0AFa871b508B3B715',
      97: '',
    },
    decimals: 9,
    projectLink: 'https://ditto.money/',
  },
  blink: {
    symbol: 'BLINK',
    address: {
      56: '0x63870A18B6e42b01Ef1Ad8A2302ef50B7132054F',
      97: '',
    },
    decimals: 6,
    projectLink: 'https://blink.wink.org',
  },
  cakepop: {
    symbol: 'CAKEPOP',
    address: {
      56: '0x2f0de2cfa6f4b3a7fd4b650a4c771e07718bb4b0',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://cakepop.app',
  },
  sps: {
    symbol: 'SPS',
    address: {
      56: '0x1633b7157e7638c4d6593436111bf125ee74703f',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://splinterlands.com/',
  },
  bhbd: {
    symbol: 'bHBD',
    address: {
      56: '0x874966221020d6ac1aed0e2cfad9cbfee0ba713b',
      97: '',
    },
    decimals: 3,
    projectLink: 'https://cubdefi.com/',
  },
  bhive: {
    symbol: 'bHIVE',
    address: {
      56: '0x9faf07d1fbc130d698e227e50d1fb72657c0a342',
      97: '',
    },
    decimals: 3,
    projectLink: 'https://cubdefi.com/',
  },
}

export default tokens
