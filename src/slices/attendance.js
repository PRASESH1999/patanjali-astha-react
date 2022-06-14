import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import {DateTimeFormat} from 'src/utils/DateTimeFormat';


const initialState = {
  attendances: [],
  page: 0,
  limit: 10,
  count: 0,
  loading: true,
  sortModel: [],
  filters: {
    StartDate: null,
    EndDate: null,
    UserId: null,
  },
  user: null
};

const slice = createSlice({
  name: 'attendances',
  initialState,
  reducers: {
    getAttendances(state, action) {
      state.attendances = action.payload;
      state.attendances.map((b) => {
        b.id = b.Id;
        b.PunchInTime = DateTimeFormat(b.PunchInTime);
        b.PunchOutTime = DateTimeFormat(b.PunchOutTime);

        return null;
      });
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
      state.filters = action.payload.filters;
      state.user = action.payload.user;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

export const { reducer } = slice;

export const getAttendances = (state) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  try {
    if (state.sortModel.length > 0) {
      const response = await createApiEndpoint(ENDPOINTS.ATTENDANCE).fetchAll(state.limit, state.page + 1, state.sortModel[0].field, state.sortModel[0].sort, state.filters);

      dispatch(slice.actions.getAttendances(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    } else {
      const response = await createApiEndpoint(ENDPOINTS.ATTENDANCE).fetchAll(state.limit, state.page + 1, '', 'desc', state.filters);
      dispatch(slice.actions.getAttendances(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    }
  } catch (error) {
    // alert(`The error has occured. Please refresh the page or contact the adminstrator`);
    // if (error.response) {
    //   if (error.response.status == 403) {
    //     Alert(error.response)
    //   }
    // }
    console.log(error);
  }
  dispatch(slice.actions.setLoading(false));
};

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

export const setFilters = (filters, user) => async (dispatch) => {
  dispatch(slice.actions.setFilter({filters, user}));
}

export const setLoading = (loading) => async (dispatch) => {
  dispatch(slice.actions.setLoading(loading));
};

export default slice;
