import { Alert } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import {DateTimeFormat} from 'src/utils/DateTimeFormat';


const initialState = {
    geolocations: [],
    id: '',
    date: '',
    loading: true,
    sortModel: [],
    filters: {}
};

const slice = createSlice({
    name: 'geolocations',
    initialState,
    reducers: {
        getGeolocations(state, action) {
            state.geolocations = action.payload;
            state.geolocations.map((b) => b.id = b.Id);
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
            state.filters = action.payload
        },

        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

export const { reducer } = slice;

export const getGeolocations = (state) => async (dispatch) => {
    dispatch(slice.actions.setLoading(true));
    try {
      const response = await createApiEndpoint(ENDPOINTS.MAP).fetchByIdAndDate(state.id, state.date);
  
      dispatch(slice.actions.getGeolocations(response.data.Geolocations));
    } catch (error) {
      // alert(`The error has occured. Please refresh the page or contact the adminstrator`);
      if (error.response) {
        if (error.response.status === 403) {
          Alert(error.response)
        }
      }
    }
    dispatch(slice.actions.setLoading(false));
}

export const getGeolocationsItem = async (id, date) => {
    const response = await createApiEndpoint(ENDPOINTS.MAP).fetchByIdAndDate(id, DateTimeFormat(date));
    return response.data.Geolocations;
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

export const setLoading = (loading) => async (dispatch) => {
    dispatch(slice.actions.setLoading(loading));
};

export const setFilters = (filters) => async (dispatch) => {
    dispatch(slice.actions.setFilters(filters));
}

export default slice;
