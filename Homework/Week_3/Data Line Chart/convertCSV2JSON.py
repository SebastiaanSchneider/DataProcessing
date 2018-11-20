#!/usr/bin/env python
# Name: Sebastiaan Schneider
# Student number: 10554769

import csv
import json


def preprocessing():
    movies = []
    try:
        with open("Section6-Homework-Data.csv", 'r') as reader:
            data = csv.DictReader(reader)
            for row in data:
                movie = row["Movie Title"]
                studio = row["Studio"]
                release = row["Release Date"]
                genre = row["Genre"]
                runtime = row["Runtime (min)"]
                budget = row["Budget ($mill)"]
                gross = row["Gross ($mill)"]
                adj_gross = row["Adjusted Gross ($mill)"]
                rating = row["IMDb Rating"]
                list = ([movie, studio, release, genre, runtime, budget, gross,
                        adj_gross, rating])
                movies.append(list)
        print("Succesfully pre-processed data!")
        return movies
    except ImportError or IOError:
        print("Failed to pre-process data")


def filter_write(movies):
    try:
        with open("data.csv", 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["Title", "Studio", "Release Date", "Genre",
                             "Runtime", "Budget", "Gross", "Adjusted Gross",
                             "IMDb Rating"])
            for movie in movies:
                writer.writerow(movie)
        print("Succesfully wrote data.csv!")
    except ImportError or IOError:
        print("Failed to write data.csv")


def json_write(movies):
    jsondict = {}
    for film in movies:
        jsondict[film[0]] = {"Studio": film[1], "Release Date": film[2],
                             "Genre": film[3], "Runtime": film[4],
                             "Budget": film[5], "Adjusted Gross": film[6],
                             "Gross": film[7], "IMDb Rating": film[8]}

    try:
        with open("data.json", 'w') as output:
            json.dump(jsondict, output)
        print("Succesfully wrote data.json!")
    except ImportError or IOError:
        print("Failed to write data.json")


if __name__ == "__main__":
    data = preprocessing()
    filter_write(data)
    json_write(data)
