
var acelayablog = {

    initSearchForm : function() {
        $("#search-form .fa-search").click(function() {
            $(this).closest("form").submit();
        });
    },

    initShareButtons : function() {
        var buttons = $(".buttons .btn-social");
        if (buttons.size() == 0) {
            return;
        }

        buttons.click(function(e) {
            var link = $(this).attr("href");

            e.preventDefault();
            window.open(link, 'Share article', 'menubar=no, toolbar=no, resizable=yes, scrollbars=yes, height=600, width=600');
        });
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
    },

    initToTopButton : function() {
        var btn = $(".to-top");
        btn.click(function(e) {
            e.preventDefault();
            $("body", "html").animate({
                scrollTop : 0
            })
        });
    }

};