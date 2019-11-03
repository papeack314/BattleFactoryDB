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
    createTableHeader();
    $('#search-box').change(function(){
        $("#database-table tbody").empty();
        $("#database-table").hide();
        $(".loader").show();
        $.ajax({
            url: "api/search-database",
            dataType: "json",
            data: {"query": $("#search-box").val()}

        }).done(function(data) {
            if (data.length == 0) {
                return false;
            }
            createDatabaseTalbe(data);
            $("#database-table > table").addClass("table table-bordered");
        
        }).fail(function() {
            alert("データベースの検索に失敗しました。")
        
        }).always(function() {
            $(".loader").hide();
            $("#database-table").show();
            $("#search-box").val("");
        });
    });
});

function createTableHeader(){
    $.ajax({
        url: "api/search-database",
        dataType: "json",
        data: {"query": "フシギダネ"}
    }).done(function(data) {
        if (data.length == 0) {
            alert("データテーブルの初期化に失敗しました");
            return false;
        };
        //ヘッダの生成
        let columns = Object.keys(data[0]);
        for (let i = 0; i < columns.length; i++){
            $("#database-table > table > thead > tr").append("<td><div>" + columns[i] + "</div></td>");
        }

    }).fail(function(data){
        alert("データテーブルの初期化に失敗しました");
    });
};

function createDatabaseTalbe(data){   
    //ヘッダの生成
    let columns = Object.keys(data[0]);
        
    //コンテンツの生成
    for (let i = 0; i < data.length; i++){
        $("#database-table > table > tbody").append("<tr></tr>");
        for(let j = 0; j < columns.length; j++){
            // nullのセルは空欄にして飛ばす
            if (data[i][columns[j]] == null) {
                $("#database-table > table > tbody tr:last-of-type").append("<td><div></div></td>");
                continue;
            };

            //番号の列はモーダルウィンドウを開くためのボタンにする
            if (columns[j] == "番号"){
                $("#database-table > table > tbody tr:last-of-type").append(
                '<td><div class="center"><button type="button" class="btn btn-default detail-button" data-toggle="modal" data-target="#detail-modal">' + data[i][columns[j]] + '</div></button></td>');
            }
            else{
                $("#database-table > table > tbody tr:last-of-type").append("<td><div>" + data[i][columns[j]] + "</div></td>");
            }
            //タイプのクラスを付与
            if ((columns[j] == "タイプ1" || columns[j] == "タイプ2")){
                $("#database-table > table > tbody tr:last-of-type > td:last-of-type div").addClass("types " + TypeName[data[i][columns[j]]]);
            }
        }
    }
    $(".detail-button").click(function(){
        $.ajax({
            url: "api/get-detail-info",
            dataType: "json",
            data: {"bfid": $(this).text()}
        
        }).done(function(data) {
            console.log(data);
            let name = data["name"];
            let types = data["types"];
            let moves = data["moves"];
            let item = data["item"];
            let nature = data["nature"];
            let effort_values = data["effort-values"];

            $("#modal-name").text(name);
            $("#modal-type1").text(types[0]).removeAttr("class").addClass("types " + TypeName[types[0]]);
            if (types[1] != "") {
                $("#modal-type2").text(types[1]).addClass("types " + TypeName[types[1]]);
            }
            for (let i = 0; i < moves.length; i++){
                $("#modal-move" + (i + 1)).text(moves[i]);
            }
            $("#modal-item").text(item);
            $("#modal-nature").text(nature);
            $("#modal-effort-values").text(effort_values);
        
        }).fail(function(){
            alert("詳細情報の取得に失敗しました。");
        });
    });
}