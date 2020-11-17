#tool to scrape surf spots from Surflines API

import requests
import json
import mysql.connector
import sys

#should get all surf spots in california and some in oregon

def put_spots(south, west, north, east, password):
    mydb = mysql.connector.connect(
        host="surfspots.cld2beuyqzv3.us-west-1.rds.amazonaws.com",
        user="rootuser",
        password=password,
        database="sys"
    )
    mycursor = mydb.cursor()
    spots = []
    r = requests.get("https://services.surfline.com/kbyg/mapview?south=" + south + "&west=" + west + "&north=" + north + "&east=" + east)
    string = r.text
    json_obj = json.loads(string)
    surfline_locations = json_obj['data']['spots']
    i=1
    for spot in surfline_locations:
        if (not "overview" in str(spot["name"]).lower()):
            print(spot['name'])
            latlng = str(spot["lat"]) + "," + str(spot["lon"])
            print(latlng)
            loc = requests.get("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAuqmB-5ZTkrbLciwiobLuoSeaDqYWGDO4&latlng=" + latlng + "&sensor=false")
            string = loc.text
            json_obj = json.loads(string)
            if 'plus_code' in json_obj and 'compound_code' in json_obj['plus_code']:
                temp = json_obj['plus_code']['compound_code']
                area, country = get_area_and_country(temp)
            else:
                area = ""
                country = ""
            print(area + ", " + country)
            insert_row(i, spot["name"], spot["lat"], spot["lon"], area, country, mydb, mycursor)
            i += 1

def get_area_and_country(s):
    l = s.split(" ")
    area = ""
    country = ""
    country_index = 0
    for i in range(len(l)):
        if l[i].endswith(","):
            country_index = i
    for i in range(1, country_index+1):
        area += l[i] + " "
    for i in range(country_index+1, len(l)):
        country += l[i] + " "
    if area.endswith(", "):
        area = area[0:len(area)-2]
    if area.endswith(",") or area.endswith(" "):
        area = area[0:len(area)-1]
    return area, country


def insert_row(spot_id, spot, lat, long, area, country, db, cursor):
    sql = "INSERT INTO Spots (ID, Name, Latitude, Longitude, Area, Country) VALUES (%s, %s, %s, %s, %s, %s)"
    val = (spot_id, spot, lat, long, area, country)
    cursor.execute(sql, val)
    db.commit()



# def add_spots_to_db(spots, password):
#     mydb = mysql.connector.connect(
#         host="surfspots.cld2beuyqzv3.us-west-1.rds.amazonaws.com",
#         user="rootuser",
#         password=password,
#         database="sys"
#     )
#     mycursor = mydb.cursor()
#     for i in range(len(spots)):
#         insert_row(i, spots[i]["name"], spots[i]["lat"], spots[i]["lon"], spots[i]['area'], spots[i]['country'], mydb, mycursor)

def main():
    if len(sys.argv) < 2:
        print("You need to enter in the DB password")
        return
    db_pass = sys.argv[1]
    put_spots("-90", "-180", "90", "180", db_pass)



if __name__ == '__main__':
    main()