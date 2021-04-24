export const initialState = {
    term: true,
};

export const actionTypes = {
    SET_DISPLAY_SIDEBAR: 'SET_DISPLAY_SIDEBAR',
};

const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case actionTypes.SET_DISPLAY_SIDEBAR:
            return {
                ...state,
                term: action.term,
            };

        default:
            return state;
    }
};

export default reducer;
