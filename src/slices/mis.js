import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import {DateTimeFormat} from 'src/utils/DateTimeFormat';

const initialState = {
  miss: [],
  page: 0,
  limit: 10,
  count: 0,
  loading: true,
  sortModel: [],
  filters: {}
};

const slice = createSlice({
  name: 'miss',
  initialState,
  reducers: {
    getMiss(state, action) {
      state.miss = action.payload;
      state.miss.map((b) => {
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

export const getMiss = (state) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  try {
    if (state.sortModel.length > 0) {
      const response = await createApiEndpoint(ENDPOINTS.MIS).fetchAll(state.limit, state.page + 1, state.sortModel[0].field, state.sortModel[0].sort, state.filters);
      dispatch(slice.actions.getMiss(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    } else {
      const response = await createApiEndpoint(ENDPOINTS.MIS).fetchAll(state.limit, state.page + 1, '', 'desc', state.filters);
      dispatch(slice.actions.getMiss(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    }
  } catch (error) {
    // alert(`The error has occured. Please refresh the page or contact the administrator`);
    if (error.response) {
      if (error.response.status === 403) {
        console.log(error)
      }
    }
  }
  dispatch(slice.actions.setLoading(false));
};

export const getMisItem = async (id) => {
  try {
    const response = await createApiEndpoint(ENDPOINTS.MIS).fetchById(id);
    return response.data.User;
  } catch (error) {
    const response = error.response;
    return response;
  }
};

// export const getAllMiss = async () => {
//   const response = await createApiEndpoint(ENDPOINTS.MIS).All();
//   return response.data.Users;
// };

export const createMis = async (createData) => {
  await createApiEndpoint(ENDPOINTS.MIS).create(createData);
};

export const updateMis = async (id, updateData) => {
  await createApiEndpoint(ENDPOINTS.MIS).update(id, updateData);
};

export const deleteMis = async (id) => {
  await createApiEndpoint(ENDPOINTS.MIS).delete(id);
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
