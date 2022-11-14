import React from "react";
const ReactHighcharts = require("react-highcharts");

// Refer the high charts "https://www.highcharts.com/demo/bar-basic" for more information

const LineChart = (props) => {
    const config = {
        chart: {
            zoomType: "x",
        },
        title: {
            text: props.title,
        },
        subtitle: {
            text:
                document.ontouchstart === undefined
                    ? "Click and drag in the plot area to zoom in"
                    : "Pinch the chart to zoom in",
        },
        xAxis: {
            type: "datetime",
        },
        yAxis: {
            title: {
                text: "Issues",
            },
        },
        legend: {
            enabled: false,
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1,
                    },
                    stops: [
                        [0, ReactHighcharts.Highcharts.getOptions().colors[0]],
                        [
                            1,
                            ReactHighcharts.Highcharts.color(
                                ReactHighcharts.Highcharts.getOptions()
                                    .colors[0]
                            )
                                .setOpacity(0)
                                .get("rgba"),
                        ],
                    ],
                },
                marker: {
                    radius: 2,
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1,
                    },
                },
                threshold: null,
            },
        },

        series: [
            {
                type: "area",
                name: props.title,
                data: props.data,
            },
        ],
    };
    return (
        <div>
            <ReactHighcharts config={config}></ReactHighcharts>
        </div>
    );
};

export default LineChart;
