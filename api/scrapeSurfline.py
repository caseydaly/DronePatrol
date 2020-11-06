#tool to scrape surf spots from Surflines API

import requests
import json
import mysql.connector
import sys

#should get all surf spots in california and some in oregon

def get_spots(south, west, north, east):
    spots = []
    r = requests.get("https://services.surfline.com/kbyg/mapview?south=" + south + "&west=" + west + "&north=" + north + "&east=" + east)
    string = r.text
    json_obj = json.loads(string)
    surfline_locations = json_obj['data']['spots']
    for spot in surfline_locations:
        if (not "overview" in str(spot["name"]).lower()):
            spots.append({"name": spot["name"], "lat": spot["lat"], "lon": spot["lon"]})
    return spots

def insert_row(spot_id, spot, lat, long, db, cursor):
    sql = "INSERT INTO Spots (ID, Location, Latitude, Longitude) VALUES (%s, %s, %s, %s)"
    val = (spot_id, spot, lat, long)
    cursor.execute(sql, val)
    db.commit()



def add_spots_to_db(spots, password):
    mydb = mysql.connector.connect(
        host="surfspots.cld2beuyqzv3.us-west-1.rds.amazonaws.com",
        user="rootuser",
        password=password,
        database="sys"
    )
    mycursor = mydb.cursor()
    for i in range(len(spots)):
        insert_row(i, spots[i]["name"], spots[i]["lat"], spots[i]["lon"], mydb, mycursor)

def main():
    if len(sys.argv) < 2:
        print("You need to enter in the DB password")
        return
    db_pass = sys.argv[1]
    spots = get_spots("-90", "-180", "90", "180")
    add_spots_to_db(spots, db_pass)



if __name__ == '__main__':
    main()