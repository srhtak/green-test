import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: {
    location: {
      lat: 38.4135965,
      lng: 43.2715308,
    },
  },
  NewInvoice: {
    userClientId: 0,
    bikeId: 0,
    packageId: 0,
    distance: 0,
    time: 0,
    rate: 0,
  },
  destination: null,
  travelTimeInformation: null,
  token: null,
  isLiveTracking: false,
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
    setInvoice(state, action) {
      state.NewInvoice = { ...state.NewInvoice, ...action.payload };
    },
  },
});

export const {
  setOrigin,
  setDestination,
  setTravelTimeInformation,
  setAuthToken,
  setInvoice,
  setIsTracking,
} = navSlice.actions;

export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectToken = (state) => state.nav.token;
export const selectTracking = (state) => state.nav.isLiveTracking;
export const selectInvoice = (state) => state.nav.NewInvoice;

export default navSlice.reducer;
