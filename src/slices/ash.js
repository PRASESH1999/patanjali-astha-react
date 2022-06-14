import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import {DateTimeFormat} from 'src/utils/DateTimeFormat';


const initialState = {
  ashs: [],
  page: 0,
  limit: 10,
  count: 0,
  loading: true,
  sortModel: [],
  filters: {}
};

const slice = createSlice({
  name: 'ashs',
  initialState,
  reducers: {
    getAshs(state, action) {
      state.ashs = action.payload;
      state.ashs.map((b) => {
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

export const getAshs = (state) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  try {
    if (state.sortModel.length > 0) {
      const response = await createApiEndpoint(ENDPOINTS.ASH).fetchAll(state.limit, state.page + 1, state.sortModel[0].field, state.sortModel[0].sort, state.filters);
      dispatch(slice.actions.getAshs(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    } else {
      const response = await createApiEndpoint(ENDPOINTS.ASH).fetchAll(state.limit, state.page + 1, '', 'desc', state.filters);
      dispatch(slice.actions.getAshs(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    }
  } catch (error) {
    console.log(error);
  }
  dispatch(slice.actions.setLoading(false));
};

export const getAshItem = async (id) => {
  try {
    const response = await createApiEndpoint(ENDPOINTS.ASH).fetchById(id);
    return response.data.User;
  } catch (error) {
    const response = error.response;
    return response;
  }
};

export const searchAshs = async (page, term, filters) => {
  const response = await createApiEndpoint(ENDPOINTS.ASH).Search(page, term, filters);
  return response.data;
};

export const createAsh = async (createData) => {
  await createApiEndpoint(ENDPOINTS.ASH).create(createData);
};

export const updateAsh = async (id, updateData) => {
  await createApiEndpoint(ENDPOINTS.ASH).update(id, updateData);
};

export const deleteAsh = async (id) => {
  await createApiEndpoint(ENDPOINTS.ASH).delete(id);
};

export const markActive = async (id) => {
  await createApiEndpoint(ENDPOINTS.ASH).markActive(id);
}

export const markInactive = async (id) => {
  await createApiEndpoint(ENDPOINTS.ASH).markInactive(id);
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
