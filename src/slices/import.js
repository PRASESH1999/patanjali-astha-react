import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import { DateTimeFormat } from 'src/utils/DateTimeFormat';


const initialState = {
  imports: [],
  page: 0,
  limit: 10,
  count: 0,
  loading: true,
  sortModel: [],
  filters: {}
};

const slice = createSlice({
  name: 'imports',
  initialState,
  reducers: {
    getImports(state, action) {
      state.imports = action.payload;
      state.imports.map((b) => {
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

export const getImports = (state) => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  try {
    if (state.sortModel.length > 0) {
      const response = await createApiEndpoint(ENDPOINTS.IMPORT).fetchAll(state.limit, state.page + 1, state.sortModel[0].field, state.sortModel[0].sort, state.filters);
      dispatch(slice.actions.getImports(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    } else {
      const response = await createApiEndpoint(ENDPOINTS.IMPORT).fetchAll(state.limit, state.page + 1, '', 'desc', state.filters);
      dispatch(slice.actions.getImports(response.data.Data));
      dispatch(slice.actions.setCount(response.data.TotalRecords));
    }
  } catch (error) {
    console.log(error);
  }
  dispatch(slice.actions.setLoading(false));
};

export const getImportItem = async (id) => {
  try {
    const response = await createApiEndpoint(ENDPOINTS.IMPORT).fetchById(id);
    return response.data.Import;
  } catch (error) {
    const response = error.response;
    return response;
  }
};

export const getTables = async () => {
  const response = await createApiEndpoint(ENDPOINTS.IMPORTCSV).fetchById(`Tables`);
  const tables = response.data.Tables.map(
    ({
      Id: Value,
      ...rest
    }) => ({
      Value,
      ...rest
    })
  )
  return tables;
}

export const getTablesAdvanced = async () => {
  const response = await createApiEndpoint(ENDPOINTS.IMPORTCSVADVANCED).fetchById(`Tables`);
  const tables = response.data.Tables.map(
    ({
      Id: Value,
      ...rest
    }) => ({
      Value,
      ...rest
    })
  )
  return tables;
}

export const downloadTableFormat = async (id) => {
  const response = await createApiEndpoint(ENDPOINTS.IMPORTCSV).fetchById(`DownloadFormat/${id}`);
  return response;
}

export const downloadTableFormatAdvanced = async (id) => {
  const response = await createApiEndpoint(ENDPOINTS.IMPORTCSVADVANCED).fetchById(`DownloadFormat/${id}`);
  return response;
}


export const importCsv = async (importData) => {
  await createApiEndpoint(ENDPOINTS.IMPORTCSV).create(importData);
};

export const importCsvAdvanced = async (importData) => {
  await createApiEndpoint(ENDPOINTS.IMPORTCSVADVANCED).create(importData);
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
