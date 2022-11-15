// import contracts from './contracts'
import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  // {
  //   pid: 0,
  //   lpSymbol: 'BNB-BUSD LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x1B96B92314C44b159149f7E0303511fB2Fc4774f',
  //   },
  //   token: tokens.wbnb,
  //   quoteToken: tokens.busd,
  // },
  // {
  //   pid: 10,
  //   lpSymbol: 'CUB-BUSD LP (v1)',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x0EF564D4F8D6C0ffE13348A32e21EFd55e508e84',
  //   },
  //   token: tokens.cub,
  //   quoteToken: tokens.busd,
  // },
  // {
  //   pid: 11,
  //   lpSymbol: 'CUB-BNB LP (v1)',
  //   lpAddresses: {
  //     97: '',
  //     56: '0xc08C74dC9EF46C6dB122b30c48a659831017DD2E',
  //   },
  //   token: tokens.cub,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 9,
  //   lpSymbol: 'bLEO-BNB LP (v1)',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x243E060DEcA0499fCaE6ABe548C0115faaBa0ed4',
  //   },
  //   token: tokens.bleo,
  //   quoteToken: tokens.wbnb,
  // },
  {
    pid: 6,
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xc15fa3E22c912A276550F3E5FE3b0Deb87B55aCd',
    },
    token: tokens.usdt,
    quoteToken: tokens.busd,
  },
  {
    pid: 8,
    lpSymbol: 'BTCB-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x7561EEe90e24F3b348E1087A005F78B4c8453524',
    },
    token: tokens.btcb,
    quoteToken: tokens.wbnb,
  },
  // This farm is here for BAKE price for kingdom vault pid 5
  {
    pid: 4,
    lpSymbol: 'BAKE-BNB LP',
    lpAddresses: {
      97: '0xE66790075ad839978fEBa15D4d8bB2b415556a1D',
      56: '0x3Da30727ed0626b78C212e81B37B97A8eF8A25bB',
    },
    token: tokens.bake,
    quoteToken: tokens.wbnb,
  },
  // This farm is here for BELT price for kingdom vault pid 6-8
  {
    pid: 5,
    lpSymbol: 'BELT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xF3Bc6FC080ffCC30d93dF48BFA2aA14b869554bb',
    },
    token: tokens.belt,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 7,
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x70D8929d04b60Af4fb9B58713eBcf18765aDE422',
    },
    token: tokens.eth,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'DAI-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x3aB77e40340AB084c3e23Be8e5A6f7afed9D41DC',
    },
    token: tokens.dai,
    quoteToken: tokens.busd,
  },
  // {
  //   pid: 23,
  //   lpSymbol: 'DEC-BUSD LP (v1)',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x4c79edab89848f34084283bb1fe8eac2dca649c3',
  //   },
  //   token: tokens.dec,
  //   quoteToken: tokens.busd,
  // },

  // {
  //   pid: 4,
  //   lpSymbol: 'USDC-BUSD LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x680Dd100E4b394Bda26A59dD5c119A391e747d18',
  //   },
  //   token: tokens.usdc,
  //   quoteToken: tokens.busd,
  // },
  // {
  //   pid: 5,
  //   lpSymbol: 'DOT-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0xbCD62661A6b1DEd703585d3aF7d7649Ef4dcDB5c',
  //   },
  //   token: tokens.dot,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 2,
  //   lpSymbol: 'CAKE-BUSD LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x0Ed8E0A2D99643e1e65CCA22Ed4424090B8B7458',
  //   },
  //   token: tokens.cake,
  //   quoteToken: tokens.busd,
  // },
  // {
  //   pid: 1,
  //   lpSymbol: 'CAKE-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
  //   },
  //   token: tokens.cake,
  //   quoteToken: tokens.wbnb,
  // },

  // {
  //   pid: 13,
  //   isTokenOnly: true,
  //   lpSymbol: 'bLEO',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x243E060DEcA0499fCaE6ABe548C0115faaBa0ed4', // bLEO-WBNB LP
  //   },
  //   tokenSymbol: 'bLEO',
  //   tokenAddresses: {
  //     97: '',
  //     56: '0x6421531AF54C7B14Ea805719035EBf1e3661c44A',
  //   },
  //   quoteTokenSymbol: QuoteToken.BNB,
  //   quoteTokenAdresses: contracts.wbnb,
  // },

  // {
  //   pid: 14,
  //   isTokenOnly: true,
  //   lpSymbol: 'BUSD',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f', // BNB-BUSD LP
  //   },
  //   token: tokens.busd,
  //   quoteToken: tokens.busd,
  // },
  // {
  //   pid: 15,
  //   isTokenOnly: true,
  //   lpSymbol: 'WBNB',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f', // BNB-BUSD LP
  //   },
  //   token: tokens.wbnb,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 16,
  //   isTokenOnly: true,
  //   lpSymbol: 'USDT',
  //   lpAddresses: {
  //     97: '',
  //     56: '0xc15fa3e22c912a276550f3e5fe3b0deb87b55acd', // USDT-BUSD LP
  //   },
  //   token: tokens.usdt,
  //   quoteToken: tokens.busd,
  // },
  {
    pid: 12,
    isTokenOnly: true,
    lpSymbol: 'CUB',
    lpAddresses: {
      97: '',
      56: '0xfdF68922460d7508f84bD55ACB9D276d3f9a2c31', // CUB-BUSD LP
    },
    token: tokens.cub,
    quoteToken: tokens.busd,
  },
  {
    pid: 17,
    isTokenOnly: true,
    lpSymbol: 'BTCB',
    lpAddresses: {
      97: '',
      56: '0xb8875e207ee8096a929d543c9981c9586992eacb', // BTCB-BUSD LP
    },
    token: tokens.btcb,
    quoteToken: tokens.busd,
  },
  {
    pid: 18,
    isTokenOnly: true,
    lpSymbol: 'ETH',
    lpAddresses: {
      97: '',
      56: '0xd9a0d1f5e02de2403f68bb71a15f8847a854b494', // ETH-BUSD LP
    },
    token: tokens.eth,
    quoteToken: tokens.busd,
  },
  {
    pid: 21,
    isTokenOnly: true,
    lpSymbol: 'DOT',
    lpAddresses: {
      97: '',
      56: '0x54c1ec2f543966953f2f7564692606ea7d5a184e', // DOT-BUSD LP
    },
    token: tokens.dot,
    quoteToken: tokens.busd,
  },
  // {
  //   pid: 19,
  //   isTokenOnly: true,
  //   lpSymbol: 'DAI',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x3ab77e40340ab084c3e23be8e5a6f7afed9d41dc', // DAI-BUSD LP
  //   },
  //   token: tokens.dai,
  //   quoteToken: tokens.busd,
  // },
  // {
  //   pid: 20,
  //   isTokenOnly: true,
  //   lpSymbol: 'USDC',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x680dd100e4b394bda26a59dd5c119a391e747d18', // USDC-BUSD LP
  //   },
  //   token: tokens.usdc,
  //   quoteToken: tokens.busd,
  // },

  // {
  //   pid: 22,
  //   isTokenOnly: true,
  //   lpSymbol: 'CAKE',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458', // CAKE-BUSD LP
  //   },
  //   token: tokens.cake,
  //   quoteToken: tokens.busd,
  // },

  // V2 Farms
  {
    pid: 33,
    pcsVersion: 2,
    lpSymbol: 'bHBD-bHIVE',
    lpAddresses: {
      97: '',
      56: '0x625e672ee08e89afd5bf1300831b6a8433fee9f5',
    },
    token: tokens.bhive,
    quoteToken: tokens.bhbd,
  },
  {
    pid: 30,
    pcsVersion: 2,
    lpSymbol: 'bHBD-BUSD',
    lpAddresses: {
      97: '',
      56: '0x8b97f5b65532d2f89ff0e60e308540bb20e47933',
    },
    token: tokens.bhbd,
    quoteToken: tokens.busd,
  },
  {
    pid: 32,
    pcsVersion: 2,
    lpSymbol: 'bHBD-CUB',
    lpAddresses: {
      97: '',
      56: '0x93c52e0213376a78c8b1c0b7d1f9fcba057c9a0d',
    },
    token: tokens.bhbd,
    quoteToken: tokens.cub,
  },
  {
    pid: 31,
    pcsVersion: 2,
    lpSymbol: 'bHIVE-CUB',
    lpAddresses: {
      97: '',
      56: '0xbb98f40a60bfcc5a12b529c860fcdcd03830c8be',
    },
    token: tokens.bhive,
    quoteToken: tokens.cub,
  },
  {
    pid: 29,
    pcsVersion: 2,
    lpSymbol: 'BUSD-CUB LP (v2)',
    lpAddresses: {
      97: '',
      56: '0xfdF68922460d7508f84bD55ACB9D276d3f9a2c31',
    },
    token: tokens.cub,
    quoteToken: tokens.busd,
  },
  {
    pid: 27,
    pcsVersion: 2,
    lpSymbol: 'BNB-CUB LP (v2)',
    lpAddresses: {
      97: '',
      56: '0x7BaE0d7D2760E681559fbb502b43fFA26561bA24',
    },
    token: tokens.cub,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 28,
    pcsVersion: 2,
    lpSymbol: 'BLEO-BNB LP (v2)',
    lpAddresses: {
      97: '',
      56: '0x0Bca6e9B2C6C83Ebd457fB0D12fa5763114A8920',
    },
    token: tokens.bleo,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 26,
    pcsVersion: 2,
    lpSymbol: 'DEC-BUSD LP (v2)',
    lpAddresses: {
      97: '',
      56: '0x6125029A56CcdBE2625491b57F889308Dd7b9085',
    },
    token: tokens.dec,
    quoteToken: tokens.busd,
  },
  {
    pid: 25,
    pcsVersion: 2,
    lpSymbol: 'CAKEPOP-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x305d0Fb73BaA4E8E242E6BDD3bb43a6667ABddf5',
    },
    token: tokens.cakepop,
    quoteToken: tokens.busd,
  },

  // KINGDOMS
  {
    pid: 34,
    altPid: 13,
    compounding: 0,
    isKingdom: true,
    isKingdomToken: true,
    isKingdomLocked: true,
    farmType: "Cub DeFi",
    lpSymbol: "CUB",
    lpAddresses: {
      97: '',
      56: '0x0EF564D4F8D6C0ffE13348A32e21EFd55e508e84',
    },
    token: tokens.cub,
    quoteToken: tokens.busd,
    kingdomContract: '0x08bea2702d89abb8059853d654d0838c5e06fe0b'
  },
  {
    pid: 4,
    altPid: 12,
    compounding: 720,
    isKingdom: true,
    isKingdomToken: true,
    farmType: 'Cub DeFi',
    lpSymbol: 'CUB',
    lpAddresses: {
      97: '',
      56: '0x0EF564D4F8D6C0ffE13348A32e21EFd55e508e84', // CUB-BUSD LP
    },
    token: tokens.cub,
    quoteToken: tokens.busd,
    kingdomContract: '0xc2adf5fc4d4e6c2cc97f8190acbdf808c689117c',
  },
  {
    pid: 0,
    altPid: 0,
    compounding: 4200,
    isKingdom: true,
    isKingdomToken: true,
    farmType: 'Pancake v2',
    lpSymbol: 'CAKE',
    lpAddresses: {
      97: '',
      56: '0x0ed8e0a2d99643e1e65cca22ed4424090b8b7458', // CAKE-BUSD LP
    },
    token: tokens.cake,
    quoteToken: tokens.busd,
    kingdomContract: '0x77440f4dc7b4ef591e78d460374bd12d3d6bdad8',
  },
  {
    pid: 1,
    altPid: 252,
    compounding: 365,
    isKingdom: true,
    farmType: 'Pancake v2',
    lpSymbol: 'BNB-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16',
    },
    token: tokens.wbnb,
    quoteToken: tokens.busd,
    kingdomContract: '0x701d4f8168b00abbd948d36e11added4e1cac742',
  },
  {
    pid: 2,
    altPid: 261,
    compounding: 365,
    isKingdom: true,
    farmType: 'Pancake v2',
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x74e4716e431f45807dcf19f284c7aa99f18a4fbc',
    },
    token: tokens.eth,
    quoteToken: tokens.wbnb,
    kingdomContract: '0x3582933accc5732484138a2dd61fcdd02d0a021c',
  },
  {
    pid: 3,
    altPid: 255,
    compounding: 365,
    isKingdom: true,
    farmType: 'Pancake v2',
    lpSymbol: 'DOT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xDd5bAd8f8b360d76d12FdA230F8BAF42fe0022CF',
    },
    token: tokens.dot,
    quoteToken: tokens.wbnb,
    kingdomContract: '0x03e48360dc132a1838492b6870c98d2bd895ea9a',
  },
  {
    pid: 6,
    altPid: 7,
    compounding: 365,
    isKingdom: true,
    isKingdomToken: true,
    farmType: 'Belt',
    lpSymbol: 'beltBTC',
    lpAddresses: {
      97: '',
      56: '0x51bd63f240fb13870550423d208452ca87c44444',
    },
    token: tokens.beltbtc,
    quoteToken: tokens.btcb,
    kingdomContract: '0x3f1b0319E2EbeD04D5e2ce367393914bBf8f59f5',
  },
  {
    pid: 7,
    altPid: 8,
    compounding: 365,
    isKingdom: true,
    isKingdomToken: true,
    farmType: 'Belt',
    lpSymbol: 'beltETH',
    lpAddresses: {
      97: '',
      56: '0xaa20e8cb61299df2357561c2ac2e1172bc68bc25',
    },
    token: tokens.belteth,
    quoteToken: tokens.eth,
    kingdomContract: '0x3f2C7e9cf2e3a718eedf52403e0FB71b9AfC51b0',
  },
  {
    pid: 8,
    altPid: 3,
    compounding: 365,
    isKingdom: true,
    isKingdomToken: true,
    farmType: 'Belt',
    lpSymbol: '4belt',
    lpAddresses: {
      97: '',
      56: '0x9cb73f20164e399958261c289eb5f9846f4d1404',
    },
    token: tokens.beltusd,
    quoteToken: tokens.busd,
    kingdomContract: '0x5860046Ccf3ab8D840F1ac15A547E0c2bBECA6F0',
  },
  {
    pid: 9,
    altPid: 262,
    compounding: 365,
    isKingdom: true,
    farmType: 'Pancake v2',
    lpSymbol: 'BTC-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x61eb789d75a95caa3ff50ed7e47b96c132fec082',
    },
    token: tokens.btcb,
    quoteToken: tokens.wbnb,
    kingdomContract: '0xcd0778d48e3aa98c91633d844d1d83c7be282d5f',
  },
  {
    pid: 10,
    altPid: 432,
    compounding: 365,
    isKingdom: true,
    farmType: 'Pancake v2',
    lpSymbol: 'SPS-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xfdfde3af740a22648b9dd66d05698e5095940850',
    },
    token: tokens.sps,
    quoteToken: tokens.wbnb,
    kingdomContract: '0xc18cd88a97f39b1db91990c79227223ae6f5efb2',
  },

  // INACTIVE KINGDOMS, alloc = 0
  {
    pid: 5,
    compounding: 365,
    isKingdom: true,
    farmType: 'Bakery',
    lpSymbol: 'BTC-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x58521373474810915b02FE968D1BCBe35Fc61E09',
    },
    token: tokens.btcb,
    quoteToken: tokens.wbnb,
    kingdomContract: '0xbdc40a031f6908a8203fb1c75bb2b9c4abf59e2e',
  },
];

export default farms