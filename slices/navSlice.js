import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: {
    location: {
      lat: 39.9333635,
      lng: 32.8597419,
    },
  },
  destination: null,
  travelTimeInformation: null,
  token: null,
  isLiveTracking: true,
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTravelTimeInformation: (state, action) => {
      state.travelTimeInformation = action.payload;
    },
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },
    setIsTracking(state, action) {
      state.isLiveTracking = action.payload;
    },
  },
});

export const {
  setOrigin,
  setDestination,
  setTravelTimeInformation,
  setAuthToken,
} = navSlice.actions;

export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectToken = (state) => state.nav.token;
export const selectTracking = (state) => state.nav.isLiveTracking;

export default navSlice.reducer;
