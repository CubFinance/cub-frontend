import { MenuEntry } from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: 'http://cubdefi.com/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://exchange.cubdefi.com/',
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.cubdefi.com/#/pool',
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
  {
    label: 'Kingdoms',
    icon: 'PawIcon',
    href: '/kingdoms',
    status: {
      text: 'SOON',
      color: 'warning',
    },
  },
  {
    label: 'LeoBridge',
    icon: 'NftIcon',
    href: "https://bridge.cubdefi.com",
    status: {
      text: 'SOON',
      color: 'warning',
    },
  },
  {
    label: 'Info',
    icon: 'InfoIcon',
    items: [
      {
        label: 'GitHub',
        href: 'https://github.com/CubFinance',
      },
      {
        label: 'PancakeSwap',
        href: 'https://pancakeswap.info/token/0x50d809c74e0b8e49e7b4c65bb3109abe3ff4c1c1',
      },
      {
        label: 'CoinMarketCap',
        href: 'https://coinmarketcap.com/currencies/cub-finance/',
      },
    ],
  },
  {
    label: 'Docs',
    icon: 'TicketIcon',
    href: 'https://docs.cubdefi.com/',
  },
  {
    label: 'Roadmap',
    icon: 'MoreIcon',
    href: 'https://docs.cubdefi.com/roadmap',
  },
  {
    label: "Tokenized Blogging",
    icon: "TokenizeIcon",
    href: "https://leofinance.io/",
  },
  {
    label: "Blog",
    icon: "BlogIcon",
    href: "https://leofinance.io/@leofinance",
  },
  {
    label: 'CertiK Audit',
    icon: 'AuditIcon',
    href: 'https://www.certik.org/projects/cubfinance',
  },
]

export default config
