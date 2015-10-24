exports.getScriptsTagHtml = function (url_array, pre, after, separator) {
  function buildUrl (url) {
    return typeof url === 'string' && url.length ? (typeof pre === 'string' ? pre : '') + url + (typeof after=== 'string' ? after : '') : '';
  }
  return url_array.map(buildUrl).join(typeof separator === 'string'? separator : '');
}