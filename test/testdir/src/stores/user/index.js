
const state = {
  username: null,
  email: null,
};

const actions = {
  fetch: async (id) => {
    state.username = 'username';
    return state;
  },
}

export const user_store = {
  actions,
  state,
}

export default stores_user;
