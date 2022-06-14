import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
// import DateTime from 'src/utils/DateTime';


const initialState = {
  allUsers: [],
  page: 0,
  limit: 10,
  count: 0,
  loading: true,
  sortModel: [],
  filters: {}
};

const slice = createSlice({
  name: 'allUsers',
  initialState,
  reducers: {
    getAllUsers(state, action) {
      state.allUsers = action.payload;
      state.allUsers.map((b) => {
        b.id = b.Id;
        // b.CreatedAt = DateTime(b.CreatedAt);
        // b.UpdatedAt = DateTime(b.UpdatedAt);

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

export const getAllUsers = (state) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  try {
    if (state.sortModel.length > 0) {
      const response = await createApiEndpoint(ENDPOINTS.ALLUSER).fetchAll(state.limit, state.page + 1, state.sortModel[0].field, state.sortModel[0].sort, state.filters);
      dispatch(slice.actions.getAllUsers(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    } else {
      const response = await createApiEndpoint(ENDPOINTS.ALLUSER).fetchAll(state.limit, state.page + 1, '', 'desc', state.filters);
      dispatch(slice.actions.getAllUsers(response.data.Data));
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

export const searchAllUsers = async (page, text, filters) => {
  const response = await createApiEndpoint(ENDPOINTS.ALLUSER).Search(page, text, filters);
  return response.data;
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
