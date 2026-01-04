import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleUpdateStudent } from "./extraSlice"


const studentsSlice = createSlice({
    name: "std",
    initialState: {
        loading: false,
        totalStudents: 0,
        students: [],
        results: [],
        totalStudentsCount: 0,
        selectedStudent: null,
        isAuthenticated: false,
    },
    reducers: {
        getAllStudentsRequest(state){
            state.loading = true;
        },
        getAllStudentsSuccess(state, action){
            state.loading = false;
            state.students = action.payload.students;
            state.totalStudents = action.payload.count || (action.payload.totalStudents || 0);
        },
        getAllStudentsFailed(state){
            state.loading = false;
        },

        updateStudentRequest(state){
            state.loading = true;
        },
        updateStudentSuccess(state, action){
            state.loading = false;
            state.students = state.students.map((student) => 
                student.id === action.payload.id ? action.payload : student);
        },
        updateStudentFailed(state){
            state.loading = false;
        },

        deleteStudentRequest(state){
            state.loading = true;
        },
        deleteStudentSuccess(state, action){
            state.loading = false;
            state.students = state.students.filter(student => student.id !== action.payload);
            state.totalStudents = Math.max(0, state.totalStudents -1);
        },
        deleteStudentFailed(state){
            state.loading = false;
        },

        getAllStudentsResultRequest(state){
            state.loading = true;
        },
        getAllStudentsResultSuccess(state, action){
          state.loading = false;
          state.results = action.payload.results;
          state.totalStudents = action.payload.count || 0;
        },
        getAllStudentsResultFailed(state){
            state.loading = false;
        },

        updateResultRequest(state){
            state.loading = true;
        },
        updateResultSuccess(state, action){
          state.loading = false;
          state.results = state.results.map(result => result.result_id === action.payload.result_id
              ? action.payload : result);
        },
        updateResultFailed(state){
            state.loading = false;
        },
    },
});

export const fetchAllStudents = (page) => async (dispatch) => {
    dispatch(studentsSlice.actions.getAllStudentsRequest());
    try {
        const res = await axiosInstance.get(`/student/fatchall/students?page=${page}`);
        dispatch(studentsSlice.actions.getAllStudentsSuccess(res.data));
    } catch (error) {
        dispatch(studentsSlice.actions.getAllStudentsFailed());
        toast.error(error?.response?.data?.message || "Failed to get students");
    }
};

export const updateStudent = (id, data) => async (dispatch) => {
    dispatch(studentsSlice.actions.updateStudentRequest());
    try {
        const res = await axiosInstance.put(`/student/update/student/${id}`, data);
        dispatch(studentsSlice.actions.updateStudentSuccess(res.data.student));
        toast.success(res.data.message || "Updated successfully");
        dispatch(toggleUpdateStudent());
    } catch (error) {
        dispatch(studentsSlice.actions.updateStudentFailed());
        toast.error(error?.response?.data?.message || "Failed to update")
    }
}

export const deleteStudent = (id, page) => async (dispatch, getState) => {
  dispatch(studentsSlice.actions.deleteStudentRequest());

  try {
    const res = await axiosInstance.delete(`/student/delete/student/${id}`);

    dispatch(studentsSlice.actions.deleteStudentSuccess(id));
    toast.success(res.data.message || "Deleted successfully");

    const { totalStudents } = getState().std;

    const updatedTotal = totalStudents - 1;
    const updatedMaxPage = Math.ceil(updatedTotal / 10) || 1;
    const validPage = Math.min(page, updatedMaxPage);

    dispatch(fetchAllStudents(validPage));

  } catch (error) {
    dispatch(studentsSlice.actions.deleteStudentFailed());
    toast.error(
      error?.response?.data?.message || "Failed to delete student"
    );
  }
};

export const fetchAllExamResults = (page) => async (dispatch) => {
    dispatch(studentsSlice.actions.getAllStudentsResultRequest());
    try {
        const res = await axiosInstance.get(`/exam/fetch/all/result?page=${page}`);
        dispatch(studentsSlice.actions.getAllStudentsResultSuccess(res.data));
    } catch (error) {
        dispatch(studentsSlice.actions.getAllStudentsResultFailed());
        toast.error(error?.response?.data?.message || "Failed to get students");
    }
};

export const updateResult = (id, data, showToast = true) => async (dispatch) => {
  dispatch(studentsSlice.actions.updateResultRequest());

  try {
    const res = await axiosInstance.put(`/exam/update/result/${id}`, data);

    dispatch(studentsSlice.actions.updateResultSuccess(res.data.result));

    if (showToast) {
      toast.success(res.data.message || "Updated successfully");
    }
  } catch (error) {
    dispatch(studentsSlice.actions.updateResultFailed());

    if (showToast) {
      toast.error(error?.response?.data?.message || "Failed to update");
    }
  }
};


export default studentsSlice.reducer;