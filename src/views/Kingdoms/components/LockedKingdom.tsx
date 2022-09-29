import React from 'react';
import BigNumber from "bignumber.js";
import {FarmWithStakedValue} from "../../Farms/components/FarmCard/FarmCard";

interface KingdomProps {
    farm: FarmWithStakedValue
    removed?: boolean
    cakePrice?: BigNumber
    account?: string
    bakePrice?: BigNumber
    beltPrice?: BigNumber
    cubDen?: any
    realCakePrice?: BigNumber
    bnbDividends?: any
}

const LockedKingdom: React.FC<KingdomProps> = ({ farm, removed, cakePrice, account, bakePrice, beltPrice, cubDen, realCakePrice, bnbDividends }) => {
    return <></>;
}

export default LockedKingdom;