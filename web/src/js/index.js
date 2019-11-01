$(function(){
    $('#search-button').click(function(){
        $.ajax({
            url: "api/search",
            dataType: "json",
            data: {query: $("#search-box").val()},
        }).done(function(data) {
            console.log(data);
        }).fail(function(){
            alert("データベースの検索に失敗しました。")
        });
    });

    // データベースの表示
    $("#database-table").ready(function() {
        $.ajax({
            url: "api/get-database",
            dataType: "html",

        }).done(function(data) {
            $("#database-table").html(data);
            $("#database-table > table").addClass("table table-bordered").DataTable();
        
        }).fail(function() {
            alert("データベースの取得に失敗しました。")
        
        }).always(function() {
            $(".loader").hide();
        });
    });
});
