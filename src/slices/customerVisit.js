import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import {DateTimeFormat} from 'src/utils/DateTimeFormat';


const initialState = {
  customerVisits: [],
  page: 0,
  limit: 10,
  count: 0,
  loading: true,
  sortModel: [],
  filters: {
    StartDate: null,
    EndDate: null,
    UserId: null,
  }
};

const slice = createSlice({
  name: 'customerVisits',
  initialState,
  reducers: {
    getCustomerVisits(state, action) {
      state.customerVisits = action.payload;
      state.customerVisits.map((b) => {
        b.id = b.Id;
        b.CreatedAt = DateTimeFormat(b.CreatedAt);
        b.UpdatedAt = DateTimeFormat(b.UpdatedAt);
        b.CheckOutTime = DateTimeFormat(b.CheckOutTime);
        b.CheckInTime = DateTimeFormat(b.CheckInTime);

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

export const getCustomerVisits = (state) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  try {
    if (state.sortModel.length > 0) {
      const response = await createApiEndpoint(ENDPOINTS.CUSTOMERVISIT).fetchAll(state.limit, state.page + 1, state.sortModel[0].field, state.sortModel[0].sort, state.filters);
      dispatch(slice.actions.getCustomerVisits(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    } else {
      const response = await createApiEndpoint(ENDPOINTS.CUSTOMERVISIT).fetchAll(state.limit, state.page + 1, '', 'desc', state.filters);
      dispatch(slice.actions.getCustomerVisits(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    }
  } catch (error) {
    // alert(`The error has occured. Please refresh the page or contact the customerVisitstrator`);
    // if (error.response) {
    //   if (error.response.status == 403) {
    //     Alert(error.response)
    //   }
    // }
    console.log(error);
  }
  dispatch(slice.actions.setLoading(false));
};

export const getCustomerVisitItem = async (id) => {
  try {
    const response = await createApiEndpoint(ENDPOINTS.CUSTOMERVISIT).fetchById(id);
    return response.data.User;
  } catch (error) {
    const response = error.response;
    return response;
  }
};

// export const getAllCustomerVisits = async () => {
//   const response = await createApiEndpoint(ENDPOINTS.CUSTOMERVISIT).All();
//   return response.data.Users;
// };

export const createCustomerVisit = async (createData) => {
  await createApiEndpoint(ENDPOINTS.CUSTOMERVISIT).create(createData);
};

export const updateCustomerVisit = async (id, updateData) => {
  await createApiEndpoint(ENDPOINTS.CUSTOMERVISIT).update(id, updateData);
};

export const deleteCustomerVisit = async (id) => {
  await createApiEndpoint(ENDPOINTS.CUSTOMERVISIT).delete(id);
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
