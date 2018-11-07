#!/usr/bin/env python
# Name: Sebastiaan Schneider
# Student number: 10554769
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
import re
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'

def extract_movies(dom):
    # Creates an empty list that will hold the movies
    movies = []
    # Iterates over every film, getting the five details required
    for film in dom.find_all("div", class_="lister-item mode-advanced"):
        title = film.h3.a.string
        year = re.sub('\D', '', film.find("span", class_="lister-item-year text-muted unbold").string)
        runtime = film.find("span", class_="runtime").string.strip(" min")
        rating = film.strong.string
        ding = film.find('p', class_="sort-num_votes-visible").previous_sibling.previous_sibling
        if "Stars" in ding.text:
            actors = ding.select("a[href*=?ref_=adv_li_st]")
            for i in range(len(actors)):
                actors[i] = actors[i].string
            actors = ", ".join(actors)
        else:
            actors = "None"
        # The five details are made into a list
        list = [title, rating, year, actors, runtime]
        # The list is added to the list of movies and emptied again
        movies.append(list)
        list = []

    return movies


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    for i in movies:
        writer.writerow([i[0], i[1], i[2], i[3], i[4]])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
