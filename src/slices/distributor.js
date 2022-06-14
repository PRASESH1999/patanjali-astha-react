import { Alert } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import {DateTimeFormat} from 'src/utils/DateTimeFormat';

const initialState = {
  distributors: [],
  page: 0,
  limit: 10,
  count: 0,
  loading: true,
  sortModel: [{ field: 'Name', sort: 'asc' }],
  filters: {}
};

const slice = createSlice({
  name: 'distributors',
  initialState,
  reducers: {
    getDistributors(state, action) {
      state.distributors = action.payload;
      state.distributors.map((b) => {
        b.id = b.Id;
        b.CreatedAt = DateTimeFormat(b.CreatedAt);
        b.UpdatedAt = DateTimeFormat(b.UpdatedAt);

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
      state.filters = action.payload;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

export const { reducer } = slice;

export const getDistributors = (state) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  
  try {
    const response = await createApiEndpoint(ENDPOINTS.DISTRIBUTOR).fetchAll(state.limit, state.page + 1, state.sortModel[0].field, state.sortModel[0].sort, state.filters);

    dispatch(slice.actions.getDistributors(response.data.Data));
    dispatch(slice.actions.setCount(response.data.TotalRecords));
  } catch (error) {
    // alert(`The error has occured. Please refresh the page or contact the adminstrator`);
    if (error.response) {
      if (error.response.status === 403) {
        Alert(error.response)
      }
    }
  }
  dispatch(slice.actions.setLoading(false));
};

export const getDistributorItem = async (id) => {
  try {
    const response = await createApiEndpoint(ENDPOINTS.DISTRIBUTOR).fetchById(id);
    return response.data.Customer;
  } catch (error) {
    const response = error.response;
    return response;
  }
};

export const searchDistributors = async (page, text, filters) => {
  const response = await createApiEndpoint(ENDPOINTS.DISTRIBUTOR).Search(page, text, filters);
  return response.data;
};

export const createDistributor = async (createData) => {
  await createApiEndpoint(ENDPOINTS.DISTRIBUTOR).create(createData);
};

export const updateDistributor = async (id, updateData) => {
  await createApiEndpoint(ENDPOINTS.DISTRIBUTOR).update(id, updateData);
};

export const deleteDistributor = async (id) => {
  await createApiEndpoint(ENDPOINTS.DISTRIBUTOR).delete(id);
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

export const setFilters = (filters, state) => async (dispatch) => {
  dispatch(slice.actions.setFilter(filters, state));
}

export const setLoading = (loading) => async (dispatch) => {
  dispatch(slice.actions.setLoading(loading));
};

export default slice;