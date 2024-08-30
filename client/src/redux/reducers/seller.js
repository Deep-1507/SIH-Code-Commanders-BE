// reducers/shopReducer.js
const initialState = {
    currentShop: null,
  };
  
  export default function shopReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_SHOP':
        return { ...state, currentShop: action.payload };
      case 'LOGOUT_SHOP':
        return { ...state, currentShop: null };
      default:
        return state;
    }
  }
  