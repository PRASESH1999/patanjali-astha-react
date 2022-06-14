import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import {DateTimeFormat} from 'src/utils/DateTimeFormat';


const initialState = {
  superDistributors: [],
  page: 0,
  limit: 10,
  count: 0,
  loading: true,
  sortModel: [],
  filters: {}
};

const slice = createSlice({
  name: 'superDistributors',
  initialState,
  reducers: {
    getSuperDistributors(state, action) {
      state.superDistributors = action.payload;
      state.superDistributors.map((b) => {
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

export const getSuperDistributors = (state) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  try {
    if (state.sortModel.length > 0) {
      const response = await createApiEndpoint(ENDPOINTS.SUPERDISTRIBUTOR).fetchAll(state.limit, state.page + 1, state.sortModel[0].field, state.sortModel[0].sort, state.filters);
      dispatch(slice.actions.getSuperDistributors(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    } else {
      const response = await createApiEndpoint(ENDPOINTS.SUPERDISTRIBUTOR).fetchAll(state.limit, state.page + 1, '', 'desc', state.filters);
      dispatch(slice.actions.getSuperDistributors(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    }
  } catch (error) {
    // alert(`The error has occured. Please refresh the page or contact the administrator`);
    if (error.response) {
      if (error.response.status === 403) {
        console.log(error);
      }
    }
    console.log(error);
  }
  dispatch(slice.actions.setLoading(false));
};

export const getSuperDistributorItem = async (id) => {
  try {
    const response = await createApiEndpoint(ENDPOINTS.SUPERDISTRIBUTOR).fetchById(id);
    return response.data.Customer;
  } catch (error) {
    const response = error.response;
    return response;
  }
};

export const searchSuperDistributors = async (page, text, filters) => {
  const response = await createApiEndpoint(ENDPOINTS.SUPERDISTRIBUTOR).Search(page, text, filters);
  return response.data;
};

export const createSuperDistributor = async (createData) => {
  await createApiEndpoint(ENDPOINTS.SUPERDISTRIBUTOR).create(createData);
};

export const updateSuperDistributor = async (id, updateData) => {
  await createApiEndpoint(ENDPOINTS.SUPERDISTRIBUTOR).update(id, updateData);
};

export const deleteSuperDistributor = async (id) => {
  await createApiEndpoint(ENDPOINTS.SUPERDISTRIBUTOR).delete(id);
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

export const setFilters = (filters) => async (dispatch) => {
  dispatch(slice.actions.setFilter(filters));
}

export const setLoading = (loading) => async (dispatch) => {
  dispatch(slice.actions.setLoading(loading));
};

export default slice;
