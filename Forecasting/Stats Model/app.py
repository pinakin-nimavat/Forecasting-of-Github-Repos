from flask import Flask, jsonify, request, make_response
import os
from dateutil import *
from datetime import timedelta
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import time
from flask_cors import CORS

from google.cloud import storage

# Statsmodel related packages
import statsmodels
import statsmodels.api as sm
import statsmodels.formula.api as smf
from statsmodels.tsa.seasonal import seasonal_decompose

# Initilize flask app
app = Flask(__name__)
# Handles CORS (cross-origin resource sharing)
CORS(app)
# Initlize Google cloud storage client
client = storage.Client()

# DO NOT DELETE "static/images" FOLDER as it is used to store figures/images generated by matplotlib
LOCAL_IMAGE_PATH = "static/images/"

# Add your unique Bucket Name if you want to run it local
BUCKET_NAME = os.environ.get(
    'BUCKET_NAME', 'BUCKET_NAME')

# Add response headers to accept all types of  requests


def build_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods",
                         "PUT, GET, POST, DELETE, OPTIONS")
    return response

#  Modify response headers when returning to the origin


def build_actual_response(response):
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods",
                         "PUT, GET, POST, DELETE, OPTIONS")
    return response


def upload_images(SEASONAL_IMAGE_NAME, FORECAST_IMAGE_NAME):
    # Uploads an images into the google cloud storage bucket
    bucket = client.get_bucket(BUCKET_NAME)
    new_blob = bucket.blob(SEASONAL_IMAGE_NAME)
    new_blob.upload_from_filename(
        filename=LOCAL_IMAGE_PATH + SEASONAL_IMAGE_NAME)
    new_blob = bucket.blob(FORECAST_IMAGE_NAME)
    new_blob.upload_from_filename(
        filename=LOCAL_IMAGE_PATH + FORECAST_IMAGE_NAME)

    [os.remove(f'{LOCAL_IMAGE_PATH}{file}') for file in os.listdir(
        f'{LOCAL_IMAGE_PATH}') if file.endswith('.png')]


def generate_url(type, repo_name):
    BASE_IMAGE_PATH = os.environ.get(
        'BASE_IMAGE_PATH', 'BASE_IMAGE_PATH')

    SEASONAL_IMAGE_NAME = "seasonal_image_stats_model_" + type + \
        "_" + repo_name + ".png"
    SEASONAL_IMAGE_URL = BASE_IMAGE_PATH + SEASONAL_IMAGE_NAME

    FORECAST_IMAGE_NAME = "forecast_image_stats_model_" + \
        type + "_" + repo_name + ".png"
    FORECAST_IMAGE_URL = BASE_IMAGE_PATH + FORECAST_IMAGE_NAME

    return [
        SEASONAL_IMAGE_NAME,
        SEASONAL_IMAGE_URL,
        FORECAST_IMAGE_NAME,
        FORECAST_IMAGE_URL
    ]


def perform_forecasting(df, repo_name, type):
    [
        SEASONAL_IMAGE_NAME,
        SEASONAL_IMAGE_URL,
        FORECAST_IMAGE_NAME,
        FORECAST_IMAGE_URL
    ] = generate_url(type, repo_name)

    df.dropna()
    df.set_index('y')

    predict = sm.tsa.seasonal_decompose(df.index, period=15)
    figure = predict.plot()
    figure.set_size_inches(15, 8)
    figure.savefig(LOCAL_IMAGE_PATH + SEASONAL_IMAGE_NAME, dpi=300)

    df2 = df
    model = sm.tsa.ARIMA(df2['y'].iloc[1:], order=(1, 0, 0))
    results = model.fit()
    df2['forecast'] = results.fittedvalues
    df2[['y', 'forecast']].plot(figsize=(16, 12))
    plt.savefig(LOCAL_IMAGE_PATH + FORECAST_IMAGE_NAME, dpi=300)

    upload_images(SEASONAL_IMAGE_NAME, FORECAST_IMAGE_NAME)

    # Construct the response
    json_response = {
        "seasonal_stats_model_image_url": SEASONAL_IMAGE_URL,
        "forecast_stats_model_image_url": FORECAST_IMAGE_URL
    }

    return json_response


@app.route('/api/stats-model/forecast', methods=['POST'])
def forecast():
    body = request.get_json()
    created_at_issues = body["created_at_issues"]
    closed_at_issues = body["closed_at_issues"]
    pull_requests = body["pull_requests"]
    commits = body["commits"]
    releases = body["releases"]
    branches = body["branches"]
    repo_name = body["repo"]

    # Created At
    type = "created_at"
    data_frame = pd.DataFrame(created_at_issues)
    df1 = data_frame.groupby([type], as_index=False).count()
    df = df1[[type, 'issue_number']]
    df.columns = ['ds', 'y']
    created_at_response = perform_forecasting(df, repo_name, type)

    # Closed At
    type = "closed_at"
    data_frame = pd.DataFrame(created_at_issues)
    df1 = data_frame.groupby([type], as_index=False).count()
    df = df1[[type, 'issue_number']]
    df.columns = ['ds', 'y']
    closed_at_response = perform_forecasting(df, repo_name, type)

    # Pull Requests
    type = "pull_requests"
    df = pd.DataFrame(list(pull_requests.items()), columns=["ds", "y"])
    df["ds"] = pd.to_datetime(df["ds"])
    df["ds"] = pd.Series([val.date() for val in df["ds"]])
    pull_requests_response = perform_forecasting(df, repo_name, type)

    # Commits
    type = "commits"
    df = pd.DataFrame(list(commits.items()), columns=["ds", "y"])
    df["ds"] = pd.to_datetime(df["ds"])
    df["ds"] = pd.Series([val.date() for val in df["ds"]])
    commits_response = perform_forecasting(df, repo_name, type)

    # Releases
    type = "releases"
    df = pd.DataFrame(list(releases.items()), columns=["ds", "y"])
    df["ds"] = pd.to_datetime(df["ds"])
    df["ds"] = pd.Series([val.date() for val in df["ds"]])
    releases_response = perform_forecasting(df, repo_name, type)

    # Branches
    type = "branches"
    df = pd.DataFrame(list(branches.items()), columns=["ds", "y"])
    df["ds"] = pd.to_datetime(df["ds"])
    df["ds"] = pd.Series([val.date() for val in df["ds"]])
    branches_response = perform_forecasting(df, repo_name, type)

    json_response = {
        "createdAtImageUrls": {
            **created_at_response
        },
        "closedAtImageUrls": {
            **closed_at_response
        },
        "pullRequestsImageUrls": {
            **pull_requests_response
        },
        "commitsImageUrls": {
            **commits_response
        },
        "releasesImageUrls": {
            **releases_response
        },
        "branchesImageUrls": {
            **branches_response
        }
    }
    return jsonify(json_response)


    # Run LSTM app server on port 8080
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8082)
