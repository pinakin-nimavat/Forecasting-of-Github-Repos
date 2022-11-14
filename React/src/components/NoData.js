import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";

const NoData = () => {
    return (
        <div>
            <Container fixed>
                <Box
                    sx={{
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography>Data Unavailable</Typography>
                </Box>
            </Container>
        </div>
    );
};

export default NoData;
