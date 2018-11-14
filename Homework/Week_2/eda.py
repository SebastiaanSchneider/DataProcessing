#!/usr/bin/env python
# Name: Sebastiaan Schneider
# Student number: 10554769

import csv
import json
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

filter = "filter.csv"
countries = []
jsondict = {}
df = pd.DataFrame(pd.read_csv(filter))


# Reads and filters the data from the input file
def preprocessing():
    with open("input.csv", 'r') as reader:
        data = csv.DictReader(reader)

        # For every row, the information of interest is extracted
        for row in data:
            if row["Country"] == '':
                pass
            else:
                country = row["Country"].strip()
                region = row["Region"].strip(' ')

                # If the information isn't given, N/A is entered
                if row["Pop. Density (per sq. mi.)"] == "unknown":
                    density = "N/A"
                else:
                    density = (row["Pop. Density (per sq. mi.)"].
                               replace(',', '.'))
                if row["Infant mortality (per 1000 births)"] == '':
                    mortality = "N/A"
                else:
                    mortality = (row["Infant mortality (per 1000 births)"].
                                 replace(',', '.'))
                if row["GDP ($ per capita) dollars"] == "unknown" or row["GDP \
($ per capita) dollars"] == '':
                    gdp = "N/A"
                else:
                    gdp = (int(row["GDP ($ per capita) dollars"].
                           strip(" dollars")))
                # To prevent outliers, GDPs of more than 55500 are not kept
                if isinstance(gdp, int) and int(gdp) > 55500:
                    pass
                # The data is put in a list, which is put into the overal list
                else:
                    list = [country, region, density, mortality, gdp]
                    countries.append(list)


# Writes the filtered data into a csv file
def write_filter():
    with open(filter, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["Country", "Region", "Density", "Infant mortality",
                        "GDP"])
        for country in countries:
            writer.writerow(country)


# Creats a dict from the overal list, which is then put into a JSON file
def write_json():
    for country in countries:
        jsondict[country[0]] = {"Region": [country[1]],
                                "Pop. Density (per sq. mi.)": [country[2]],
                                "Infant mortality (per 1000 births)":
                                [country[3]],
                                "GDP ($ per capita) dollars": [country[4]]}
    with open("output.json", 'w') as output:
        json.dump(jsondict, output)


# Calculates the central tendency from the GDP data, and puts the GDP data into
# a histogram
def process_gdp():
    print(df["GDP"].mean())
    print(df["GDP"].median())
    print(df["GDP"].mode()[0])
    df["GDP"].plot.hist(25)
    plt.show()


# Calculates the five number summary from the Infant mortality data and creates
# a box plot from the data
def process_mortality():
    print(df["Infant mortality"].min())
    print(df["Infant mortality"].quantile(.25))
    print(df["Infant mortality"].median())
    print(df["Infant mortality"].quantile(.75))
    print(df["Infant mortality"].max())
    df["Infant mortality"].plot.box()
    plt.show()


# Creates a scatterplot by comparing the GDP and Infant mortality for every
# country
def comparison():
    x = df["GDP"]
    y = df["Infant mortality"]
    plt.scatter(x, y, alpha=0.5)
    plt.show()
# I attempted to use seaborn to make this plot, but kept getting errors for
# missing files, so I switched to matplotlib. I'd still like to know what went
# wrong here!
    # sns.set(style="darkgrid")
    # data = sns.load_dataset(filter)
    # ax = sns.relplot(x="GDP", y="Infant mortality", hue="Region", data=data)


# initiates the program
if __name__ == "__main__":
    preprocessing()
    write_filter()
    write_json()
    process_gdp()
    process_mortality()
    comparison()
