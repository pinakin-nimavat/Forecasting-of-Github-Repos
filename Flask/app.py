'''
Goal of Flask Microservice:
1. Flask will take the repository_name such as angular, angular-cli, material-design, D3 from the body of the api sent from React app and
   will utilize the GitHub API to fetch the created and closed issues. Additionally, it will also fetch the author_name and other
   information for the created and closed issues.
2. It will use group_by to group the data (created and closed issues) by month and will return the grouped data to client (i.e. React app).
3. It will then use the data obtained from the GitHub API (i.e Repository information from GitHub) and pass it as a input request in the
   POST body to LSTM microservice to predict and forecast the data.
4. The response obtained from LSTM microservice is also return back to client (i.e. React app).

Use Python/GitHub API to retrieve Issues/Repos information of the past 1 year for the following repositories:
- https: // github.com/angular/angular
- https: // github.com/angular/material
- https: // github.com/angular/angular-cli
- https: // github.com/d3/d3
'''
# Import all the required packages
import os
from flask import Flask, jsonify, request, make_response, Response
from flask_cors import CORS
import json
import dateutil.relativedelta
from dateutil import *
from datetime import date, datetime
import pandas as pd
import requests
import numpy as np
import github3

# Initilize flask app
app = Flask(__name__)
# Handles CORS (cross-origin resource sharing)
CORS(app)

GITHUB_URL = f"https://api.github.com/"
token = os.environ.get(
    'GITHUB_TOKEN', 'Your Github Token')

headers = {
    "Authorization": f'token {token}'
}
params = {
    "state": "open",
    "per_page": 100
}
github3_api = github3.login(token=token)

# Add response headers to accept all types of  requests


def build_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods",
                         "PUT, GET, POST, DELETE, OPTIONS")
    return response

# Modify response headers when returning to the origin


def build_actual_response(response):
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods",
                         "PUT, GET, POST, DELETE, OPTIONS")
    return response


def get_repo_details(repo_name):
    return repo_name.split("/")


def fetch_commits(repo_name):
    [owner, repo] = get_repo_details(repo_name)
    uritemplate = github3_api.repository(owner, repo)
    commits = (set(uritemplate.commits()))

    # url = f'{GITHUB_URL}repos/{repo_name}/commits?q=per_page=100'
    # commits = requests.get(url, headers=headers, params=params)
    # commits_json = commits.json()

    dict = {}

    for commit in commits:
        commit = commit.as_dict()
        if commit["commit"] is not None:
            if commit["author"]:
                if commit["commit"]["author"]["date"]:
                    if commit["author"]["id"]:
                        key = commit["commit"]["author"]["date"]
                        value = commit["author"]["id"]
                        dict[key] = value

    print("commits", len(dict))
    return dict


def fetch_pull_requests(repo_name):
    [owner, repo] = get_repo_details(repo_name)
    uritemplate = github3_api.repository(owner, repo)
    pull_requests = (set(uritemplate.pull_requests()))
    # url = f'{GITHUB_URL}repos/{repo_name}/pulls?q=per_page=100'
    # pulls = requests.get(url, headers=headers, params=params)
    # pulls_json = pulls.json()
    dict = {}
    for pull in pull_requests:
        pull = pull.as_dict()
        if pull["number"] is not None:
            dict[pull["created_at"]] = pull["number"]

    print("pull_requests", len(dict))
    return dict


def fetch_releases(repo_name):
    [owner, repo] = get_repo_details(repo_name)
    uritemplate = github3_api.repository(owner, repo)
    releases = (set(uritemplate.releases()))
    # url = f'{GITHUB_URL}repos/{repo_name}/releases?q=per_page=100'
    # releases = requests.get(url, headers=headers, params=params)
    # releases_json = releases.json()
    dict = {}
    for release in releases:
        release = release.as_dict()
        if release["author"]:
            if release["author"]["id"]:
                dict[release["created_at"]] = release["author"]["id"]

    print("releases", len(dict))
    return dict


