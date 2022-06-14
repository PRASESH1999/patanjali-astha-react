import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from 'react-leaflet';
import { FullscreenControl } from "react-leaflet-fullscreen";

import 'leaflet/dist/leaflet.css';

import moment from 'moment';
import { icon } from 'leaflet';
import { Helmet } from 'react-helmet-async';
import { DateTimeFormat } from 'src/utils/DateTimeFormat';
import { createApiEndpoint, ENDPOINTS } from 'src/apiServices';
import PageHeader from 'src/components/PageHeader';
import SelectAsync from 'src/components/SelectAsync';
import ChangeView from '../../utils/ChangeView';
import MovingMarker from './MovingMarker';

// const STARTICON = icon({
//   iconUrl: `${process.env.PUBLIC_URL}/static/images/marker/start.png`,
//   iconSize: [18, 29],
//   iconAnchor: [8, 28]
// });
// const ENDICON = icon({
//   iconUrl: `${process.env.PUBLIC_URL}/static/images/marker/end.png`,
//   iconSize: [18, 29],
//   iconAnchor: [9, 26]
// });

const RED_ICON = icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const VIOLET_ICON = icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const YELLOW_ICON = icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const BLUE_ICON = icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const GREEN_ICON = icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});



function Map() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // user data
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // map data
  const [locations, setLocations] = useState([]);
  const [customerLocations, setCustomerLocations] = useState([])
  const [punchInTime, setPunchInTime] = useState([])
  const [punchOutTime, setPunchOutTime] = useState([])
  const [positions, setPositions] = useState([]);
  const [center, setCenter] = useState([22.057163, 78.938202]);
  const zoom = 15;

  const [track, setTrack] = useState({});
  const [trackVisible, setTrackVisible] = useState(true);
  const [changeCenter, setChangeCenter] = useState(true);
  const [replay, setReplay] = useState(false);

  // date data
  const TimeZone = 'Asia/Kolkata';

  const convertedDate = (date) =>
    moment.tz(date, TimeZone).format('YYYY-MM-DD');

  // getting Data for map.
  useEffect(async () => {
    if (state) {
      if (state.user) {
        let loc = [];

        setUser(state.user);
        if (state.date) {
          setDate(state.date);
        }

        const response = await createApiEndpoint(
          ENDPOINTS.MAP
        ).fetchByIdAndDate(
          state.user.value,
          convertedDate(state.date || new Date())
        );

        const geolocations = response.data.Geolocations;
        const customerVisits = response.data.CustomerVisits;
        const punchIns = response.data.PunchIns;
        const punchOuts = response.data.PunchOuts; 

        loc = geolocations.map((position) => [
          position.Latitude,
          position.Longitude
        ]);


        if (geolocations.length > 0) {
          setCenter([
            geolocations[geolocations.length - 1].Latitude,
            geolocations[geolocations.length - 1].Longitude
          ]);
          setChangeCenter(false);
        }


        setCustomerLocations(customerVisits);
        setLocations(geolocations);
        setPunchInTime(punchIns);
        setPunchOutTime(punchOuts);
        setPositions(loc);
      }
    }
    setIsSubmitting(false);
  }, [state]);

  let cursor = 0;
  // movingTracker
  useEffect(() => {
    if (locations.length > 0) {
      setTrack({
        lat: locations[cursor].Latitude,
        lng: locations[cursor].Longitude
      });

      const interval = setInterval(() => {
        setTrackVisible(true);
        if (cursor === locations.length - 1) {
          cursor = 0;
          setTrackVisible(false);
          setTrack({
            lat: locations[cursor].Latitude,
            lng: locations[cursor].Longitude
          });
          clearInterval(interval);
        }
        cursor += 1;
        setTrack({
          lat: locations[cursor].Latitude,
          lng: locations[cursor].Longitude
        });
      }, 1200);
      return () => {
        clearInterval(interval);
      };
    }
    return null;
  }, [locations, replay]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setChangeCenter(true);
    setIsSubmitting(true);
    setTrackVisible(false);
    navigate(
      { pathname: '' },
      {
        state: {
          user,
          date: convertedDate(date)
        }
      }
    );
  };

  const loadOptions = async (search, loadedOptions, { page }) => {
    let userFilter = {};

    const response = await createApiEndpoint(ENDPOINTS.ALLUSER).Search(
      page,
      search,
      userFilter
    );

    const options = response.data.Results.map((row) => {
      return {
        value: row.Id,
        label: `${row.EmpCode} ${row.Name}`
      };
    });

    return {
      options,
      hasMore: response.data.HasMore,
      additional: {
        page: page + 1
      }
    };
  };

  const handleReplay = () => {
    cursor = 0;

    setTrackVisible(false);
    setReplay(!replay);
  };

  return (
    <>
      <Helmet>
        <title>Map</title>
      </Helmet>

      <PageHeader title="Map" disableButton />

      <Card
        sx={{
          mx: 2
        }}
      >
        <form onSubmit={onSubmit}>
          <Grid
            container
            alignItems="center"
            p={2}
            spacing={3}
          >
            <Grid
              item
              xs={12}
              md={4}
              xl={3}
            >
              <DatePicker
                label="Date"
                name="Date"
                inputFormat="yyyy-MM-dd"
                mask="____-__-__"
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField size="small" fullWidth {...params} />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              xl={3}
            >
              <SelectAsync
                placeholder="User"
                closeMenuOnSelect
                isClearable
                value={user}
                loadOptions={loadOptions}
                onChange={setUser}
                additional={{
                  page: 1
                }}
              />
            </Grid>
            <Grid
              item
              xs={4}
              md={2}
              xl={3}
            >
              <Button
                size="small"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={isSubmitting}
                variant="contained"
                type="submit"
              >
                Submit
              </Button>
            </Grid>

            <Grid
              item
              xs={8}
              md={2}
              xl={3}
              display="flex"
              justifyContent="end"
            >
              <Button
                size="small"
                color="secondary"
                variant="contained"
                startIcon={
                  <ReplayIcon />
                }
                onClick={handleReplay}
              >
                Replay
              </Button>
            </Grid>
          </Grid>
        </form>

        <Divider />

        <Grid container>
          <Grid item xs={12}>
            <MapContainer
              center={center}
              zoom={zoom}
              minZoom={5}
              style={{ height: '400px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FullscreenControl />

              {changeCenter && <ChangeView center={center} zoom={zoom} />}
              {// CheckIn Marker for Customer Visit
                customerLocations && (
                  customerLocations.map((location, key) =>(
                    <Marker
                    key={key}
                      icon={VIOLET_ICON}
                      position={[location.CheckInLatitude, location.CheckInLongitude]}
                    >
                      <Popup>
                        <b>Check In Time: </b> {DateTimeFormat(location.CheckInTime)}
                        <br />
                        <b>Check Out Time: </b> {DateTimeFormat(location.CheckOutTime)}
                        <br />
                        <b>Customer: </b> {location.CustomerSapCode} {location.CustomerName}
                      </Popup>
                    </Marker>
                  ))

                )
              }
              {// PunchIn marker 
                punchInTime && (
                  punchInTime.map((location, key)=>(
                    <Marker
                      key={key}
                      icon={YELLOW_ICON}
                      position={[location.Latitude, location.Longitude]}
                    >
                      <Popup>
                        <b>Punch In Time: </b> {DateTimeFormat(location.Time)}
                      </Popup>
                  </Marker>
                  ))
                ) 
              }
              {// PunchOut marker 
                punchOutTime && (
                  punchOutTime.map((location, key)=>(
                    <Marker
                      key={key}
                      icon={BLUE_ICON}
                      position={[location.Latitude, location.Longitude]}
                    >
                      <Popup>
                        <b>Punch Out Time: </b> {DateTimeFormat(location.Time)}
                      </Popup>
                    </Marker>
                  ))
                ) 
              }
              {
                // Start Marker
                locations[0] && (
                  <Marker
                    icon={RED_ICON}
                    position={[locations[0].Latitude, locations[0].Longitude]}
                  >
                    <Popup>
                      <b>Time: </b> {DateTimeFormat(locations[0].DateTime)}
                      <br />
                      <b>Address: </b> {locations[0].Address}
                    </Popup>
                  </Marker>
                )
              }
              {
                // End Marker
                locations[locations.length - 1] && (
                  <Marker
                    icon={GREEN_ICON}
                    position={[
                      locations[locations.length - 1].Latitude,
                      locations[locations.length - 1].Longitude
                    ]}
                  >
                    <Popup>
                      <b>Time: </b> {DateTimeFormat(locations[locations.length - 1].DateTime)}
                      <br />
                      <b>Address: </b> {locations[locations.length - 1].Address}
                    </Popup>
                  </Marker>
                )
              }

              {/* <PolylineDecorator pattern={arrow} positions={positions} />  */}
              {track.lat && track.lng && (
                <>{trackVisible && <MovingMarker data={track || {}} />}</>
              )}
              <Polyline pattern="arrow" positions={positions} />
            </MapContainer>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default Map;