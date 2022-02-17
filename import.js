
module.exports = dirImport;

let context;
function dirImport(ctx, cache = true) {

  context = (cache && context) || ctx;

  return _nestedExporter(context, context.keys());

  // helper nested exporter
  function _nestedExporter(context, contextItems) {
    
    const structure = {};
    (contextItems || [])
      .forEach(function(key) {

        const keysSplit = key.split('/');
        const name = keysSplit[keysSplit.length - 2];
        const file = keysSplit[keysSplit.length - 1];

        if (!name || name === '.' || file !== 'index.js') return; // return if does not match structure
        const defaultMod = keysSplit.filter(function(key) {
          return key.indexOf('.') < 0;
        });

        const mod = _try(function() {
          return context(key)
        }, {});

        const toPush = mod.default || mod;
        
        toPush.__creditor = { item: true };
        defaultMod.push(toPush);

        _patchDeep(structure, defaultMod);
      });
    return structure;
  }
}

function _patchDeep(toSet, rest) {
  if (rest.length <= 2) {
    const current = toSet[rest[0]];
    if (current) {
      toSet[rest[0]] = rest[1];
      Object.keys(current).forEach(function(key) { return toSet[rest[0]][key] = current[key]; });
    } else {
      toSet[rest[0]] = rest[1];
    }
  } else {
    toSet[rest[0]] = toSet[rest[0]] || { };
    _patchDeep(toSet[rest[0]], rest.slice(1));
  }
}

function _try(toTry, onErrorReturn) {
  try {
    const toReturn = toTry();
    if (toReturn === undefined) return onErrorReturn;
    return toReturn;
  } catch (e) {
    return onErrorReturn;
  }
}

function _noOp() {}
