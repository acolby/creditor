

// const combineReducers = require('redux').combineReducers;

/*

// const store_user = require('src/store/user');
// const store_user_access = require('src/store/user/access');
// const store_user_profile = require('src/store/user/profile');
// 
// module.exports = combineReducers({
//   user: combineReducers(store_user.reducer, {
//     access: combineReducers(store_user_access.reducer),
//     profile: combineReducers(store_user_access.reducer),
//   })
// })
// 
// compose({ method: 'combineReducers', property: 'reducer' })

*/

function aggreagtors_compose(options, params) {
  const { structure, pattern } = params;
  const { method, suffix } = options;

  Object.keys((structure) {

  })

  return `${method}({





})`;
}

// in aggreagtor
// module.exports = CREDITOR_COMPOSE({ method: 'combineReducers', property: 'reducer' })

module.exports = aggreagtors_compose;