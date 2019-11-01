from flask import Flask, request, jsonify
import pandas as pd
import os
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False #日本語文字化け対策
app.config["JSON_SORT_KEYS"] = False #ソートをそのまま

models_df = pd.read_csv("app/data/factory_model.csv")

@app.route('/')
def sayHello():
    return "Hello! API server is running.\n"

@app.route('/search')
def searchPokemon():
    query = request.args.get("query")
    return jsonify({
        "query": query
    })

@app.route('/get-database')
def getDatabase():
    database_json = models_df.to_json(orient="records",force_ascii=False)
    return database_json
    # datatable_html = models_df.to_html(index=False, escape=False).replace("NaN", "")
    # return datatable_html

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)