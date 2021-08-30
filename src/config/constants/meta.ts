import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Cub Finance',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by Cub Finance), NFTs, and more, on a platform you can trust.',
  image: 'https://cubdefi.com/images/2logos',
}

export const customMeta: { [key: string]: PageMeta } = {
  '/': {
    title: 'Home | Cub Finance',
  },
  '/competition': {
    title: 'Trading Battle | Cub Finance',
  },
  '/prediction': {
    title: 'Prediction | Cub Finance',
  },
  '/farms': {
    title: 'Farms | Cub Finance',
  },
  '/pools': {
    title: 'Pools | Cub Finance',
  },
  '/lottery': {
    title: 'Lottery | Cub Finance',
  },
  '/collectibles': {
    title: 'Collectibles | Cub Finance',
  },
  '/ido': {
    title: 'Initial DEX Offering | Cub Finance',
  },
  '/teams': {
    title: 'Leaderboard | Cub Finance',
  },
  '/profile/tasks': {
    title: 'Task Center | Cub Finance',
  },
  '/profile': {
    title: 'Your Profile | Cub Finance',
  },
}
