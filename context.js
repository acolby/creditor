// pollyfill requirecontext if it is not supported (IE. node or not in browser)
if (
  !require.context &&
  !_try(function () {
    return !!window;
  }, false)
) {
  const contextpath = "require-context";
  require.context = require(contextpath);
}

module.exports = require.context;

function _try(toTry, onErrorReturn) {
  try {
    const toReturn = toTry();
    if (toReturn === undefined) return onErrorReturn;
    return toReturn;
  } catch (e) {
    return onErrorReturn;
  }
}
