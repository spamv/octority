CodeMirror.defineExtension('search', function(query) {

  // This is all taken from search.js, pretty much as is for the first part.
  function SearchState() {
    this.posFrom = this.posTo = this.lastQuery = this.query = null;
    this.overlay = null;
  }

  function getSearchState(cm) {
    return cm.state.search || (cm.state.search = new SearchState());
  }

  function searchOverlay(query, caseInsensitive) {
    if (typeof query == "string")
      query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
    else if (!query.global)
      query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

    return {
      token: function(stream) {
        query.lastIndex = stream.pos;
        var match = query.exec(stream.string);
        if (match && match.index == stream.pos) {
          stream.pos += match[0].length || 1;
          return "searching";
        } else if (match) {
          stream.pos = match.index;
        } else {
          stream.skipToEnd();
        }
      }
    };
  }

  function queryCaseInsensitive(query) {
    return typeof query == "string" && query == query.toLowerCase();
  }

  function parseString(string) {
    return string.replace(/\\(.)/g, function(_, ch) {
      if (ch == "n") return "\n"
      if (ch == "r") return "\r"
      return ch
    })
  }

  function parseQuery(query) {
    var isRE = query.match(/^\/(.*)\/([a-z]*)$/);
    if (isRE) {
      try {
        query = new RegExp(isRE[1], isRE[2].indexOf("i") == -1 ? "" : "i");
      } catch (e) {} // Not a regular expression after all, do a string search
    } else {
      query = parseString(query)
    }
    if (typeof query == "string" ? query == "" : query.test(""))
      query = /x^/;
    return query;
  }

  // From here it's still from search.js, but a bit tweaked so it applies
  // as an extension, these are basically clearSearch and startSearch.
  var state = getSearchState(this);
  state.lastQuery = state.query;
  state.query = state.queryText = null;
  this.removeOverlay(state.overlay);
  if (state.annotate) {
    state.annotate.clear();
    state.annotate = null;
  }

  state.queryText = query;
  state.query = parseQuery(query);
  this.removeOverlay(state.overlay, queryCaseInsensitive(state.query));
  state.overlay = searchOverlay(state.query, queryCaseInsensitive(state.query));

  this.addOverlay(state.overlay);
  if (this.showMatchesOnScrollbar) {
    if (state.annotate) {
      state.annotate.clear();
      state.annotate = null;
    }
    state.annotate = this.showMatchesOnScrollbar(state.query, queryCaseInsensitive(state.query));
  }
});