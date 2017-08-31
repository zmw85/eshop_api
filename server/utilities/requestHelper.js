const conf = require('../config');

module.exports = {

  // filter the model fields on request
  filterAttributes: function(targetAttrs, sourceAttrs) {

    if (!sourceAttrs || sourceAttrs.length === 0) {
      // if source is undefined, null, empty, return target attributes
      return targetAttrs;
    }

    // trim and convert source attribute names to lower case
    sourceAttrs = sourceAttrs.map(item => {
      return item.trim().toLowerCase();
    });

    // filter out attributes
    sourceAttrs = targetAttrs.filter(item => {
      return sourceAttrs.indexOf(item.toLowerCase()) >= 0;
    });

    // always return 'id' attribute if there is one
    if (sourceAttrs.length > 0 && sourceAttrs.indexOf('id') < 0 && targetAttrs.indexOf('id') > -1) {
      // add 'id' field to the first position
      sourceAttrs.splice(0, 0, 'id')
    }

    return sourceAttrs.length > 0 ? sourceAttrs : targetAttrs;
  },

  // set result limit
  setLimit: function(limit) {
    let defLimit = conf.appSettings.defaultLimit || 50,
      max = conf.appSettings.maxLimit || 500;

    if (limit === parseInt(limit, 10)) {
      limit = limit > max ? max : limit < 0 ? defLimit : limit;
    } else {
      limit = defLimit;
    }

    return limit;
  }

}