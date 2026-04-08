import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const attendanceSlice = createSlice({
    name: "attendance",
    initialState: {
        loading: false,
        programs: [],
        students: [],
        attendanceData: [], // {student_id, status}
        yesterdayAttendanceData: [], // For yellow highlight if absent yesterday
        attendanceReport: [], // For percentage view
        studentDetailedAttendance: null, // For single student details
    },
    reducers: {
        attendanceRequest(state) {
            state.loading = true;
        },
        clearAttendanceData(state) {
            state.attendanceData = [];
        },
        clearYesterdayAttendanceData(state) {
            state.yesterdayAttendanceData = [];
        },

        getProgramsSuccess(state, action) {
            state.loading = false;
            state.programs = action.payload;
        },
        getStudentsSuccess(state, action) {
            state.loading = false;
            state.students = action.payload;
        },
        getAttendanceDataSuccess(state, action) {
            state.loading = false;
            state.attendanceData = action.payload;
        },
        getYesterdayAttendanceDataSuccess(state, action) {
            state.yesterdayAttendanceData = action.payload;
        },
        getAttendanceReportSuccess(state, action) {
            state.loading = false;
            state.attendanceReport = action.payload;
        },
        getStudentDetailedAttendanceSuccess(state, action) {
            state.loading = false;
            state.studentDetailedAttendance = action.payload;
        },
        clearStudentDetailedAttendance(state) {
            state.studentDetailedAttendance = null;
        },
        attendanceFailed(state) {
            state.loading = false;
        },
    },
});

export const fetchPrograms = () => async (dispatch) => {
    dispatch(attendanceSlice.actions.attendanceRequest());
    try {
        const res = await axiosInstance.get("/attendance/programs/getall");
        dispatch(attendanceSlice.actions.getProgramsSuccess(res.data.programs));
    } catch (error) {
        dispatch(attendanceSlice.actions.attendanceFailed());
        toast.error(error?.response?.data?.message || "Failed to fetch programs");
    }
};

export const addProgram = (data) => async (dispatch) => {
    dispatch(attendanceSlice.actions.attendanceRequest());
    try {
        const res = await axiosInstance.post("/attendance/program/add", data);
        toast.success(res.data.message);
        dispatch(fetchPrograms());
    } catch (error) {
        dispatch(attendanceSlice.actions.attendanceFailed());
        toast.error(error?.response?.data?.message || "Failed to add program");
    }
};

export const deleteProgram = (id) => async (dispatch) => {
    dispatch(attendanceSlice.actions.attendanceRequest());
    try {
        const res = await axiosInstance.delete(`/attendance/program/delete/${id}`);
        toast.success(res.data.message);
        dispatch(fetchPrograms());
    } catch (error) {
        dispatch(attendanceSlice.actions.attendanceFailed());
        toast.error(error?.response?.data?.message || "Failed to delete program");
    }
};

export const fetchStudentsForAttendance = (params) => async (dispatch) => {
    dispatch(attendanceSlice.actions.attendanceRequest());
    try {
        const res = await axiosInstance.get("/attendance/students", { params });
        dispatch(attendanceSlice.actions.getStudentsSuccess(res.data.students));
    } catch (error) {
        dispatch(attendanceSlice.actions.attendanceFailed());
        toast.error(error?.response?.data?.message || "Failed to fetch students");
    }
};

export const fetchAttendanceData = (params) => async (dispatch) => {
    dispatch(attendanceSlice.actions.attendanceRequest());
    try {
        const res = await axiosInstance.get("/attendance/get", { params });
        dispatch(attendanceSlice.actions.getAttendanceDataSuccess(res.data.attendance));
    } catch (error) {
        dispatch(attendanceSlice.actions.attendanceFailed());
        toast.error(error?.response?.data?.message || "Failed to fetch attendance data");
    }
};

export const fetchYesterdayAttendanceData = (params) => async (dispatch) => {
    try {
        const res = await axiosInstance.get("/attendance/get", { params });
        dispatch(attendanceSlice.actions.getYesterdayAttendanceDataSuccess(res.data.attendance));
    } catch (error) {
        // Silent fail for yesterday's data
    }
};

export const fetchAttendanceReport = (params) => async (dispatch) => {
    dispatch(attendanceSlice.actions.attendanceRequest());
    try {
        const res = await axiosInstance.get("/attendance/report", { params });
        dispatch(attendanceSlice.actions.getAttendanceReportSuccess(res.data.report));
    } catch (error) {
        dispatch(attendanceSlice.actions.attendanceFailed());
        toast.error(error?.response?.data?.message || "Failed to fetch attendance report");
    }
};



export const submitAttendance = (data, params) => async (dispatch) => {
    dispatch(attendanceSlice.actions.attendanceRequest());
    try {
        const res = await axiosInstance.post("/attendance/submit", data);
        toast.success(res.data.message);
        // Re-fetch to sync with database
        dispatch(fetchAttendanceData(params));
    } catch (error) {
        dispatch(attendanceSlice.actions.attendanceFailed());
        toast.error(error?.response?.data?.message || "Failed to submit attendance");
    }
};

export const clearAttendanceData = () => (dispatch) => {
    dispatch(attendanceSlice.actions.clearAttendanceData());
};

export const fetchStudentDetailedAttendance = (student_id, params) => async (dispatch) => {
    dispatch(attendanceSlice.actions.attendanceRequest());
    try {
        const res = await axiosInstance.get(`/attendance/student/${student_id}/details`, { params });
        dispatch(attendanceSlice.actions.getStudentDetailedAttendanceSuccess(res.data));
    } catch (error) {
        dispatch(attendanceSlice.actions.attendanceFailed());
        toast.error(error?.response?.data?.message || "Failed to fetch student attendance details");
    }
};

export const clearStudentDetailedAttendance = () => (dispatch) => {
    dispatch(attendanceSlice.actions.clearStudentDetailedAttendance());
};

export default attendanceSlice.reducer;
