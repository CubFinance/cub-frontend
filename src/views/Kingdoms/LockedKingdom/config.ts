import tokens from "../../../config/constants/tokens";

const config = {
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
};

export default config;