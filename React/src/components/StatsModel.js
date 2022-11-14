import React from "react";
import Divider from "@mui/material/Divider";
import ForecastedImages from "./ForecastedImages";
import NoData from "./NoData";

const StatsModel = (props) => {
    const { statsModelData, repository } = props;

    if (statsModelData && Object.keys(statsModelData).length === 0) {
        return <NoData />;
    }

    return (
        <div style={{ marginTop: "10px" }}>
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Created Issues using StatsModel based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Created Issues"}
                    url1={
                        statsModelData.createdAtImageUrls
                            ?.seasonal_stats_model_image_url
                    }
                    title2={"Forecast for Created Issues"}
                    url2={
                        statsModelData.createdAtImageUrls
                            ?.forecast_stats_model_image_url
                    }
                />
            </div>
            <Divider
                sx={{
                    borderBlockWidth: "3px",
                    borderBlockColor: "#FFA500",
                }}
            />
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Closed Issues using StatsModel based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Closed Issues"}
                    url1={
                        statsModelData.closedAtImageUrls
                            ?.seasonal_stats_model_image_url
                    }
                    title2={"Forecast for Closed Issues"}
                    url2={
                        statsModelData.closedAtImageUrls
                            ?.forecast_stats_model_image_url
                    }
                />
            </div>
            <Divider
                sx={{
                    borderBlockWidth: "3px",
                    borderBlockColor: "#FFA500",
                }}
            />
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Commits using StatsModel based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Commits"}
                    url1={
                        statsModelData.commitsImageUrls
                            ?.seasonal_stats_model_image_url
                    }
                    title2={"Forecast for Commits"}
                    url2={
                        statsModelData.commitsImageUrls
                            ?.forecast_stats_model_image_url
                    }
                />
            </div>
            <Divider
                sx={{
                    borderBlockWidth: "3px",
                    borderBlockColor: "#FFA500",
                }}
            />
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Pull Requests using StatsModel based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Pull Requests"}
                    url1={
                        statsModelData.pullRequestsImageUrls
                            ?.seasonal_stats_model_image_url
                    }
                    title2={"Forecast for Pull Requests"}
                    url2={
                        statsModelData.pullRequestsImageUrls
                            ?.forecast_stats_model_image_url
                    }
                />
            </div>
            <Divider
                sx={{
                    borderBlockWidth: "3px",
                    borderBlockColor: "#FFA500",
                }}
            />
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Releases using StatsModel based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Releases"}
                    url1={
                        statsModelData.releasesImageUrls
                            ?.seasonal_stats_model_image_url
                    }
                    title2={"Forecast for Releases"}
                    url2={
                        statsModelData.releasesImageUrls
                            ?.forecast_stats_model_image_url
                    }
                />
            </div>
            <Divider
                sx={{
                    borderBlockWidth: "3px",
                    borderBlockColor: "#FFA500",
                }}
            />
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Branches using StatsModel based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Branches"}
                    url1={
                        statsModelData.branchesImageUrls
                            ?.seasonal_stats_model_image_url
                    }
                    title2={"Forecast for Branches"}
                    url2={
                        statsModelData.branchesImageUrls
                            ?.forecast_stats_model_image_url
                    }
                />
            </div>
        </div>
    );
};

export default StatsModel;
