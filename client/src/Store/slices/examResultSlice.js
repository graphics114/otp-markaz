import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

export const fetchMyExamResult = createAsyncThunk("examResult/fetchMyExamResult",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/exam/fetch/my/result`);
      return data.results;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch result"
      );
    }
  }
);

const examResultSlice = createSlice({
  name: "examResult",
  initialState: {
    loading: false,
    results: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyExamResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyExamResult.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchMyExamResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default examResultSlice.reducer;