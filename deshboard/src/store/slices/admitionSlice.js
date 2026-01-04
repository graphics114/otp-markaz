import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleUpdateAdmition } from "./extraSlice";
import axios from "axios";

const admissionsSlice = createSlice({
    name: "admition",
    initialState: {
        loading: false,
        totalAdmissions: 0,
        admissions: [],
        totalAdmissionsCount: 0,
        selectedAdmition: null,
    },
    reducers: {
        getAllAdmissionsRequest(state){
            state.loading = true;
        },
        getAllAdmissionsSuccess(state, action){
            state.loading = false;
            state.admissions = action.payload.admissions;
            state.totalAdmissions = action.payload.count || (action.payload.totalAdmissions || 0);
        },
        getAllAdmissionsFailed(state){
            state.loading = false;
        },

        updateAdmissionRequest(state){
            state.loading = true;
        },
        updateAdmissionSuccess(state, action){
            state.loading = false;
            state.admissions = state.admissions.map((admission) => 
                admission.id === action.payload.id ? action.payload : admission);
        },
        updateAdmissionFailed(state){
            state.loading = false;
        },

        deleteAdmissionRequest(state){
            state.loading = true;
        },
        deleteAdmissionSuccess(state, action){
            state.loading = false;
            state.admissions = state.admissions.filter(admission => admission.id !== action.payload);
            state.totalAdmissions = Math.max(0, state.totalAdmissions -1);
        },
        deleteAdmissionFailed(state){
            state.loading = false;
        },

        admissionRegisterRequest(state){
            state.loading = true;
        },
        admissionRegisterSuccess(state){
            state.loading = false;
        },
        admissionRegisterFailed(state){
            state.loading = false;
        },
    },
});

export const fetchAllAdmissions = (page) => async (dispatch) => {
    dispatch(admissionsSlice.actions.getAllAdmissionsRequest());
    try {
        const res = await axiosInstance.get(`/admition/fetch/all?page=${page}`);
        dispatch(admissionsSlice.actions.getAllAdmissionsSuccess(res.data));
    } catch (error) {
        dispatch(admissionsSlice.actions.getAllAdmissionsFailed());
        toast.error(error?.response?.data?.message || "Failed to get admitions");
    }
};

export const updateAdmition = ({ id, data }) => async (dispatch) => {
    dispatch(admissionsSlice.actions.updateAdmissionRequest());
    try {
        const res = await axiosInstance.put(`/admition/update/${id}`, data);
        dispatch(admissionsSlice.actions.updateAdmissionSuccess(res.data.admission));
        toast.success(res.data.message || "Updated successfully");
        dispatch(toggleUpdateAdmition());
    } catch (error) {
        dispatch(admissionsSlice.actions.updateAdmissionFailed());
        toast.error(error?.response?.data?.message || "Failed to update")
    }
}

export const deleteAdmition = (id, page) => async (dispatch, getState) => {
  dispatch(admissionsSlice.actions.deleteAdmissionRequest());

  try {
    const res = await axiosInstance.delete(`/admition/delete/${id}`);

    dispatch(admissionsSlice.actions.deleteAdmissionSuccess(id));
    toast.success(res.data.message || "Deleted successfully");

    const { totalAdmissions } = getState().admition;

    const updatedTotal = totalAdmissions - 1;
    const updatedMaxPage = Math.ceil(updatedTotal / 10) || 1;
    const validPage = Math.min(page, updatedMaxPage);

    dispatch(fetchAllAdmissions(validPage));

  } catch (error) {
    dispatch(admissionsSlice.actions.deleteAdmissionFailed());
    toast.error(
      error?.response?.data?.message || "Failed to delete"
    );
  }
};

export const registerAdmition = (data) => async (dispatch) => {
    dispatch(admissionsSlice.actions.admissionRegisterRequest());
    try {
        // Use a non-credential axios instance for registration so the server
        // doesn't overwrite the current admin session cookie by setting a
        // new auth cookie for the created user.
        const noCred = axios.create({
            baseURL: axiosInstance.defaults.baseURL,
            withCredentials: false,
        });
        const res = await noCred.post("/admition/new/admition", data);
        dispatch(admissionsSlice.actions.admissionRegisterSuccess(res.data.admission));
        toast.success(res.data.message || "Candidate registered successfully");
    } catch (error) {
        dispatch(admissionsSlice.actions.admissionRegisterFailed());
        toast.error(error?.response?.data?.message || "Registration failed")
    }
}

export default admissionsSlice.reducer;