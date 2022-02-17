// const assert = require('assert');
// const mod = require('./')
// 
// const pattern = 'store';
// const structure = {
//   user: {},
//   device: {}
// };
// 
// describe('aggreagtors_compose', () => {
//   it('should return a string contining the composed data', () => {
//     const ops = { method: 'combine' };
//     const res = mod(ops, { structure, pattern});
//     assert.equal(res, _testString(ops))
//   });
// });
// 
// 
// function _testString({ method = '', suffix = ''}) {
//   return `${method}({
//     user: ${method}(store_user${suffix})
//     device: ${method}(store_device${suffix})
//   })`;
// }
