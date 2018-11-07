#!/usr/bin/env python
# Name: Sebastiaan Schneider
# Student number: 10554769
"""
This script visualizes data obtained from rating .csv reader
"""

import csv
import matplotlib.pyplot as plt
import numpy as np

# Global constants for the input reader, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}
with open(INPUT_CSV, 'r') as reader:
    # Makes the csv file readable
    read = csv.DictReader(reader)
    # Iterates over every line, saving the year and rating from every film
    for line in read:
        data_dict[line["Year"]].append(float(line["Rating"]))
# Saves the average rating for every year
rating = [sum(data_dict[key]) / len(data_dict[key]) for key in data_dict]
# Since the average rating for a year is a very minimal amount of information,
# I added a bar for the amount of films from a specific year that made it into
# the top 50, giving the rating more legitimacy.
frequency = [len(data_dict[key]) for key in data_dict]

# Bar plot adapted from https://matplotlib.org/examples/api/barchart_demo.html
# Makes a list of 10 numbers, to arrange the bars by
n = len(data_dict)
ind = np.arange(n)
width = 0.4
fig, ax = plt.subplots()

# Creates the bars
bar1 = ax.bar(ind, rating, width, color='r')
bar2 = ax.bar(ind + width, frequency, width, color='b')

# Definces some details about the graph
ax.set_title("50 highest rated films on IMDB, sorted by year")
plt.xlabel("Years")
plt.ylabel("Average rating/Frequency")
ax.set_ylim(0, 11.5)
ax.set_yticks(ind + 1)
ax.set_xticks(ind + width / 2)
ax.set_xticklabels(sorted(data_dict))
ax.legend((bar1[0], bar2[0]), ('Average rating', 'Frequency'))


# Adds a numbber above every bar, to make it more readable
def autolabel(bars):
    """
    Attach a text label above each bar displaying its height
    """
    for bar in bars:
        height = bar.get_height()
        if isinstance(height, float):
            ax.text(bar.get_x() + bar.get_width()/2., height + .16,
                    '%.2f' % float(height),
                    ha='center', va='bottom')
        else:
            ax.text(bar.get_x() + bar.get_width()/2., height + .16,
                    '%d' % int(height),
                    ha='center', va='bottom')


# Runs the labeling function on the bars
autolabel(bar1)
autolabel(bar2)


if __name__ == "__main__":
    plt.show()
