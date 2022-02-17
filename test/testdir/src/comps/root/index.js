import {user_store} from '#src/stores/user';

export const comps_root = {

  onMount: async () => {
    await user_store.actions.fetch('userId');
  },
   
  render: () => {
    return '</div>'
  },

}