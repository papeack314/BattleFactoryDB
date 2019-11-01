TypeName = {
    "ノーマル": "normal",
    "ほのお": "fire",
    "みず": "water",
    "くさ": "grass",
    "でんき": "electric",
    "エスパー": "psychic",
    "こおり": "ice",
    "ドラゴン": "dragon",
    "あく": "dark",
    "フェアリー": "fairy",
    "かくとう": "fighting",
    "ひこう": "flying",
    "どく": "poison", 
    "じめん": "ground",
    "いわ": "rock",
    "むし": "bug",
    "ゴースト": "ghost",
    "はがね": "steel"
}

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
            dataType: "json",

        }).done(function(data) {
            createDatabaseTalbe(data);
            $("#database-table > table").addClass("table table-bordered").DataTable();
        
        }).fail(function() {
            alert("データベースの取得に失敗しました。")
        
        }).always(function() {
            $(".loader").hide();
        });
    });
});

function createDatabaseTalbe(data){
    //テーブルの準備
    $("#database-table").append("<table><thead></thead><tbody></tbody></table>");
    $("#database-table > table > thead").append("<tr></tr>");
    
    //ヘッダの生成
    let columns = Object.keys(data[0]);
    // let columns = ["番号", "ポケモン", "タイプ1", "わざ1", "もちもの", "せいかく"]
    for (let i = 0; i < columns.length; i++){
        $("#database-table > table > thead > tr").append("<td><div>" + columns[i] + "</div></td>");
    }
    
    //コンテンツの生成
    for (let i = 0; i < data.length; i++){
        $("#database-table > table > tbody").append("<tr></tr>");
        for(let j = 0; j < columns.length; j++){
            // nullのセルは空欄にして飛ばす
            if (data[i][columns[j]] == null) {
                $("#database-table > table > tbody tr:last-of-type").append("<td><div></div></td>");
                continue;
            };

            $("#database-table > table > tbody tr:last-of-type").append("<td><div>" + data[i][columns[j]] + "</div></td>");
            //タイプのクラスを付与
            if ((columns[j] == "タイプ1" || columns[j] == "タイプ2")){
                $("#database-table > table > tbody tr:last-of-type > td:last-of-type div").addClass("types " + TypeName[data[i][columns[j]]]);
            }
        }

    }
}