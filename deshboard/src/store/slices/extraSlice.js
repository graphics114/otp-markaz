import { createSlice } from "@reduxjs/toolkit";

const extraSlice = createSlice({
    name: "extra",
    initialState: {
        openedComponent: "Dashboard",
        isNavbarOpened: false,
        isRegisterUserOpened: false,
        isUpdateUserOpened: false,
        isResetPasswordOpened: false,
        isUpdateStudentOpened: false,
        isHifizCollageOpened: false,
        isDawaCollageOpened: false,
        isUpdateSAdmitionOpened: false,
        isRegisterAdmitionOpend: false,
        isEnrollStudentOpened: false,
        selectedUser: null,
    },
    reducers: {
        toggleComponent: (state, action) => {
            state.openedComponent = action.payload;
        },
        toggleNavbar: (state) => {
            state.isNavbarOpened = !state.isNavbarOpened
        },
        toggleRegisterUser: (state) => {
            state.isRegisterUserOpened = !state.isRegisterUserOpened
        },
        toggleUpdateUser: (state) => {
            state.isUpdateUserOpened = !state.isUpdateUserOpened
        },
        toggleResetPassword: (state) => {
            state.isResetPasswordOpened = !state.isResetPasswordOpened
        },
        toggleUpdateStudent: (state) => {
            state.isUpdateStudentOpened = !state.isUpdateStudentOpened
        },
        toggleHifizCollage: (state) => {
            state.isHifizCollageOpened = !state.isHifizCollageOpened
        },
        toggleDawaCollage: (state) => {
            state.isDawaCollageOpened = !state.isDawaCollageOpened
        },
        toggleUpdateAdmition: (state) => {
            state.isUpdateSAdmitionOpened = !state.isUpdateSAdmitionOpened
        },
        toggleRegisterAdmition: (state) => {
            state.isRegisterAdmitionOpend = !state.isRegisterAdmitionOpend
        },
        toggleEnrollStudent: (state) => {
            state.isEnrollStudentOpened = !state.isEnrollStudentOpened
        }
    },
});

export const {
    toggleComponent,
    toggleNavbar,
    toggleRegisterUser,
    toggleUpdateUser,
    toggleResetPassword,
    toggleUpdateStudent,
    toggleHifizCollage,
    toggleDawaCollage,
    toggleUpdateAdmition,
    toggleRegisterAdmition,
    toggleEnrollStudent,
} = extraSlice.actions;

export default extraSlice.reducer;