import { createSlice } from '@reduxjs/toolkit';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import { DateTimeFormat } from 'src/utils/DateTimeFormat';


const initialState = {
  allCurrentLocations: []
};

const slice = createSlice({
  name: 'currentLocation',
  initialState,
  reducers: {
    getAllCurrentLocations(state, action) {
      state.allCurrentLocations = action.payload;
      state.allCurrentLocations.map((b) => {
        b.id = b.Id;
        b.GpsTime =  DateTimeFormat(b.GpsTime);
        b.GprsTime = DateTimeFormat(b.GprsTime);

        return null;
      });
    },

    setLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

export const { reducer } = slice;

export const getAllCurrentLocations = () => async (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  try {
    const response = await createApiEndpoint(ENDPOINTS.CURRENTLOCATION).All();
    dispatch(slice.actions.getAllCurrentLocations(response.data.Locations));
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

export const setLoading = (loading) => async (dispatch) => {
  dispatch(slice.actions.setLoading(loading));
};

export default slice;
