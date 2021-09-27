import { makeActionCreator } from '../../helper/Store';

export const BetTypes = {
  CREATE: 'Bet/CREATE',
  CREATE_FAILED: 'Bet/CREATE_FAILED',
  CREATE_SUCCEEDED: 'Bet/CREATE_SUCCEEDED',
  FETCH_OPEN_BETS: 'Bet/FETCH_OPEN_BETS',
  FETCH_OPEN_BETS_FAILED: 'Bet/FETCH_OPEN_BETS_FAILED',
  FETCH_OPEN_BETS_SUCCEEDED: 'Bet/FETCH_OPEN_BETS_SUCCEEDED',
  FETCH_OUTCOMES: 'Bet/FETCH_OUTCOMES',
  FETCH_SELL_OUTCOMES: 'Bet/FETCH_SELL_OUTCOMES',
  PLACE: 'Bet/PLACE',
  PLACE_FAILED: 'Bet/PLACE_FAILED',
  PLACE_SUCCEEDED: 'Bet/PLACE_SUCCEEDED',
  PULL_OUT_BET: 'Bet/PULL_OUT_BET',
  PULL_OUT_BET_FAILED: 'Bet/PULL_OUT_BET_FAILED',
  PULL_OUT_BET_SUCCEEDED: 'Bet/PULL_OUT_BET_SUCCEEDED',
  SET_OUTCOMES: 'Bet/SET_OUTCOMES',
  SET_SELL_OUTCOMES: 'Bet/SET_SELL_OUTCOMES',
  FETCH_TRADE_HISTORY: 'Bet/FETCH_TRADE_HISTORY',
  FETCH_TRADE_HISTORY_SUCCESS: 'Bet/FETCH_TRADE_HISTORY_SUCCESS',
  FETCH_ALL: 'Bet/FETCH_ALL',
  FETCH_ALL_SUCCEEDED: 'Bet/FETCH_ALL_SUCCEEDED',
  FETCH_ALL_FAILED: 'Bet/FETCH_ALL_FAILED',
  FETCH_FILTERED: 'Bet/FETCH_FILTERED',
  FETCH_FILTERED_SUCCESS: 'Bet/FETCH_FILTERED_SUCCESS',
  FETCH_FILTERED_FAIL: 'Bet/FETCH_FILTERED_FAIL',
  SET_DEFAULT_PARAMS_VALUES: 'Bet/SET_DEFAULT_PARAMS_VALUES',
  RESET_DEFAULT_PARAMS_VALUES: 'Bet/RESET_DEFAULT_PARAMS_VALUES',
};

const fetchAll = makeActionCreator(BetTypes.FETCH_ALL);

const fetchAllSucceeded = makeActionCreator(BetTypes.FETCH_ALL_SUCCEEDED, {
  bets: null,
});

const fetchAllFailed = makeActionCreator(BetTypes.FETCH_ALL_FAILED);

const initiateFetchFilteredBets = (params = {}) => {
  return {
    type: BetTypes.FETCH_FILTERED,
    payload: params,
  };
};

const fetchFilteredBetsSuccess = payload => ({
  type: BetTypes.FETCH_FILTERED_SUCCESS,
  payload,
});

const fetchFilteredBetsFail = () => ({
  type: BetTypes.FETCH_FILTERED_FAIL,
});

const setDefaultParamsValues = payload => ({
  type: BetTypes.SET_DEFAULT_PARAMS_VALUES,
  payload,
});

const resetDefaultParamsValues = payload => ({
  type: BetTypes.RESET_DEFAULT_PARAMS_VALUES,
  payload,
});

const create = makeActionCreator(BetTypes.CREATE, {
  eventId: null,
  marketQuestion: null,
  description: null,
  outcomes: null,
  endDate: null,
  liquidityAmount: 1,
});

const createSucceeded = makeActionCreator(BetTypes.CREATE_SUCCEEDED, {
  bet: null,
});

const createFailed = makeActionCreator(BetTypes.CREATE_FAILED);

const place = makeActionCreator(BetTypes.PLACE, {
  betId: null,
  amount: null,
  outcome: null,
});

const placeSucceeded = makeActionCreator(BetTypes.PLACE_SUCCEEDED, {
  betId: null,
  amount: null,
  outcome: null,
});

const placeFailed = makeActionCreator(BetTypes.PLACE_FAILED);

const setOutcomes = makeActionCreator(BetTypes.SET_OUTCOMES, {
  outcomes: {},
});

const setSellOutcomes = makeActionCreator(BetTypes.SET_SELL_OUTCOMES, {
  sellOutcomes: {},
});

const fetchSellOutcomes = makeActionCreator(BetTypes.FETCH_SELL_OUTCOMES, {
  betId: null,
  amount: null,
});

const fetchOutcomes = makeActionCreator(BetTypes.FETCH_OUTCOMES, {
  betId: null,
  amount: null,
});

const fetchOpenBets = makeActionCreator(BetTypes.FETCH_OPEN_BETS);

const fetchOpenBetsSucceeded = makeActionCreator(
  BetTypes.FETCH_OPEN_BETS_SUCCEEDED,
  {
    openBets: null,
  }
);

const fetchOpenBetsFailed = makeActionCreator(BetTypes.FETCH_OPEN_BETS_FAILED);

const pullOutBet = makeActionCreator(BetTypes.PULL_OUT_BET, {
  betId: null,
  outcome: null,
  amount: null,
});

const pullOutBetSucceeded = makeActionCreator(BetTypes.PULL_OUT_BET_SUCCEEDED);

const pullOutBetFailed = makeActionCreator(BetTypes.PULL_OUT_BET_FAILED);

const fetchTradeHistory = makeActionCreator(BetTypes.FETCH_TRADE_HISTORY);

const fetchTradeHistorySuccess = makeActionCreator(
  BetTypes.FETCH_TRADE_HISTORY_SUCCESS,
  {
    trades: [],
  }
);

export const BetActions = {
  create,
  createFailed,
  createSucceeded,
  fetchOpenBets,
  fetchOpenBetsFailed,
  fetchOpenBetsSucceeded,
  fetchOutcomes,
  fetchSellOutcomes,
  place,
  placeFailed,
  placeSucceeded,
  pullOutBet,
  pullOutBetFailed,
  pullOutBetSucceeded,
  setOutcomes,
  setSellOutcomes,
  fetchTradeHistory,
  fetchTradeHistorySuccess,
  fetchAll,
  fetchAllSucceeded,
  fetchAllFailed,
  initiateFetchFilteredBets,
  fetchFilteredBetsSuccess,
  fetchFilteredBetsFail,
  setDefaultParamsValues,
  resetDefaultParamsValues,
};
