import React from "react";
import Divider from "@mui/material/Divider";
import ForecastedImages from "./ForecastedImages";
import NoData from "./NoData";

const LSTM = (props) => {
    const { lstmData, repository } = props;
    if (lstmData && Object.keys(lstmData).length === 0) {
        return <NoData />;
    }
    return (
        <div style={{ marginTop: "10px" }}>
            {/* Rendering Timeseries Forecasting of Created Issues using Tensorflow and
                Keras LSTM */}
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Created Issues using Tensorflow and Keras LSTM based on past month"
                    }
                    repository={repository}
                    imagesCount={3}
                    title1={"Model Loss for Created Issues"}
                    url1={lstmData.createdAtImageUrls?.model_loss_image_url}
                    title2={"LSTM Generated Data for Created Issues"}
                    url2={lstmData.createdAtImageUrls?.lstm_generated_image_url}
                    title3={"All Issues Data for Created Issues"}
                    url3={lstmData.createdAtImageUrls?.all_issues_data_image}
                />
            </div>
            {/* Rendering Timeseries Forecasting of Closed Issues using Tensorflow and
                Keras LSTM  */}
            <Divider
                sx={{
                    borderBlockWidth: "3px",
                    borderBlockColor: "#FFA500",
                }}
            />
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Closed Issues using Tensorflow and Keras LSTM based on past month"
                    }
                    repository={repository}
                    imagesCount={3}
                    title1={"Model Loss for Closed Issues"}
                    url1={lstmData.closedAtImageUrls?.model_loss_image_url}
                    title2={"LSTM Generated Data for Closed Issues"}
                    url2={lstmData.closedAtImageUrls?.lstm_generated_image_url}
                    title3={"All Issues Data for Closed Issues"}
                    url3={lstmData.closedAtImageUrls?.all_issues_data_image}
                />
            </div>
            {/* Branches */}
            <Divider
                sx={{
                    borderBlockWidth: "3px",
                    borderBlockColor: "#FFA500",
                }}
            />
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Total Branches using Tensorflow and Keras LSTM based on past month"
                    }
                    repository={repository}
                    imagesCount={3}
                    title1={"Model Loss for Branches"}
                    url1={lstmData.branchesImageUrls?.model_loss_image_url}
                    title2={"LSTM Generated Data for Branches"}
                    url2={lstmData.branchesImageUrls?.lstm_generated_image_url}
                    title3={"All Issues Data for Branches"}
                    url3={lstmData.branchesImageUrls?.all_issues_data_image}
                />
            </div>
            {/* Commits */}
            <Divider
                sx={{
                    borderBlockWidth: "3px",
                    borderBlockColor: "#FFA500",
                }}
            />
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Total Commits using Tensorflow and Keras LSTM based on past month"
                    }
                    repository={repository}
                    imagesCount={3}
                    title1={"Model Loss for Commits"}
                    url1={lstmData.commitsImageUrls?.model_loss_image_url}
                    title2={"LSTM Generated Data for Commits"}
                    url2={lstmData.commitsImageUrls?.lstm_generated_image_url}
                    title3={"All Issues Data for Commits"}
                    url3={lstmData.commitsImageUrls?.all_issues_data_image}
                />
            </div>
            {/* Pulls Requests */}
            <Divider
                sx={{
                    borderBlockWidth: "3px",
                    borderBlockColor: "#FFA500",
                }}
            />
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Pull Requests using Tensorflow and Keras LSTM based on past month"
                    }
                    repository={repository}
                    imagesCount={3}
                    title1={"Model Loss for Pull Requests"}
                    url1={lstmData.pullRequestsImageUrls?.model_loss_image_url}
                    title2={"LSTM Generated Data for Pull Requests"}
                    url2={
                        lstmData.pullRequestsImageUrls?.lstm_generated_image_url
                    }
                    title3={"All Issues Data for Pull Requests"}
                    url3={lstmData.pullRequestsImageUrls?.all_issues_data_image}
                />
            </div>
            {/* Releases */}
            <Divider
                sx={{
                    borderBlockWidth: "3px",
                    borderBlockColor: "#FFA500",
                }}
            />
            <div>
                <ForecastedImages
                    header={
                        "Timeseries Forecasting of Releases using Tensorflow and Keras LSTM based on past month"
                    }
                    repository={repository}
                    imagesCount={3}
                    title1={"Model Loss for Releases"}
                    url1={lstmData.releasesImageUrls?.model_loss_image_url}
                    title2={"LSTM Generated Data for Releases"}
                    url2={lstmData.releasesImageUrls?.lstm_generated_image_url}
                    title3={"All Issues Data for Releases"}
                    url3={lstmData.releasesImageUrls?.all_issues_data_image}
                />
            </div>
        </div>
    );
};

export default LSTM;
