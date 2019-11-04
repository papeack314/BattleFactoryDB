from flask import Flask, request, jsonify
import pandas as pd
import os
import json
import math
from utils import getDesignatedValue

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False #日本語文字化け対策
app.config["JSON_SORT_KEYS"] = False #ソートをそのまま

models_df = pd.read_csv("app/data/factory_model.csv")
models_df = models_df.fillna("")
nature_df = pd.read_csv("app/data/nature.csv")
types_df = pd.read_csv("app/data/types.csv")

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

@app.route('/calc-values')
def calcValues():
    name = request.args.get("name")
    nature = request.args.get("nature")
    indivisual_values = int(request.args.get("individual-values"))
    effort_values = json.loads(request.args.get("effort-values"))

    base_stats = types_df[types_df["ポケモン"] == name][["HP", "攻撃", "防御", "特攻", "特防", "素早さ"]]
    values_dict = {}
    for column in base_stats:
        base_value = int(base_stats[column].values[0])
        effort_val = int(effort_values.get(column, 0))
        if column == "HP":
            values_dict[column] = math.floor((base_value*2 + indivisual_values + effort_val/4) + 100 + 10)
        else:
            revision_co = nature_df[nature_df["性格"] == nature][column].values[0]
            values_dict[column] = math.floor(((base_value*2 + indivisual_values + effort_val/4) + 5)*revision_co)

    return jsonify(values_dict)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)