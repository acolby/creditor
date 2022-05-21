const expect = require("chai").expect;
const path = require('path')
;

const mod = require("./");

describe("utils_replaceUsage", () => {
  it("should properly replace an entire rendered template with file with the items given in the map", () => {
    const given = `
      import {stores_user} from '#src/stores/user/index.js';
      import {stores_user_access} from '#src/stores/user/access/index.js';
      import {stores_analytics} from '#src/stores/analytics/index.js';

      function comps_user_login() {
        dispatch(stores_user_access());
      }

      exports comps_user_login;
    `;
    userFrom = path.normalize("stores/user");
    userTo = path.normalize("stores/profile");
    userF = path.normalize("stores/user/access");
    userT = path.normalize("stores/profile/access");
    const replaceMap = {
      [userFrom] : userTo,
      [userF]: userT
    };

    const expected = `
      import {stores_profile} from '#src/stores/profile/index.js';
      import {stores_profile_access} from '#src/stores/profile/access/index.js';
      import {stores_analytics} from '#src/stores/analytics/index.js';

      function comps_user_login() {
        dispatch(stores_profile_access());
      }

      exports comps_user_login;
    `;

    const res = mod(
      { templates: { stores: {}, comps: {} } },
      given,
      replaceMap
    );
    expect(res).to.equal(expected);
  });
});
