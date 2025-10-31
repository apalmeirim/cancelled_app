(function () {
  var base = "/cancelled_app";
  var path = window.location.pathname || "/";
  var search = window.location.search || "";
  var hash = window.location.hash || "";

  if (path.indexOf(base) !== 0) {
    window.location.replace(base + "/");
    return;
  }

  var relative = path.slice(base.length) + search + hash;
  var redirectParam = encodeURIComponent(relative.replace(/^\//, ""));
  window.location.replace(base + "/?redirect=" + redirectParam);
})();
