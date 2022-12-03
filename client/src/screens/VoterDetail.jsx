import { useEffect, useState } from "react";

import Candidate from "../components/CandidateCard";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

import HowToVoteIcon from "@mui/icons-material/HowToVote";

import LoadingButton from "@mui/lab/LoadingButton";

const VoterDetail = ({
	id,
	name,
	candidates,
	contract,
	currentAccount,
	color = "primary",
}) => {
	const [electionState, setElectionState] = useState(null);
	const [vote, setVote] = useState(null);
	const [isVoter, setIsVoter] = useState(null);
	const [hasVoted, setHasVoted] = useState(null);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [buttonLabel, setButtonLabel] = useState("VOTE");

	const voteCandidate = async (candidate) => {
		setButtonLabel("Please wait...");
		setDisabled(true);
		try {
			if (contract) {
				await contract.methods
					.vote(id, candidate)
					.send({ from: currentAccount });
				setOpen(true);
			}
		} catch (error) {
			console.error("Error:", error);
		}
		setButtonLabel("VOTE");
		setDisabled(false);
	};

	useEffect(() => {
		const getVoter = async () => {
			if (contract) {
				const voter = await contract.methods
					.isEligible(id)
					.call({ from: currentAccount });
				setIsVoter(voter);
			}
		};

		const checkVoted = async () => {
			if (contract) {
				const voted = await contract.methods
					.hasVoted(id)
					.call({ from: currentAccount });
				setHasVoted(voted);
			}
		};
		const getElectionState = async () => {
			if (contract) {
				const state = await contract.methods
					.getElectionState(id)
					.call();
				setElectionState(parseInt(state));
				setLoading(false);
			}
		};
		getVoter();
		checkVoted();
		getElectionState();
	}, [contract, id, currentAccount, open]);

	const handleVoteChange = (event) => {
		setVote(event.target.value);
	};

	const handleVote = (event) => {
		event.preventDefault();
		voteCandidate(vote);
	};

	const handleClose = () => {
		setOpen(false);
		setLoading(true);
	};

	return (
		<Box>
			<Backdrop
				sx={{
					color: "#fff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={disabled}>
				<CircularProgress color="inherit" />
			</Backdrop>
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
					{!hasVoted && isVoter && (
						<Box>
							<form onSubmit={handleVote}>
								<Grid
									container
									sx={{ mt: 0 }}
									spacing={5}
									justifyContent="center">
									<Grid item xs={12} marginBottom={4}>
										<Typography
											sx={{
												color: (theme) =>
													theme.palette[color].darker,
											}}
											align="center"
											variant="h6">
											{electionState === 0 &&
												"Please Wait... The owner of this election has not started it yet."}
											{electionState === 1 &&
												"PLEASE PLACE YOUR VOTE"}
											{electionState === 2 &&
												"The election has ended and you did not vote. See the results below."}
										</Typography>
									</Grid>
									{electionState === 1 && (
										<Box>
											<Grid item xs={12}>
												<FormControl>
													<RadioGroup
														row
														sx={{
															overflowY: "hidden",
															overflowX: "auto",
															display: "flex",
															width: "98vw",
															justifyContent:
																"center",
														}}
														value={vote}
														onChange={
															handleVoteChange
														}>
														<Grid
															mb={4}
															container
															spacing={2}
															alignItems="center"
															justifyContent="center">
															{candidates.map(
																(candidate) => (
																	<Grid
																		item
																		key={
																			candidate.id
																		}>
																		<FormControlLabel
																			key={
																				candidate.id
																			}
																			labelPlacement="top"
																			control={
																				<Radio />
																			}
																			value={
																				candidate.id
																			}
																			label={
																				<Candidate
																					id={
																						candidate.id
																					}
																					name={
																						candidate.name
																					}
																					imageURL={
																						candidate.imageURL
																					}
																				/>
																			}
																		/>
																	</Grid>
																),
															)}
														</Grid>
													</RadioGroup>
												</FormControl>
											</Grid>
										</Box>
									)}

									{electionState === 1 && (
										<Grid
											item
											xs={12}
											mb={4}
											sx={{
												textAlign: "center",
											}}>
											<LoadingButton
												startIcon={<HowToVoteIcon />}
												loadingPosition="start"
												color="info"
												size="large"
												loading={disabled}
												disabled={disabled}
												type="submit"
												variant="contained"
												sx={{ minWidth: "200px" }}>
												{buttonLabel}
											</LoadingButton>
										</Grid>
									)}

									{electionState === 2 && (
										<Grid mt={4} item xs={12}>
											<Typography
												sx={{
													color: (theme) =>
														theme.palette[color]
															.darker,
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
													candidates.map(
														(candidate) => (
															<Grid
																item
																key={
																	candidate.id
																}>
																<Candidate
																	id={
																		candidate.id
																	}
																	name={
																		candidate.name
																	}
																	voteCount={
																		candidate.voteCount
																	}
																	imageURL={
																		candidate.imageURL
																	}
																/>
															</Grid>
														),
													)}
											</Grid>
										</Grid>
									)}
								</Grid>
							</form>
						</Box>
					)}
					{hasVoted && (
						<Box>
							<Grid container sx={{ mt: 0 }} spacing={4}>
								<Grid item xs={12}>
									<Typography
										sx={{
											color: (theme) =>
												theme.palette[color].darker,
										}}
										align="center"
										variant="h4">
										{name}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography
										sx={{
											color: (theme) =>
												theme.palette[color].darker,
										}}
										align="center"
										variant="h6">
										ELECTION STATUS :{" "}
										{electionState === 1 &&
											"Election is in progress. You have already placed your vote for this election."}
										{electionState === 2 &&
											"Election has ended."}
									</Typography>
									<Typography
										sx={{
											color: (theme) =>
												theme.palette[color].darker,
										}}
										align="center"
										variant="h6">
										{electionState === 1 &&
											"The results will be available when the owner ends the election."}
									</Typography>
								</Grid>
								{electionState === 2 && (
									<Grid container sx={{ mt: 0 }} spacing={4}>
										<Grid mt={4} item xs={12}>
											<Typography
												sx={{
													color: (theme) =>
														theme.palette[color]
															.darker,
												}}
												align="center"
												variant="h6">
												FINAL ELECTION RESULT
											</Typography>
										</Grid>
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
													candidates.map(
														(candidate) => (
															<Grid
																item
																key={
																	candidate.id
																}>
																<Candidate
																	id={
																		candidate.id
																	}
																	name={
																		candidate.name
																	}
																	voteCount={
																		candidate.voteCount
																	}
																	imageURL={
																		candidate.imageURL
																	}
																/>
															</Grid>
														),
													)}
											</Grid>
										</Grid>
									</Grid>
								)}
							</Grid>
						</Box>
					)}
					{!isVoter && (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								height: "80vh",
							}}>
							You are not eligible to participate in this
							election.
						</Box>
					)}
				</Box>
			)}

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Vote placed succesfully
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>OK</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default VoterDetail;
