import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import HowToVoteIcon from "@mui/icons-material/HowToVote";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { LoadingButton } from "@mui/lab";

import Candidate from "../components/CandidateCard";

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
			setLoading(false);
		}
	};

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

	const getElectionState = async () => {
		if (contract) {
			const state = await contract.methods.getElectionState(id).call();
			setElectionState(parseInt(state));
		}
	};

	useEffect(() => {
		getElectionState();
		getVoter();
		checkVoted();
		// eslint-disable-next-line
	}, [contract]);

	const handleVoteChange = (event) => {
		setVote(event.target.value);
	};

	const handleVote = (event) => {
		event.preventDefault();
		voteCandidate(vote);
	};

	const handleClose = () => {
		// navigate("/elections");
		setOpen(false);
		setLoading(true);
		checkVoted();
		window.location.reload();
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
					{!hasVoted && isVoter && (
						<Box>
							<form onSubmit={handleVote}>
								<Grid
									container
									sx={{ mt: 0 }}
									spacing={5}
									justifyContent="center">
									<Grid item xs={12}>
										<Typography
											sx={{
												color: (theme) =>
													theme.palette[color].darker,
											}}
											align="center"
											variant="h6">
											{electionState === 0 &&
												"Please Wait... This election has not started yet."}
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
														{candidates.map(
															(candidate) => (
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
															),
														)}
													</RadioGroup>
												</FormControl>
											</Grid>

											<Grid
												item
												xs={12}
												mb={4}
												sx={{
													textAlign: "center",
												}}>
												<LoadingButton
													startIcon={
														<HowToVoteIcon />
													}
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
										</Box>
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
															<Box
																sx={{ mx: 2 }}
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
															</Box>
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
											"Election is in progress."}
										{electionState === 2 &&
											"Election has ended."}
									</Typography>
								</Grid>
								<Grid mt={4} item xs={12}>
									<Typography
										sx={{
											color: (theme) =>
												theme.palette[color].darker,
										}}
										align="center"
										variant="h6">
										{electionState === 1 &&
											"SEE LIVE RESULTS"}
										{electionState === 2 &&
											"FINAL ELECTION RESULT"}
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
