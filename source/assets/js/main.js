$(document).ready(function() {
    $("#search-form .fa-search").click(function() {
        $(this).closest("form").submit();
    });
});