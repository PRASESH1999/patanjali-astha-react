import axios from "axios";
import qs from 'qs';

const BASE_URL = 'https://localhost:7035';
// const BASE_URL = 'http://182.18.155.185/PatanjaliAstha/WebApi';
// const BASE_URL = 'http://182.18.142.47/PatanjaliAstha/WebApi';

// URLS
export const ENDPOINTS = {
  LOGIN: 'Auth/Login',

  ALLUSER: 'AllUsers',
  ADMIN: 'Admins',
  MIS: 'Miss',
  SH: 'Shs',
  ASH: 'Ashs',
  ASE: 'Ases',
  SO: 'Sos',

  REGION : 'Regions',
  STATE: 'States',
  DISTRICT: 'Districts',
  CITY: 'Cities',
  PINCODE: 'Pincodes',

  ATTENDANCE: 'Attendances',
  CURRENTLOCATION: 'CurrentLocations',
  IMPORTCSVADVANCED: 'ImportCsvAdvanced',
  IMPORT : 'Imports',
  MAP : 'Map'
}

// adding headers to every request
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(config => {
  config.headers['X-Auth'] = localStorage.Token;
  return config;
})

axiosInstance.interceptors.response.use(
  response => {
    return (response);
  },
  error => {
    const response = error.response;

    if (response.status === 401) {
      localStorage.removeItem('Token')
      localStorage.removeItem('Name')
      localStorage.removeItem('Role')

      return window.location.reload();
    }

    if (error.response.status === 403) {
      return null;
    }

    return Promise.reject(error)

  }
)

export const createApiEndpoint = endpoints => {
  const url = `${BASE_URL}/${endpoints}`

  return {

    // Get Methods
    fetchAll: (limit, page, sortColumn, sortDirection, filters = {}) => axiosInstance.get(url, {
      params: {
        limit,
        page,
        sortColumn,
        sortDirection,
        ...filters,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { encode: false });
      }
    }), // {page, limit , sort, sortDirection(Asc, Dsc), filters{term, Name, ...} }

    fetchByIdAndDate: (userId, date) => axiosInstance.get(url, {
      params: {
        userId,
        date,
      }
    }),

    fetchById: id => axiosInstance.get(
      `${url}/${id}`
    ), // {id}

    Search: (page, term, filters) => axiosInstance.get(`${url}/Search/`, {
      params: {
        page,
        term,
        ...filters
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { encode: false });
      }
    }),

    All: () => axiosInstance.get(
      `${url}/All`
    ),

    count: () => axiosInstance.get(url),

    // POST 
    create: newRecord => axiosInstance.post(
      url,
      newRecord
    ), // {Body}

    // PUT 
    update: (id, updatedRecord) => axiosInstance.put(
      `${url}/${id}`,
      updatedRecord
    ), // {id}, {Body}

    // DELETE 
    delete: id => axiosInstance.delete(
      `${url}/${id}`
    ), // {id}

    // MARK ACTIVE
    markActive: id => axiosInstance.post(
      `${url}/MarkActive/${id}`
    ),

    // MARK INACTIVE
    markInactive: id => axiosInstance.post(
      `${url}/MarkInactive/${id}`
    ),

    // Login
    login: (credentials) => axios.post(url, credentials),

    export: (startDate, endDate, config, source) => axios.get(`${url}/ExportCsv`,
      {
        params: {
          startDate,
          endDate,
        },
        responseType: 'blob',
        headers: {
          'X-auth': localStorage.Token
        },
        onDownloadProgress: config.onDownloadProgress,
        cancelToken: source.token,
      }
    ),

    userExport: (config, source) => axios.get(`${url}/ExportCsv`,
    {
      responseType: 'blob',
      headers: {
        'X-auth': localStorage.Token
      },
      onDownloadProgress: config.onDownloadProgress,
      cancelToken: source.token,
    }
  ),

    exportNew: (startDate, endDate, config, source) => axios.get(`${url}/ExportNewCsv`,
      {
        params: {
          startDate,
          endDate,
        },
        responseType: 'blob',
        headers: {
          'X-auth': localStorage.Token
        },
        onDownloadProgress: config.onDownloadProgress,
        cancelToken: source.token,
      }
    ),

    exportRoute: (importId, config, source) => axios.get(`${url}/ExportCsv`,
    {
      params: {
        importId
      },
      responseType: 'blob',
      headers: {
        'X-auth': localStorage.Token
      },
      onDownloadProgress: config.onDownloadProgress,
      cancelToken: source.token,
    }
  )
  }
}