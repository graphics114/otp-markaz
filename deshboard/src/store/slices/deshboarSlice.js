import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const deshboardSlice = createSlice({
  name: "desh",
  initialState: {
    loading: false,
    cards: {},
    today: {},
    charts: {},
  },
  reducers: {
    dashboardStatsRequest: (state) => {
      state.loading = true;
    },
    dashboardStatsSuccess: (state, action) => {
      state.loading = false;
      state.cards = action.payload.cards;
      state.today = action.payload.today;
      state.charts = action.payload.charts;
    },
    dashboardStatsFail: (state) => {
      state.loading = false;
    },

    hifizDashboardStatsRequest: (state) => {
      state.loading = true;
    },
    hifizDashboardStatsSuccess: (state, action) => {
      state.loading = false;
      state.cards = action.payload.cards;
      state.today = action.payload.today;
      state.charts = action.payload.charts;
    },
    hifizDashboardStatsFail: (state) => {
      state.loading = false;
    },
  },
});

export const {
  dashboardStatsRequest,
  dashboardStatsSuccess,
  dashboardStatsFail,
  hifizDashboardStatsRequest,
  hifizDashboardStatsSuccess,
  hifizDashboardStatsFail,
} = deshboardSlice.actions;

export const fetchDashboardStats = () => async (dispatch) => {
  try {
    dispatch(dashboardStatsRequest());
    const res = await axiosInstance.get("/admin/dashboard/stats");
    dispatch(dashboardStatsSuccess(res.data));
  } catch (error) {
    dispatch(dashboardStatsFail());
    toast.error(error?.response?.data?.message || "Authentication failed");
  }
};

export const hifizDashboardStats = () => async (dispatch) => {
  try {
    dispatch(hifizDashboardStatsRequest());
    const res = await axiosInstance.get("/admin/hifiz/deshboard/status");
    dispatch(hifizDashboardStatsSuccess(res.data));
  } catch (error) {
    dispatch(hifizDashboardStatsFail());
    toast.error(error?.response?.data?.message || "Authentication failed");
  }
};

export default deshboardSlice.reducer;
