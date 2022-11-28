import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { LoadingButton } from "@mui/lab";

import Candidate from "../components/CandidateCard";

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

	const getElectionState = async () => {
		if (contract) {
			const state = await contract.methods.getElectionState(id).call();
			setElectionState(parseInt(state));
			setLoading(false);
		}
	};

	useEffect(() => {
		getElectionState();
		// eslint-disable-next-line
	}, [contract]);

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
					getElectionState();
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
					getElectionState();
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
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "80vh",
					}}>
					Loading...
				</Box>
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
									"Election has not started."}
								{electionState === 1 &&
									"Election is in progress."}
								{electionState === 2 && "Election has ended."}
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

						<Grid mt={4} item xs={12}>
							<Typography
								sx={{
									color: (theme) =>
										theme.palette[color].darker,
								}}
								align="center"
								variant="h6">
								{electionState === 1 && "SEE LIVE RESULTS"}
								{electionState === 2 && "FINAL ELECTION RESULT"}
							</Typography>
						</Grid>

						{electionState > 0 && (
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
