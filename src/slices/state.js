import { Alert } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import {DateTimeFormat} from 'src/utils/DateTimeFormat';

const initialState = {
  states: [],
  page: 0,
  limit: 10,
  count: 0,
  loading: true,
  sortModel: [],
  filters: {}
};

const slice = createSlice({
  name: 'states',
  initialState,
  reducers: {
    getStates(state, action) {
      state.states = action.payload;
      state.states.map((b) => {
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

    setFilters(state, action) {
      state.filters = action.payload;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

export const { reducer } = slice;

export const getStates = (state) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  try {
    if (state.sortModel.length > 0) {
      const response = await createApiEndpoint(ENDPOINTS.STATE).fetchAll(state.limit, state.page + 1, state.sortModel[0].field, state.sortModel[0].sort, state.filters);
      dispatch(slice.actions.getStates(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    } else {
      const response = await createApiEndpoint(ENDPOINTS.STATE).fetchAll(state.limit, state.page + 1, '', 'desc', state.filters);
      dispatch(slice.actions.getStates(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    }
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

export const getStateItem = async (id) => {
  const response = await createApiEndpoint(ENDPOINTS.STATE).fetchById(id);
  return response.data.State;
};

export const getAllStates = async () => {
  const response = await createApiEndpoint(ENDPOINTS.STATE).All();
  return response.data.States;
};

export const createState = async (createData) => {
  await createApiEndpoint(ENDPOINTS.STATE).create(createData);
};

export const updateState = async (id, updateData) => {
  await createApiEndpoint(ENDPOINTS.STATE).update(id, updateData);
};

export const deleteState = async (id) => {
  await createApiEndpoint(ENDPOINTS.STATE).delete(id);
};

export const groupStates = (regions, states) => {
  const groupedStates = {};
  regions.map((region) => {
    groupedStates[region.Id] = [];
    states.map((state) => {
      if (region.Id === state.RegionId) {
        groupedStates[region.Id].push({
          Id: state.Id,
          Name: state.Name
        });
      };
      return true;
    });
    return true;
  });
  return groupedStates;
};

// Pagination
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

export const setLoading = (loading) => async (dispatch) => {
  dispatch(slice.actions.setLoading(loading));
};

export const setFilters = (filters) => async (dispatch) => {
  dispatch(slice.actions.setFilters(filters));
};

export default slice;