def fetch_branches(repo_name):
    [owner, repo] = get_repo_details(repo_name)
    uritemplate = github3_api.repository(owner, repo)
    branches_api = (uritemplate.branches())

    # url = f'{GITHUB_URL}repos/{repo_name}/branches?q=per_page=100'
    # branches = requests.get(url, headers=headers, params=params)
    # branches_json = branches.json()
    dict = {}

    for branch in branches_api:
        branch = branch.as_dict()
        if branch["commit"]:
            data = requests.get(branch["commit"]["url"], headers=headers)
            data_json = data.json()
            if len(data_json) > 0:
                if data_json["commit"] and data_json["committer"]:
                    commit = data_json["commit"]
                    if commit["committer"]:
                        dict[commit["committer"]["date"]
                             ] = data_json["committer"]["id"]

    print("branches", len(dict))
    return dict


def fetch_contributors(repo_name):
    [owner, repo] = get_repo_details(repo_name)
    uritemplate = github3_api.repository(owner, repo)
    contributors = (set(uritemplate.contributors()))
    # url = f'{GITHUB_URL}repos/{repo_name}/contributors?q=per_page=100'
    # collaborators = requests.get(url, headers=headers, params=params)
    # collaborators_json = collaborators.json()
    dict = {}

    for contributor in contributors:
        contributor = contributor.as_dict()
        if contributor["login"]:
            dict[contributor["login"]] = contributor["contributions"]

    print("contributors", len(dict))
    return dict


'''
API route path is  "/api/forecast"
This API will accept only POST request
'''


