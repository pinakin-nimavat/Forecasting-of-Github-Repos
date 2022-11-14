import React from "react";
import Typography from "@mui/material/Typography";

const ForecastedImages = (props) => {
    const { header, imagesCount, title1, title2, url1, url2, repoitory } =
        props;
    return (
        <>
            <Typography variant="h5" component="div" gutterBottom>
                {header}
            </Typography>
            <div>
                <Typography component="h4">{title1}</Typography>
                <img
                    src={url1}
                    style={{ maxWidth: "1200px" }}
                    key={`${repoitory}_${title1}`}
                    alt={title1}
                    loading="lazy"
                />
            </div>
            <div>
                <Typography component="h4">{title2}</Typography>
                <img
                    src={url2}
                    style={{ maxWidth: "1200px" }}
                    key={`${repoitory}_${title2}`}
                    alt={title2}
                    loading="lazy"
                />
            </div>
            {imagesCount === 3 && (
                <div>
                    <Typography component="h4">{props.title3}</Typography>
                    <img
                        src={props.url3}
                        style={{ maxWidth: "1200px" }}
                        key={`${props.repoitory}_${props.title3}`}
                        alt={props.title3}
                        loading="lazy"
                    />
                </div>
            )}
        </>
    );
};

export default ForecastedImages;
