# Name: Sebastiaan Schneider
# Student number: 10554769

import csv
import json


def preprocessing():
    # Prepares the overal dictionary that will become the basis for the JSON
    dict = {}
    try:
        # Opens and reads the CSV file
        with open("data.csv", 'r') as input:
            data = csv.DictReader(input)
            # Iterates over every line in de file
            for i, row in enumerate(data):
                # Check if a line isn't empty
                if row:
                    line = {}
                    # Adds an item to the line's dict for every header
                    for header in list(data.fieldnames):
                        line[header] = row[header]
                    # Saves the line's dict to the overal dict
                    dict[i] = line
        print("Succesfully pre-processed data!")
        return dict
    except ImportError or IOError:
        print("Failed to pre-process data")


# Writes the dict to a JSON file
def json_write(data):
    try:
        with open("data.json", 'w') as output:
            json.dump(data, output)
        print("Succesfully wrote data.json!")
    except ImportError or IOError:
        print("Failed to write data.json")


if __name__ == "__main__":
    data = preprocessing()
    json_write(data)