@ app.route('/api/github', methods=['POST'])
def github():
    body = request.get_json()
    # Extract the choosen repositories from the request
    repo_name = body['repository']
    # Add your own GitHub Token to run it local

    repository_url = GITHUB_URL + "repos/" + repo_name
    # Fetch GitHub data from GitHub API
    repository = requests.get(repository_url, headers=headers)
    # Convert the data obtained from GitHub API to JSON format
    repository = repository.json()
    with open('contributor.json', 'w') as outfile:
        outfile.write(json.dumps(repository))
    today = date.today()

    issues_reponse = []
    # Iterating to get issues for every month for the past 12 months
    for i in range(24):
        last_month = today + dateutil.relativedelta.relativedelta(months=-1)
        types = 'type:issue'
        repo = 'repo:' + repo_name
        ranges = 'created:' + str(last_month) + '..' + str(today)
        per_page = "per_page=100"
        # Search query will create a query to fetch data for a given repository in a given time range
        search_query = types + ' ' + repo + ' ' + ranges + "&" + per_page

        # Append the search query to the GitHub API URL
        query_url = GITHUB_URL + "search/issues?q=" + search_query
        # requsets.get will fetch requested query_url from the GitHub API
        search_issues = requests.get(query_url, headers=headers, params=params)
        # Convert the data obtained from GitHub API to JSON format
        search_issues = search_issues.json()
        issues_items = []
        try:
            # Extract "items" from search issues
            issues_items = search_issues.get("items")
        except KeyError:
            error = {"error": "Data Not Available"}
            resp = Response(json.dumps(error), mimetype='application/json')
            resp.status_code = 500
            return resp

        if issues_items is None:
            continue

        for index in range(len(issues_items)):
            issue = issues_items[index]
            label_name = []
            data = {}
            current_issue = issue
            # Get issue number
            data['issue_number'] = current_issue["number"]
            # Get created date of issue
            data['created_at'] = current_issue["created_at"][0: 10]
            if current_issue["closed_at"] == None:
                if current_issue["updated_at"] != None:
                    data['closed_at'] = current_issue["updated_at"][0: 10]
                else:
                    data['closed_at'] = '1970-'+str(index+1)+'-03'
            else:
                # Get closed date of issue
                data['closed_at'] = current_issue["closed_at"][0: 10]
            for label in current_issue["labels"]:
                # Get label name of issue
                label_name.append(label["name"])
            data['labels'] = label_name
            # It gives state of issue like closed or open
            data['State'] = current_issue["state"]
            # Get Author of issue
            data['Author'] = current_issue["user"]["login"]
            issues_reponse.append(data)

        today = last_month

    repo = repo_name.split("/")[1]

    df = pd.DataFrame(issues_reponse)

    # Daily Created Issues
    daily_created = df.groupby(['created_at']).created_at.count()
    daily_created_issues = []
    for key in daily_created.keys():
        array = [datetime.strptime(key, '%Y-%m-%d').timestamp()
                 * 1000, int(daily_created[key])]
        daily_created_issues.append(array)

    # Daily Closed Issues
    daily_closed = df.groupby(['closed_at']).closed_at.count()
    daily_closed_issues = []
    for key in daily_closed.keys():
        array = [datetime.strptime(key, '%Y-%m-%d').timestamp()
                 * 1000, int(daily_closed[key])]
        daily_closed_issues.append(array)

    df_created_at = df.groupby(['created_at'], as_index=False).count()
    dataFrameCreated = df_created_at[['created_at', 'issue_number']]
    dataFrameCreated.columns = ['date', 'count']

    '''
    Monthly Created Issues
    Format the data by grouping the data by month
    '''
    created_at = df['created_at'].sort_values(ascending=True)
    month_issue_created = pd.to_datetime(
        pd.Series(created_at), format='%Y/%m/%d')
    month_issue_created.index = month_issue_created.dt.to_period('m')
    month_issue_created = month_issue_created.groupby(level=0).size()
    month_issue_created = month_issue_created.reindex(pd.period_range(
        month_issue_created.index.min(), month_issue_created.index.max(), freq='m'), fill_value=0)
    month_issue_created_dict = month_issue_created.to_dict()
    created_at_issues = []
    for key in month_issue_created_dict.keys():
        array = [str(key), month_issue_created_dict[key]]
        created_at_issues.append(array)

    '''
    Monthly Closed Issues
    Format the data by grouping the data by month
    '''

    closed_at = df['closed_at'].sort_values(ascending=True)
    month_issue_closed = pd.to_datetime(
        pd.Series(closed_at), errors='ignore', format='%Y/%m/%d')
    month_issue_closed.index = month_issue_closed.dt.to_period('m')
    month_issue_closed = month_issue_closed.groupby(level=0).size()
    month_issue_closed = month_issue_closed.reindex(pd.period_range(
        month_issue_closed.index.min(), month_issue_closed.index.max(), freq='m'), fill_value=0)
    month_issue_closed_dict = month_issue_closed.to_dict()
    closed_at_issues = []
    for key in month_issue_closed_dict.keys():
        array = [str(key), month_issue_closed_dict[key]]
        closed_at_issues.append(array)

        '''
    Weekly Closed Issues
    Format the data by grouping the data by month
    '''

    df["closed_at"] = pd.to_datetime(df["closed_at"])
    weekly_closed = df.groupby(pd.Grouper(key='closed_at', freq='W'))[
        'closed_at'].count()
    weekly_closed.index = weekly_closed.index.week
    closed_at_weekly_issues = []
    for index, value in weekly_closed.items():
        array = [str(index), int(value)]
        closed_at_weekly_issues.append(array)

    '''
        Total Created and Closed Issues
    '''
    total_created = int(df['created_at'].notnull().sum())
    total_closed = int(df['closed_at'].notnull().sum())

    '''
        1. Hit LSTM Microservice by passing issues_response as body
        2. LSTM Microservice will give a list of string containing image paths hosted on google cloud storage
        3. On recieving a valid response from LSTM Microservice, append the above json_response with the response from
            LSTM microservice
    '''

    # Update your Google cloud deployed LSTM app URL (NOTE: DO NOT REMOVE "/")
    # http://localhost:8080/ -> https://lstm-ms-5yjkp7q54q-uc.a.run.app/
    # http://localhost:8081/ -> https://fbprophet-ms-k3s4hvbhhq-uc.a.run.app/
    # http://localhost:8082/ -> https://stats-ms-olfsssvzsa-uc.a.run.app/
    LSTM_API_URL = "https://lstm-ms-5yjkp7q54q-uc.a.run.app/" + "api/lstm/forecast"
    PROPHET_API_URL = "https://fbprophet-ms-k3s4hvbhhq-uc.a.run.app/" + \
        "api/prophet/forecast"
    STATS_MODEL_API_URL = "https://stats-ms-olfsssvzsa-uc.a.run.app/" + \
        "api/stats-model/forecast"
    '''
    Trigger the LSTM microservice to forecasted the created issues
    The request body consists of created issues obtained from GitHub API in JSON format
    The response body consists of Google cloud storage path of the images generated by LSTM microservice
    '''

    '''
    Trigger the LSTM microservice to forecasted the closed issues
    The request body consists of closed issues obtained from GitHub API in JSON format
    The response body consists of Google cloud storage path of the images generated by LSTM microservice
    '''

    commits = fetch_commits(repo_name=repo_name)

    pull_requests = fetch_pull_requests(repo_name=repo_name)

    releases_response = {}
    releases = {}
    if (repo != "angular-google-maps"):
        releases = fetch_releases(repo_name=repo_name)

    branches = fetch_branches(repo_name=repo_name)

    # contributors = fetch_contributors(repo_name=repo_name)
    # contributors_body = {
    #     "contributors": contributors,
    #     "type": "contributors",
    #     "repo": repo
    # }
    # contributors_response = requests.post(f'{LSTM_API_URL}/contributors',
    #                                       json=contributors_body,
    #                                       headers={'content-type': 'application/json'})

    request_body = {
        "repo": repo,
        "created_at_issues": issues_reponse,
        "closed_at_issues": issues_reponse,
        "pull_requests": pull_requests,
        "commits": commits,
        "releases": releases,
        "branches": branches
    }

    if repo != "angular-google-maps":
        lstm_response = requests.post(LSTM_API_URL,
                                      json=request_body,
                                      headers={'content-type': 'application/json'})

        prophet_response = requests.post(PROPHET_API_URL,
                                         json=request_body,
                                         headers={'content-type': 'application/json'})

        stats_model_response = requests.post(STATS_MODEL_API_URL,
                                             json=request_body,
                                             headers={'content-type': 'application/json'})

        try:
            lstm_response = lstm_response.json()
        except:
            lstm_response = {}
            print("lstm error")
        try:
            prophet_response = prophet_response.json()
        except:
            prophet_response = {}
            print("prophet error")
        try:
            print(stats_model_response)
            stats_model_response = stats_model_response.json()
        except:
            stats_model_response = {}
            print("stats model error")

    '''
    Create the final response that consists of:
        1. GitHub repository data obtained from GitHub API
        2. Google cloud image urls of created and closed issues obtained from LSTM microservice
    '''
    json_response = {
        "gitHub": {
            "created": created_at_issues,
            "closed": closed_at_issues,
            "starCount": repository["stargazers_count"],
            "forkCount": repository["forks_count"],
            "dailyCreated": daily_created_issues,
            "dailyClosed": daily_closed_issues,
            "weeklyClosed": closed_at_weekly_issues,
            "totalCreated": total_created,
            "totalClosed": total_closed,
        },
        "lstm": {
            **lstm_response,
        },
        "fbProphet": {
            **prophet_response,
        },
        "statsModel": {
            **stats_model_response
        }
    }
    # Return the response back to client (React app)
    return jsonify(json_response)


# Run flask app server on port 5000
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
