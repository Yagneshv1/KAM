from flask import jsonify

# Converts date in yyyy-mm-dd format to list of [yyyy, mm, dd]
def convertDateStringToParts(dateString):
    return [int(i) for i in dateString.split('-')]

def handle_errors(e, sqlError=False):
    if sqlError:
        message = 'Database Error Occured'
    else:
        message = "Internal Server Error"
    
    return jsonify({"message": message + str(e)}), 500

# Converts the json aggregated data from DB to list of JSON objects
def convertJSONAggToList(agg_data):
    result = []
    if not agg_data or not agg_data[0]:
        pass
    else:
        for row in agg_data[0]:
            result.append(dict(row.items()))  
    return result