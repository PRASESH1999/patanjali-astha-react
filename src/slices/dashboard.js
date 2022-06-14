import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
// import DateTime from 'src/utils/DateTime';


const initialState = {
  customerCount: 0,
  userCount: 0,
  activeUserCount: 0,
  presentUserCount: 0,
  punchedInUserCount: 0,
  dailyCustomers: [],
  weeklyCustomers: [],
  monthlyCustomers: [],
  page: 0,
  limit: 10,
  count: 0,
  sortModel: [],
  filters: {},
  loading: true,
};

const slice = createSlice({
  name: 'dashboards',
  initialState,
  reducers: {
    setDashboardCounts(state, action) {
      state.customerCount = action.payload.CustomerCount;
      state.userCount = action.payload.UserCount;
      state.activeUserCount = action.payload.ActiveUserCount;
      state.punchedInUserCount = action.payload.PunchedInUserCount;
      state.presentUserCount = action.payload.PresentUserCount;
    },

    setCustomersDaily(state, action) {
      state.dailyCustomers = action.payload;
    },

    setCustomersWeekly(state, action) {
      state.weeklyCustomers = action.payload;
      state.weeklyCustomers.map((b) => {
        b.x = b.Label;
        b.y = b.Count;

        return null;
      })
    },

    setCustomersMonthly(state, action) {
      state.monthlyCustomers = action.payload;
      state.monthlyCustomers.map((b) => {
        b.x = b.Label;
        b.y = b.Count;

        return null;
      })
    },

    setLimit(state, action) {
      state.limit = action.payload;
    },

    setPage(state, action) {
      state.page = action.payload;
    },

    setCount(state, action) {
      state.count = action.payload;
    },

    setSortModel(state, action) {
      state.sortModel = action.payload;
    },

    setFilter(state, action) {
      state.filters = action.payload;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

export const { reducer } = slice;

export const getDashboardCounts = () => async (dispatch) => {
  try {
    const response = await createApiEndpoint(ENDPOINTS.DASHBOARD).count();

    dispatch(slice.actions.setDashboardCounts(response.data));
  } catch (error) {

    console.log(error);
  }
};

export const getCustomersDaily = () => async (dispatch) => {
  try {
    const response = await createApiEndpoint(ENDPOINTS.DASHBOARD).fetchById("daily-customers");

    dispatch(slice.actions.setCustomersDaily(response.data.Customers));
  } catch (error) {

    console.log(error);
  }
}

export const getCustomersWeekly = () => async (dispatch) => {
  try {
    const response = await createApiEndpoint(ENDPOINTS.DASHBOARD).fetchById("weekly-customers");

    dispatch(slice.actions.setCustomersWeekly(response.data.Customers));
  } catch (error) {

    console.log(error);
  }
}

export const getCustomersMonthly = () => async (dispatch) => {
  try {
    const response = await createApiEndpoint(ENDPOINTS.DASHBOARD).fetchById("monthly-customers");

    dispatch(slice.actions.setCustomersMonthly(response.data.Customers));
  } catch (error) {

    console.log(error);
  }
}

export const setLimit = (limit) => async (dispatch) => {
  dispatch(slice.actions.setLimit(limit));
};

export const setPage = (page) => async (dispatch) => {
  dispatch(slice.actions.setPage(page));
};

export const setCount = (count) => async (dispatch) => {
  dispatch(slice.actions.setCount(count));
};

export const setSortModel = (sortModel) => async (dispatch) => {
  dispatch(slice.actions.setSortModel(sortModel));
};

export const setFilters = (filters) => async (dispatch) => {
  dispatch(slice.actions.setFilter(filters));
}

export const setLoading = (loading) => async (dispatch) => {
  dispatch(slice.actions.setLoading(loading));
};

export default slice;
