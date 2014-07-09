
var acelayablog = {

    initSearchForm : function() {
        $("#search-form .fa-search").click(function() {
            $(this).closest("form").submit();
        });
    },

    initShareButtons : function() {

    },

    initHighlightjs : function() {
        if (typeof hljs == 'undefined') {
            return;
        }
        hljs.initHighlightingOnLoad();
    },

    initSearch : function() {
        var searchInput = $('#search-query');
        if (searchInput.size() == 0) {
            return;
        }

        searchInput.lunrSearch({
            indexUrl: '/search.json',               // URL of the `search.json` index data for your site
            results:  '#search-results',            // jQuery selector for the search results container
            entries:  '.hfeed',                     // jQuery selector for the element to contain the results list, must be a child of the results element above.
            template: '#search-results-template'    // jQuery selector for the Mustache.js template
        });
    }

};