/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import farmsConfig from 'config/constants/farms'
import isArchivedPid from 'utils/farmHelpers'
import fetchFarms from './fetchFarms'
import fetchFarmsPrices from './fetchFarmsPrices'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './fetchFarmUser'
import { FarmsState, Farm } from '../types'
import {fetchLockedKingdomUserData} from "../../views/Kingdoms/LockedKingdom/poolHelpers";

const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid))

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: '0',
    tokenBalance: '0',
    stakedBalance: '0',
    earnings: '0',
  },
}))

const initialState: FarmsState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload
      state.data = state.data.map(farm => {
        const liveFarmData = liveFarmsData.find(f => f.pid === farm.pid && f.isKingdom === farm.isKingdom)
        return { ...farm, ...liveFarmData }
      })
    },
    setFarmUserData: (state, action) => {
      // todo: seems useful too
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { pid, isKingdom, lpSymbol } = userDataEl
        const index = state.data.findIndex((farm) => farm.pid === pid && isKingdom === farm.isKingdom)
        if (isKingdom && lpSymbol === 'CUB') state.data[index] = { ...state.data[index], userData: { ...userDataEl }}
        else state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    },
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
})

// Actions
export const { setFarmsPublicData, setFarmUserData, setLoadArchivedFarmsData } = farmsSlice.actions

// Thunks
export const fetchFarmsPublicDataAsync = () => async (dispatch, getState) => {
  const fetchArchived = getState().farms.loadArchivedFarmsData
  const farmsToFetch = fetchArchived ? farmsConfig : nonArchivedFarms
  const farms = await fetchFarms(farmsToFetch)
  const farmsWithPrices = await fetchFarmsPrices(farms)

  // Modify token price based on quotetoken price, only for Belt
  const newFarms = farmsWithPrices.map((farm) => {
    if (farm.farmType === 'Belt') {
      let tokenPrice = new BigNumber(0)
      if (farm.lpSymbol !== '4belt') {

        tokenPrice = farm.quoteToken.busdPrice ? new BigNumber(farm.tokenValuePerOrigin).times(farm.quoteToken.busdPrice) : new BigNumber(0)
      } else {
        tokenPrice = new BigNumber(farm.beltRate)
      }
      const updatedFarm = { ...farm, lpTotalInQuoteToken:  farm.tokenAmount, token: { ...farm.token, busdPrice: tokenPrice.toString() } }

      return updatedFarm
    }
    return farm
  })

  dispatch(setFarmsPublicData(newFarms))
}
export const fetchFarmUserDataAsync = (account: string) => async (dispatch, getState) => {
  // todo: leaving a note here so I can find this later
  // todo: load pools user data here
  try {
    const fetchArchived = getState().farms.loadArchivedFarmsData
    const farmsToFetch = fetchArchived ? farmsConfig : nonArchivedFarms
    const lockedKingdomUserData = await fetchLockedKingdomUserData(account);
    const userFarmAllowances = await fetchFarmUserAllowances(account, farmsToFetch)
    const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, farmsToFetch)
    const userStakedBalances = await fetchFarmUserStakedBalances(account, farmsToFetch)
    const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch)

    const arrayOfUserDataObjects = userFarmAllowances.map((farmAllowance, index) => {
      if (farmsToFetch[index].isKingdomLocked) {
        return {
          pid: farmsToFetch[index].pid,
          allowance: userFarmAllowances[index],
          tokenBalance: userFarmTokenBalances[index],
          stakedBalance: userStakedBalances[index],
          earnings: userFarmEarnings[index],
          isKingdom: farmsToFetch[index].isKingdom,
          lpSymbol: farmsToFetch[index].lpSymbol,
          lockedKingdomUserData,
        }
      }

      return {
        pid: farmsToFetch[index].pid,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
        isKingdom: farmsToFetch[index].isKingdom,
        lpSymbol: farmsToFetch[index].lpSymbol,
      }
    })

    dispatch(setFarmUserData({arrayOfUserDataObjects}))
  } catch (error) {
    console.error(error)
  }
}

export default farmsSlice.reducer
