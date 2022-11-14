/*
Goal of React:
  1. React will retrieve GitHub created and closed issues for a given repository and will display the bar-charts 
     of same using high-charts        
  2. It will also display the images of the forecasted data for the given GitHub repository and images are being retrieved from 
     Google Cloud storage
  3. React will make a fetch api call to flask microservice.
*/

// Import required libraries
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { ListItemButton } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
// Import custom components
import Loader from "./Loader";
import GitHub from "./GitHub";
import LSTM from "./LSTM";
import StatsModel from "./StatsModel";
import FBProphet from "./FBProphet";

const drawerWidth = 240;
// List of GitHub repositories
const repositories = [
    {
        key: "angular/angular",
        value: "Angular",
    },
    {
        key: "angular/angular-cli",
        value: "Angular-cli",
    },
    {
        key: "angular/material",
        value: "Angular Material",
    },
    {
        key: "d3/d3",
        value: "D3",
    },
    {
        key: "SebastianM/angular-google-maps",
        value: "Angular Google Maps",
    },
    {
        key: "facebook/react",
        value: "React",
    },
    {
        key: "tensorflow/tensorflow",
        value: "Tensorflow",
    },
    {
        key: "keras-team/keras",
        value: "Keras",
    },
    {
        key: "pallets/flask",
        value: "Flask",
    },
];

export default function Home() {
    /*
  The useState is a react hook which is special function that takes the initial 
  state as an argument and returns an array of two entries. 
  */
    /*
  setLoading is a function that sets loading to true when we trigger flask microservice
  If loading is true, we render a loader else render the Bar charts
  */
    const [loading, setLoading] = useState(false);
    /* 
  setRepository is a function that will update the user's selected repository such as Angular,
  Angular-cli, Material Design, and D3
  The repository "key" will be sent to flask microservice in a request body
  */
    const [repository, setRepository] = useState({
        key: "angular/angular",
        value: "Angular",
    });
    /*
  
  The first element is the initial state (i.e. githubRepoData) and the second one is a function 
  (i.e. setGithubData) which is used for updating the state.

  so, setGitHub data is a function that takes the response from the flask microservice 
  and updates the value of gitHubrepo data.
  */
    const [githubRepoData, setGithubData] = useState(undefined);
    // Updates the repository to newly selected repository
    const eventHandler = (repo) => {
        setRepository(repo);
    };

    // const [selectedTab, setSelectedTab] = useState(0);
    // const onTabChange = (event, newValue) => {
    //     setSelectedTab(newValue);
    // };

    /* 
  Fetch the data from flask microservice on Component load and on update of new repository.
  Everytime there is a change in a repository, useEffect will get triggered, useEffect inturn will trigger 
  the flask microservice 
  */
    React.useEffect(() => {
        // set loading to true to display loader
        setLoading(true);
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Append the repository key to request body
            body: JSON.stringify({ repository: repository.key }),
        };

        /*
    Fetching the GitHub details from flask microservice
    The route "/api/github" is served by Flask/App.py in the line 53
    @app.route('/api/github', methods=['POST'])
    Which is routed by setupProxy.js to the
    microservice target: "your_flask_gcloud_url"
    */
        fetch("/api/github", requestOptions)
            .then((res) => res.json())
            .then(
                // On successful response from flask microservice
                (result) => {
                    // On success set loading to false to display the contents of the resonse
                    setLoading(false);
                    // Set state on successfull response from the API
                    setGithubData(result);
                    // setSelectedTab(0);
                },
                // On failure from flask microservice
                (error) => {
                    // Set state on failure response from the API
                    console.log(error);
                    // On failure set loading to false to display the error message
                    setLoading(false);
                    setGithubData({});
                    // setSelectedTab(0);
                }
            );
    }, [repository]);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            {/* Application Header */}
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Timeseries Forecasting
                    </Typography>
                </Toolbar>
            </AppBar>
            {/* Left drawer of the application */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: "auto" }}>
                    <List>
                        {/* Iterate through the repositories list */}
                        {repositories.map((repo) => (
                            <ListItem
                                button
                                key={repo.key}
                                onClick={() => eventHandler(repo)}
                                disabled={
                                    loading && repo.value !== repository.value
                                }
                                disableGutters
                            >
                                <ListItemButton
                                    selected={repo.value === repository.value}
                                >
                                    <ListItemText primary={repo.value} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* Render loader component if loading is true else render charts and images */}
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <div
                            style={{
                                maxWidth: "1200px",
                                overflow: "hidden",
                                marginTop: "40px",
                            }}
                        >
                            {githubRepoData && (
                                <>
                                    <GitHub
                                        githubData={githubRepoData.gitHub}
                                        repository={repository.value}
                                    />
                                    <LSTM
                                        lstmData={githubRepoData.lstm}
                                        repository={repository.value}
                                    />
                                    <StatsModel
                                        statsModelData={
                                            githubRepoData.statsModel
                                        }
                                        repository={repository.value}
                                    />
                                    <FBProphet
                                        fbProphetData={githubRepoData.fbProphet}
                                        repository={repository.value}
                                    />
                                </>
                            )}
                        </div>
                    </>
                )}
            </Box>
        </Box>
    );
}
