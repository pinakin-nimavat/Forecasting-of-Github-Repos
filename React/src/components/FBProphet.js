import React from "react";
import Divider from "@mui/material/Divider";
import ForecastedImages from "./ForecastedImages";
import NoData from "./NoData";

const FBProphet = (props) => {
    const { fbProphetData, repository } = props;

    if (fbProphetData && Object.keys(fbProphetData).length === 0) {
        return <NoData />;
    }

    return (
        <div style={{ marginTop: "10px" }}>
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Created Issues using FB Prophet based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Created Issues"}
                    url1={
                        fbProphetData.createdAtImageUrls
                            ?.seasonal_prophet_image_url
                    }
                    title2={"Forecast for Created Issues"}
                    url2={
                        fbProphetData.createdAtImageUrls
                            ?.forecast_prophet_image_url
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
                        "Timeseries Forecasting of Closed Issues using FB Prophet based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Closed Issues"}
                    url1={
                        fbProphetData.closedAtImageUrls
                            ?.seasonal_prophet_image_url
                    }
                    title2={"Forecast for Closed Issues"}
                    url2={
                        fbProphetData.closedAtImageUrls
                            ?.forecast_prophet_image_url
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
                        "Timeseries Forecasting of Commits using FB Prophet based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Commits"}
                    url1={
                        fbProphetData.commitsImageUrls
                            ?.seasonal_prophet_image_url
                    }
                    title2={"Forecast for Commits"}
                    url2={
                        fbProphetData.commitsImageUrls
                            ?.forecast_prophet_image_url
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
                        "Timeseries Forecasting of Pull Requests using FB Prophet based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Pull Requests"}
                    url1={
                        fbProphetData.pullRequestsImageUrls
                            ?.seasonal_prophet_image_url
                    }
                    title2={"Forecast for Pull Requests"}
                    url2={
                        fbProphetData.pullRequestsImageUrls
                            ?.forecast_prophet_image_url
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
                        "Timeseries Forecasting of Releases using FB Prophet based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Releases"}
                    url1={
                        fbProphetData.releasesImageUrls
                            ?.seasonal_prophet_image_url
                    }
                    title2={"Forecast for Releases"}
                    url2={
                        fbProphetData.releasesImageUrls
                            ?.forecast_prophet_image_url
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
                        "Timeseries Forecasting of Branches using FB Prophet based on past month"
                    }
                    repository={repository}
                    imagesCount={2}
                    title1={"Seasonality/Trends for Branches"}
                    url1={
                        fbProphetData.branchesImageUrls
                            ?.seasonal_prophet_image_url
                    }
                    title2={"Forecast for Branches"}
                    url2={
                        fbProphetData.branchesImageUrls
                            ?.forecast_prophet_image_url
                    }
                />
            </div>
        </div>
    );
};

export default FBProphet;
