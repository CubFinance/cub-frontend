import { MenuEntry } from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'http://exchange.cubdefi.com/',
      },
      {
        label: 'Liquidity',
        href: 'http://exchange.cubdefi.com/#/pool',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: 'Dens',
    icon: 'PoolIcon',
    href: '/dens',
  },
  // {
  //   label: 'Pools',
  //   icon: 'PoolIcon',
  //   href: '/pools',
  // },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: 'NFT',
  //   icon: 'NftIcon',
  //   href: '/nft',
  // },
  {
    label: 'Info',
    icon: 'InfoIcon',
    items: [
      {
        label: 'PancakeSwap',
        href: 'https://pancakeswap.info/token/0xF952Fc3ca7325Cc27D15885d37117676d25BfdA6',
      },
      {
        label: 'CoinGecko (Coming Soon)',
        href: '#',
      },
      {
        label: 'CoinMarketCap (Coming Soon)',
        href: '#',
      },
      {
        label: 'AstroTools',
        href: 'https://app.astrotools.io/pancake-pair-explorer/0x19e7cbecdd23a16dfa5573df54d98f7caae03019',
      },
      {
        label: 'Docs',
        href: 'https://docs.cubdefi.com',
      },
      {
        label: 'Roadmap',
        href: 'https://docs.cubdefi.com/roadmap',
      },
      {
        label: 'Discord',
        href: 'https://discord.gg/E4jePHe',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      // {
      //   label: 'Audit by Hacken',
      //   href: 'https://www.goosedefi.com/files/hackenAudit.pdf',
      // },
      {
        label: "Github",
        href: "https://github.com/CubFinance/",
      },
      // {
      //   label: "Docs",
      //   href: "https://goosedefi.gitbook.io/goose-finance/",
      // },
      {
        label: "Blog",
        href: "https://leofinance.io/@leofinance",
      },
    ],
  },
  // {
  //   label: 'Audit by Hacken',
  //   icon: 'AuditIcon',
  //   href: 'https://www.goosedefi.com/files/hackenAudit.pdf',
  // },
]

export default config
