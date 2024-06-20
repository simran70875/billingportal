const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  id: localStorage.getItem("id") || null,
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  userid: localStorage.getItem("userid") || null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoggedIn: true,
        id: action.payload.id,
        token: action.payload.token,
        role: action.payload.role,
        userid: action.payload.userid,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        id: null,
        token: null,
        role: null,
        userid: null,
      };
    default:
      return state;
  }
};

export default authReducer;
