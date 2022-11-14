import React from "react";
import LineChart from "./LineChart";
import StackedBarChart from "./StackedBarChart";
import BarCharts from "./BarCharts";

const GitHub = (props) => {
    const { githubData, repository } = props;
    return (
        <div>
            {/* Requirement 5 */}
            <LineChart
                data={githubData?.dailyCreated}
                title={`Created Issues for ${repository}`}
            />
            <LineChart
                data={githubData?.dailyClosed}
                title={`Closed Issues for ${repository}`}
            />
            {/* Render barchart component for a monthly created issues for a selected repositories*/}
            {/* Requirement 6 */}
            <BarCharts
                title={`Monthly Created Issues for ${repository} in last 1 year`}
                data={githubData?.created}
                yAxisText={"Issues Count"}
            />
            {/* Render barchart component for a monthly created issues for a selected repositories*/}
            {/* <BarCharts
                            title={`Monthly Closed Issues for ${repository} in last 1 year`}
                            data={githubData?.closed}
                            yAxisText={"Issues"}
                        /> */}
            {/* Requirement 7 */}
            <BarCharts
                title={`Stars count for ${repository}`}
                data={[["Star Count", githubData?.starCount]]}
                yAxisText={"Count"}
            />
            {/* Requirement 8 */}
            <BarCharts
                title={`Fork count for ${repository}`}
                data={[["Fork Count", githubData?.forkCount]]}
                yAxisText={"Count"}
            />
            {/* Requirement 9 */}
            <BarCharts
                title={`Weekly Closed Issues for ${repository}`}
                data={githubData?.weeklyClosed}
                yAxisText={"Issues Count"}
            />
            {/* Requirement 10 */}
            <StackedBarChart
                title={`Stacked Bar Chart for Opened and Closed Issues for ${repository}`}
                totalCreated={[githubData?.totalCreated]}
                totalClosed={[githubData?.totalClosed]}
            />
        </div>
    );
};

export default GitHub;
