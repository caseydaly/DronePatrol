#tool to scrape surf spots from Surflines API

import requests
import json

#should get all surf spots in california and some in oregon

def get_spots():
    spots = []
    r = requests.get("https://services.surfline.com/kbyg/mapview?south=31.578535&west=-124.375152&north=45.213004&east=-116.349817")
    string = r.text
    json_obj = json.loads(string)
    surfline_locations = json_obj['data']['spots']
    for spot in surfline_locations:
        if (not "overview" in str(spot["name"]).lower()):
            spots.append({"name": spot["name"], "lat": spot["lat"], "lon": spot["lon"]})
    return spots