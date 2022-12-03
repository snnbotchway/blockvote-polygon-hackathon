import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useEth from "../contexts/EthContext/useEth";
import ElectionCard from "../components/ElectionCard";
import PropTypes from "prop-types";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

HomeScreen.propTypes = {
	color: PropTypes.string,
};

function HomeScreen({ color = "primary" }) {
	const {
		state: { contract, accounts },
	} = useEth();
	const [elections, setElections] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getElections = async () => {
			if (contract) {
				const elections = await contract.methods
					.getElections()
					.call({ from: accounts[0] });
				setElections(elections);
				setLoading(false);
			}
		};
		getElections();
	}, [contract, accounts]);

	return (
		<Box>
			{loading ? (
				<div style={{ margin: 100, textAlign: "center" }}>
					<Backdrop
						open={true}
						sx={{
							color: "#fff",
							zIndex: (theme) => theme.zIndex.drawer + 1,
						}}>
						<div>
							<br />
							<CircularProgress color="inherit" />
							<br />
							{!contract && (
								<p>
									Please ensure that metamask is unlocked and
									Polygon's Mumbai testnet is selected...
								</p>
							)}
						</div>
					</Backdrop>
				</div>
			) : (
				<Box>
					<Stack
						marginTop={5}
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						spacing={3}>
						<Box>
							<Typography
								variant="h4"
								sx={{
									color: (theme) =>
										theme.palette[color].darker,
								}}>
								{" "}
								All Elections
							</Typography>
						</Box>
						<Box>
							<Link
								to="/elections/new/"
								style={{ textDecoration: "none" }}>
								<Button variant="contained" size="large">
									Add Election
								</Button>
							</Link>
						</Box>
					</Stack>

					{elections.length === 0 && (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								height: "70vh",
								color: (theme) => theme.palette[color].darker,
							}}>
							There are no elections to display right now.
						</Box>
					)}

					{elections.length > 0 && (
						<Grid container my={4} spacing={2} mb={4}>
							{elections.map((election, index) => (
								<Grid
									key={index}
									item
									xs={12}
									sm={6}
									md={6}
									lg={6}
									xl={6}>
									<ElectionCard id={index} title={election} />
								</Grid>
							))}
						</Grid>
					)}
				</Box>
			)}
		</Box>
	);
}

export default HomeScreen;
