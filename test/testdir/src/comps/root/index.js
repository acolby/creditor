import {stores_user} from '#src/stores/user';

export const comps_root = {

  onMount: async () => {
    await stores_user.actions.fetch('userId');
  },
   
  render: () => {
    return '</div>'
  },

};
