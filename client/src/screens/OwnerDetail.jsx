import { useState, useEffect } from "react";

import Candidate from "../components/CandidateCard";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import LoadingButton from "@mui/lab/LoadingButton";

const OwnerDetail = ({
	id,
	candidates,
	contract,
	currentAccount,
	color = "primary",
}) => {
	const [electionState, setElectionState] = useState(null);
	const [loading, setLoading] = useState(true);
	const [disabledAgree, setDisabledAgree] = useState(false);
	const [buttonLabel, setButtonLabel] = useState("Agree");
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const getElectionState = async () => {
			if (contract) {
				const state = await contract.methods
					.getElectionState(id)
					.call();
				setElectionState(parseInt(state));
				setLoading(false);
			}
		};
		getElectionState();
	}, [contract, open, id]);

	const handleEnd = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleAgree = async () => {
		setDisabledAgree(true);
		setButtonLabel("Please Wait...");
		if (electionState === 0) {
			try {
				if (contract) {
					await contract.methods
						.startElection(id)
						.send({ from: currentAccount });
				}
			} catch (error) {
				console.error("Error:", error);
			}
		} else if (electionState === 1) {
			try {
				if (contract) {
					await contract.methods
						.endElection(id)
						.send({ from: currentAccount });
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
		setDisabledAgree(false);
		setOpen(false);
		setButtonLabel("Agree");
	};

	return (
		<Box>
			{loading ? (
				<Backdrop
					sx={{
						color: "#fff",
						zIndex: (theme) => theme.zIndex.drawer + 1,
					}}
					open>
					<CircularProgress color="inherit" />
				</Backdrop>
			) : (
				<Box>
					<Grid container sx={{ mt: 0 }} spacing={4}>
						<Grid item xs={12}>
							<Typography
								sx={{
									color: (theme) =>
										theme.palette[color].darker,
								}}
								align="center"
								variant="h6">
								ELECTION STATUS :{" "}
								{electionState === 0 &&
									"This election has not started."}
								{electionState === 1 &&
									"This election is in progress. Results will be available after you end it."}
								{electionState === 2 &&
									"This election has ended."}
							</Typography>
						</Grid>
						{electionState !== 2 && (
							<Grid item xs={12} sx={{ display: "flex" }}>
								<Button
									variant="contained"
									sx={{ width: "40%", margin: "auto" }}
									onClick={handleEnd}>
									{electionState === 0 && "Start Election"}
									{electionState === 1 && "End Election"}
								</Button>
							</Grid>
						)}
						{electionState === 2 && (
							<Grid mt={4} item xs={12}>
								<Typography
									sx={{
										color: (theme) =>
											theme.palette[color].darker,
									}}
									align="center"
									variant="h6">
									FINAL ELECTION RESULT
								</Typography>
							</Grid>
						)}

						{electionState === 2 && (
							<Grid
								item
								xs={12}
								sx={{
									overflowY: "hidden",
									overflowX: "auto",
									display: "flex",
									width: "98vw",
									justifyContent: "center",
								}}>
								<Grid
									mb={4}
									container
									spacing={2}
									alignItems="center"
									justifyContent="center">
									{candidates &&
										candidates.map((candidate) => (
											<Grid item key={candidate.id}>
												<Candidate
													id={candidate.id}
													name={candidate.name}
													voteCount={
														candidate.voteCount
													}
													imageURL={
														candidate.imageURL
													}
												/>
											</Grid>
										))}
								</Grid>
							</Grid>
						)}
					</Grid>

					<Dialog
						open={open}
						onClose={handleClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description">
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								{electionState === 0 &&
									"Are you sure you want to start this election?"}
								{electionState === 1 &&
									"Are you sure you want to end the election? This action cannot be reversed."}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							{!disabledAgree && (
								<Button
									color="error"
									startIcon={<ThumbDownIcon />}
									onClick={handleClose}>
									Disagree
								</Button>
							)}
							<LoadingButton
								loadingPosition="start"
								loading={disabledAgree}
								startIcon={<ThumbUpIcon />}
								disabled={disabledAgree}
								onClick={handleAgree}
								autoFocus>
								{buttonLabel}
							</LoadingButton>
						</DialogActions>
					</Dialog>
				</Box>
			)}
		</Box>
	);
};

export default OwnerDetail;
