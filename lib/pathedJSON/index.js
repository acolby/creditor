
function pathedJSON(initial = {}) {
  const database = _deepClone(initial);

  return {
    // wrapped in async
    get: (path) => { return _get(database)(path); },
    set: (path, to, gently) => { return _set(database)(path, to, gently); },
    copy: () => { return pathedJSON(database); },

    toJSON: () => { return database; },
    toPaths: () => { return _objectToDeepPaths(database); },
  };
}

module.exports = pathedJSON;

function _get(database) {
  return (path) => {
    let toReturn;
    try {
      toReturn = path.split('/').slice(1, 200)
        .reduce((acc, key) => {
          acc = acc[key];
          return acc;
        }, database);
      // eslint-disable-next-line no-empty
    } catch (err) {}
    return toReturn;
  };
}

function _set(database) {
  return (path, to, gently) => {
    if (gently && _isValidValue(_get(database, path))) return;
    if (!_isValidValue(to)) {
      _setDeep(database, undefined, ...path.split('/').filter((item) => { return item; }));
      _deepCleanup(database, path.split('/').filter((item) => { return item; }));
      return;
    }
    _setDeep(database, to, ...path.split('/').filter((item) => { return item; }));
  };
}

function _setDeep(toSet, to, ...rest) {
  if (typeof toSet !== 'object' || rest.length <= 1) {
    toSet[rest[0]] = to;
  } else {
    toSet[rest[0]] = toSet[rest[0]] || {};
    _setDeep(toSet[rest[0]], to, ...rest.slice(1));
  }
}

function _isValidValue(val) {
  return !(val === undefined || (val !== null && typeof val === 'object' && !Object.keys(val).length));
}

function _objectToDeepPaths(item, toReturn = {}, currentPath = '') {
  if (_isObjectWithKeys(item)) {
    Object.keys(item)
      .forEach((key) => {
        return _objectToDeepPaths(item[key], toReturn, `${currentPath}/${key}`);
      });
  } else if (item !== undefined) {
    toReturn[currentPath || ''] = item;
  }
  return toReturn;
}

function _isObjectWithKeys(item) {
  if (typeof item === 'object') {
    return Object.keys(item || {}).length;
  }
  return false;
}

function _deepCleanup(db, path) {
  // remove unneccary path items
  const currentAtPath = _get(db)(`/${path.join('/')}`);
  const name = path.pop();
  const parentObject = _get(db)(`/${path.join('/')}`);
  if (!_isValidValue(currentAtPath) && path.length) {
    delete parentObject[name];
    _deepCleanup(db, path);
  }
}

function _deepClone(item) {
  if (typeof item !== 'function' && typeof item !== 'object') return item;
  if (!Object.keys(item || {}).length) return item;
  return Object.keys(item || {})
    .reduce((acc, key) => {
      acc[key] = _deepClone(item[key]);
      return acc;
    }, {});
}

