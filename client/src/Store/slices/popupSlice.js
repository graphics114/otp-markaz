import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
    name:"popup",
    initialState: {
        openedComponent: "Dashboard",
        isSidebarOpen: false,
        isAuthPopupOpen:false,
        isNavbarOpened: false,
        isRegisterAdmitionOpend: false,
    },

    reducers: {
        toggleComponent: (state, action) => {
            state.openedComponent = action.payload;
        },

        toggleSidebar(state) {
            state.isSidebarOpen = !state.isSidebarOpen;
        },

        toggleAuthPopup(state) {
            state.isAuthPopupOpen = !state.isAuthPopupOpen;
        },

        toggleNavbar: (state) => {
            state.isNavbarOpened = !state.isNavbarOpened
        },

        toggleRegisterAdmition: (state) => {
            state.isRegisterAdmitionOpend = !state.isRegisterAdmitionOpend
        }
    },
});

export const { toggleComponent, toggleSidebar, toggleAuthPopup, toggleNavbar, toggleRegisterAdmition } = popupSlice.actions;
export default popupSlice.reducer;