
const state = {
  loggedIn: null,
};

const actions = {
  login: async (id) => {
    state.loggedIn = true;
    return state;
  },
}

export const stores_user_access = {
  actions,
  state,
}

export default stores_user_access;
