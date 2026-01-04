import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
    name:"popup",
    initialState: {
        openedComponent: "Dashboard",
        isSidebarOpen: false,
        isAuthPopupOpen:false,
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
    },
});

export const { toggleComponent, toggleSidebar, toggleAuthPopup } = popupSlice.actions;
export default popupSlice.reducer;