from flask import Flask, request, jsonify
import pandas as pd
import os
from utils import getDesignatedValue

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False #日本語文字化け対策
app.config["JSON_SORT_KEYS"] = False #ソートをそのまま

models_df = pd.read_csv("app/data/factory_model.csv")
models_df = models_df.fillna("")

@app.route('/')
def sayHello():
    return "Hello! API server is running.\n"

@app.route('/search-database')
def searchDatabase():
    query = request.args.get("query")
    if query == "":
        return jsonify([])
    
    # database_json = models_df[models_df["ポケモン"].str.contains(query)].to_json(orient="records",force_ascii=False)
    result_df = models_df[models_df["ポケモン"].str.contains(query)]
    database_json = result_df.drop(["せいかく", "努力値"], axis=1).to_json(orient="records",force_ascii=False)
    return database_json

@app.route('/get-detail-info')
def getDetailInfo():
    bfid = int(request.args.get("bfid"))
    name = getDesignatedValue(models_df, {"番号": bfid}, "ポケモン")
    types = [getDesignatedValue(models_df, {"番号": bfid}, "タイプ1"), getDesignatedValue(models_df, {"番号": bfid}, "タイプ2")]
    moves = [getDesignatedValue(models_df, {"番号": bfid}, "わざ{}".format(i + 1)) for i in range(4)]
    item = getDesignatedValue(models_df, {"番号": bfid}, "もちもの")
    nature = getDesignatedValue(models_df, {"番号": bfid}, "せいかく")
    effort_values = getDesignatedValue(models_df, {"番号": bfid}, "努力値")

    return jsonify({
        "name": name,
        "types": types,
        "moves": moves,
        "item": item,
        "nature": nature,
        "effort-values": effort_values,
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)