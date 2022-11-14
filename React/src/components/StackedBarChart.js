import React from "react";
const ReactHighcharts = require("react-highcharts");

// Refer the high charts "https://www.highcharts.com/demo/bar-basic" for more information

const StackedBarChart = (props) => {
    const config = {
        chart: {
            type: "column",
        },
        title: {
            text: props.title,
        },
        xAxis: {
            categories: ["Issues"],
        },
        yAxis: {
            min: 0,
            title: {
                text: "Count",
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: "bold",
                    color:
                        // theme
                        (ReactHighcharts.Highcharts.defaultOptions.title
                            .style &&
                            ReactHighcharts.Highcharts.defaultOptions.title
                                .style.color) ||
                        "gray",
                },
            },
        },
        legend: {
            align: "right",
            x: -30,
            verticalAlign: "top",
            y: 25,
            floating: true,
            backgroundColor:
                ReactHighcharts.Highcharts.defaultOptions.legend
                    .backgroundColor || "white",
            borderColor: "#CCC",
            borderWidth: 1,
            shadow: false,
        },
        tooltip: {
            headerFormat: "<b>{point.x}</b><br/>",
            pointFormat:
                "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
        },
        plotOptions: {
            column: {
                stacking: "normal",
                dataLabels: {
                    enabled: true,
                },
            },
        },
        series: [
            {
                name: "Created",
                data: props.totalCreated,
            },
            {
                name: "Closed",
                data: props.totalClosed,
            },
        ],
    };

    return (
        <div>
            <ReactHighcharts config={config}></ReactHighcharts>
        </div>
    );
};

export default StackedBarChart;
