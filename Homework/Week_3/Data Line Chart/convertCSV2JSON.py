#!/usr/bin/env python
# Name: Sebastiaan Schneider
# Student number: 10554769

import csv
import json
import re


def preprocessing():
    # Prepare the overal dictionary that will become the basis for the JSON
    movies = {}
    try:
        # Open the CSV file and the the items in it. Only two of the items
        # being read here are saved
        with open("Section6-Homework-Data.csv", 'r') as reader:
            data = csv.DictReader(reader)
            for row in data:
                movie = row["Movie Title"]
                studio = row["Studio"]
                # Saves the year the movie was released in a usable format
                release = row["Release Date"][-2:]
                if int(release) < 20:
                    year = f"20{release}"
                else:
                    year = f"19{release}"
                genre = row["Genre"]
                runtime = row["Runtime (min)"]
                budget = row["Budget ($mill)"]
                gross = row["Gross ($mill)"]
                # Adjusts the gross to a number that is more practical in use
                adj_gross = float(re.sub('\D', '',
                                  row["Adjusted Gross ($mill)"])) / 10000
                rating = row["IMDb Rating"]
                # Checks if there are already movies from that year
                # in the dict and, if so, calculates the combined gross
                if year in movies:
                    movies[year] = movies[year] + adj_gross
                else:
                    movies[year] = adj_gross
        print("Succesfully pre-processed data!")
        return movies
    except ImportError or IOError:
        print("Failed to pre-process data")


# This was not used in this assignment, but in the previous one
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


# Writes the dict to a JSON file
def json_write(years):
    jsondict = years
    try:
        with open("data.json", 'w') as output:
            json.dump(jsondict, output)
        print("Succesfully wrote data.json!")
    except ImportError or IOError:
        print("Failed to write data.json")


# Runs the code
if __name__ == "__main__":
    data = preprocessing()
    print(data)
    # filter_write(data)
    json_write(data)
