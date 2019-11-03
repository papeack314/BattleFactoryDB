def getDesignatedValue(df, query_dict, target_col):
    ret = []
    for query_key, query_val in query_dict.items():
        specified_row = df[df[query_key] == query_val]
        val = specified_row.loc[:, target_col].values[0]
        ret.append(val)
    
    if len(ret) == 0:
        return None
    elif len(ret) == 1:
        return ret[0]
    else:
        return ret