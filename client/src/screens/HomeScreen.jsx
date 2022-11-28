import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import useEth from "../contexts/EthContext/useEth";
import ElectionCard from "../components/ElectionCard";
import PropTypes from "prop-types";

HomeScreen.propTypes = {
	color: PropTypes.string,
};

function HomeScreen({ color = "primary" }) {
	const {
		state: { contract, accounts },
	} = useEth();
	const [elections, setElections] = useState([]);
	const [isOwner, setIsOwner] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getRole = async () => {
			if (contract) {
				console.log("getting role");
				const isOwner = await contract.methods
					.isOwner()
					.call({ from: accounts[0] });
				setIsOwner(isOwner);
			}
		};
		const getElections = async () => {
			if (contract) {
				console.log("getting elections");
				const elections = await contract.methods
					.getElections()
					.call({ from: accounts[0] });
				setElections(elections);
				setLoading(false);
			}
		};
		getRole();
		getElections();
	}, [contract, accounts]);

	return (
		<Box>
			{loading ? (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "70vh",
						color: (theme) => theme.palette[color].darker,
					}}>
					<CircularProgress size={150} disableShrink />
				</Box>
			) : (
				<Box>
					<Grid container marginTop={7}>
						<Grid item sm={6}>
							<Typography
								variant="h4"
								sx={{
									color: (theme) =>
										theme.palette[color].darker,
								}}>
								{" "}
								All Elections
							</Typography>
						</Grid>
						{isOwner && (
							<Grid item sm={6}>
								<Box display="flex" justifyContent="flex-end">
									<Link
										to="/elections/new/"
										style={{ textDecoration: "none" }}>
										<Button
											variant="contained"
											size="large">
											Add Election
										</Button>
									</Link>
								</Box>
							</Grid>
						)}
					</Grid>

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
									<ElectionCard
										id={index}
										title={election}
										isOwner={isOwner}
									/>
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
