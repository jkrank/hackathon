var page = {};

(function (lib) {
  lib.getRankings = function () {
    jQuery.ajax({
      url: '/getStatistics'
    , success: function(data) {
      page.lib.ranking_rows = data;
    }
    , async:   false
    });
    return page.lib.ranking_rows;
  }
})((page.lib = {}));