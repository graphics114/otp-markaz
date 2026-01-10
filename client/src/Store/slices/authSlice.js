import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-toastify";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false,
    error: null,
    students: [],
    selectedStudent: null,
  },
  reducers: {
    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getUserRequest(state) {
      state.loading = true;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    getUserFailed(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },

    logoutRequest(state) {
      state.loading = true;
    },
    logoutSuccess(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    logoutFailed(state) {
      state.loading = false;
    },

    updateProfileRequest(state) {
      state.loading = true;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    updateProfileFailed(state) {
      state.loading = false;
    },

    resetAuthSlice(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },

    updateStudentRequest(state) {
      state.loading = true;
    },
    updateStudentSuccess(state, action) {
      state.loading = false;
      state.students = state.students.map((student) =>
        student.id === action.payload.id ? action.payload : student);
    },
    updateStudentFailed(state) {
      state.loading = false;
    },
  },
});

export const login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());
  try {
    const res = await axiosInstance.post("/auth/login", data);
    dispatch(authSlice.actions.loginSuccess(res.data.user));
    return res.data.user; // ✅ important
  } catch (error) {
    const errorMessage = error?.response?.data?.message || "Login Failed";
    dispatch(authSlice.actions.loginFailed(errorMessage));
    toast.error(errorMessage);
    throw error;
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());
  try {
    const res = await axiosInstance.get("/auth/me")
    dispatch(authSlice.actions.getUserSuccess(res.data.user));
  } catch (error) {
    dispatch(authSlice.actions.getUserFailed());
  }
}

export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  try {
    const res = await axiosInstance.get("/auth/logout");
    dispatch(authSlice.actions.logoutSuccess());
    toast.success(res.data.message);
  } catch (error) {
    dispatch(authSlice.actions.logoutFailed());
    toast.error(error?.response?.data?.message || "Logout Failed");
  }
};

export const updateProfile = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updateProfileRequest());
  try {
    const res = await axiosInstance.put("/auth/profile/update", data);
    dispatch(authSlice.actions.updateProfileSuccess(res.data.user));
    toast.success(res.data.message);
  } catch (error) {
    dispatch(
      authSlice.actions.updateProfileFailed(
        error?.response?.data?.message
      )
    );
    toast.error("Failed to update profile");
  }
};

export const updateStudent = (id, data) => async (dispatch) => {
  dispatch(authSlice.actions.updateStudentRequest());
  try {
    const res = await axiosInstance.put(`/student/update/student/${id}`, data);
    dispatch(authSlice.actions.updateStudentSuccess(res.data.student));
    toast.success(res.data.message || "Updated successfully");
  } catch (error) {
    dispatch(authSlice.actions.updateStudentFailed());
    toast.error(error?.response?.data?.message || "Failed to update")
  }
}

export default authSlice.reducer;