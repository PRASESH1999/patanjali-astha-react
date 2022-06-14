import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import {DateTimeFormat} from 'src/utils/DateTimeFormat';


const initialState = {
  routes: [],
  page: 0,
  limit: 10,
  count: 0,
  loading: true,
  sortModel: [],
  filters: {},
  user: null
};

const slice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    getRoutes(state, action) {
      state.routes = action.payload;
      state.routes.map((b) => {
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
      state.filters = action.payload.filters;
      state.user = action.payload.user;
    },

    setLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

export const { reducer } = slice;

export const getRoutes = (state) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  try {
    if (state.sortModel.length > 0) {
      const response = await createApiEndpoint(ENDPOINTS.ROUTE).fetchAll(state.limit, state.page + 1, state.sortModel[0].field, state.sortModel[0].sort, state.filters);
      dispatch(slice.actions.getRoutes(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    } else {
      const response = await createApiEndpoint(ENDPOINTS.ROUTE).fetchAll(state.limit, state.page + 1, '', 'desc', state.filters);
      dispatch(slice.actions.getRoutes(response.data.Data));
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

export const getRouteItem = async (id) => {
  try {
    const response = await createApiEndpoint(ENDPOINTS.ROUTE).fetchById(id);
    return response.data.Route;
  } catch (error) {
    const response = error.response;
    return response;
  }
};

// export const getAllAdmins = async () => {
//   const response = await createApiEndpoint(ENDPOINTS.ROUTE).All();
//   return response.data.Users;
// };

export const searchRoutes = async (page, text, filters) => {
  const response = await createApiEndpoint(ENDPOINTS.ROUTE).Search(page, text, filters);
  return response.data;
};

export const createRoute = async (createData) => {
  await createApiEndpoint(ENDPOINTS.ROUTE).create(createData);
};

export const updateRoute = async (id, updateData) => {
  await createApiEndpoint(ENDPOINTS.ROUTE).update(id, updateData);
};

export const deleteRoute = async (id) => {
  await createApiEndpoint(ENDPOINTS.ROUTE).delete(id);
};

export const markActive = async (id) => {
  await createApiEndpoint(ENDPOINTS.ROUTE).markActive(id);
}

export const markInactive = async (id) => {
  await createApiEndpoint(ENDPOINTS.ROUTE).markInactive(id);
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

export const setFilters = (filters, user) => async (dispatch) => {
  dispatch(slice.actions.setFilter({filters, user}));
}

export const setLoading = (loading) => async (dispatch) => {
  dispatch(slice.actions.setLoading(loading));
};

export default slice;
