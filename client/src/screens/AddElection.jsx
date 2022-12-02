import { useState, useEffect } from "react";

import useEth from "../contexts/EthContext/useEth";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import LoadingButton from "@mui/lab/LoadingButton";

export default function AddElection({ color = "primary" }) {
	const {
		state: { contract, accounts },
	} = useEth();
	const [name, setName] = useState("");
	const [candidates, setCandidates] = useState([]);
	const [candidatesImageURLs, setCandidatesImageURLs] = useState([]);
	const [voters, setVoters] = useState();

	const [open1, setOpen1] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [buttonLabel, setButtonLabel] = useState("Add Election");
	const [inputFields, setInputFields] = useState([
		{ candidateName: "", candidateImageURL: "" },
	]);

	const handleForm = async (event) => {
		event.preventDefault();
		try {
			setSubmitting(true);
			setButtonLabel("Adding Election...");
			let names = candidates;
			let urls = candidatesImageURLs;

			if (names.length !== urls.length) {
				const message = "Number of candidates and images do not match";
				const errorMessage = { code: 400, message: message };
				throw errorMessage;
			}

			if (names.length === 1) {
				names.push("Disapprove Candidate");
				urls.push(
					"https://www.m35design.co.uk/wp-content/uploads/2017/07/thumbs-down-bad-review.png",
				);
			}
			let splittedVoters = voters.split("\n").filter((e) => e);
			splittedVoters = [...new Set(splittedVoters)];
			if (splittedVoters.length < 1) {
				const message = "There should be at least one voter.";
				const errorMessage = { code: 400, message: message };
				throw errorMessage;
			}
			await contract.methods
				.createElection(name, names, urls, splittedVoters)
				.send({ from: accounts[0] });
			setOpen1(true);
			setName("");
			setCandidates([]);
			setCandidatesImageURLs([]);
			setVoters([]);
			setInputFields([{ candidateName: "", candidateImageURL: "" }]);
		} catch (error) {
			console.log(error);
			setOpen2(true);
		}
		setSubmitting(false);
		setButtonLabel("Add Election");
	};

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handleChangeInput = (index, event) => {
		const values = [...inputFields];
		values[index][event.target.name] = event.target.value;
		setInputFields(values);
	};

	const handleAddField = () => {
		setInputFields([
			...inputFields,
			{ candidateName: "", candidateImageURL: "" },
		]);
	};

	const handleRemoveField = (index) => {
		const values = [...inputFields];
		values.splice(index, 1);
		setInputFields(values);
	};

	const handleVotersChange = (event) => {
		setVoters(event.target.value);
	};

	useEffect(() => {
		const getCandidateNames = () => {
			let names = inputFields.map((a) => a.candidateName);
			let urls = inputFields.map((a) => a.candidateImageURL);
			setCandidates(names.filter((e) => e));
			setCandidatesImageURLs(urls.filter((e) => e));
			names = [];
			urls = [];
		};
		getCandidateNames();
	}, [inputFields]);

	const handleClose1 = () => {
		setOpen1(false);
	};

	const handleClose2 = () => {
		setOpen2(false);
	};

	return (
		<Box
			sx={{
				marginTop: 8,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}>
			<Box>
				<Typography
					variant="h4"
					sx={{
						color: (theme) => theme.palette[color].darker,
					}}>
					Enter Election Details
				</Typography>
				<br></br>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						width: "100%",
						alignItems: "center",
					}}>
					<Box
						component="form"
						sx={{
							display: "flex",
							flexDirection: "column",
						}}
						noValidate
						autoComplete="on"
						onSubmit={handleForm}>
						<Stack spacing={3}>
							<TextField
								id="outlined-basic"
								label="Election Name"
								variant="outlined"
								required
								value={name}
								onChange={handleNameChange}
								helperText={!name ? "Required" : ""}
							/>
							{inputFields.map((inputField, index) => (
								<Grid container key={index}>
									<Grid item xs={12} md={5} pb={1} pr={2}>
										<TextField
											className="textarea"
											id="outlined-basic"
											label="Candidate Name"
											name="candidateName"
											variant="outlined"
											required
											value={inputField.candidateName}
											onChange={(event) =>
												handleChangeInput(index, event)
											}
											fullWidth
											helperText={
												!inputField.candidateName
													? "Required"
													: ""
											}
										/>
									</Grid>
									<Grid item xs={12} md={5} pr={2}>
										<TextField
											className="textarea"
											id="outlined-basic"
											required
											label="Candidate Image URL"
											name="candidateImageURL"
											variant="outlined"
											value={inputField.candidateImageURL}
											onChange={(event) =>
												handleChangeInput(index, event)
											}
											fullWidth
											helperText={
												!inputField.candidateImageURL
													? "Required"
													: ""
											}
										/>
									</Grid>
									<Grid item md={1} pt={2} pr={2}>
										<Button
											size="small"
											variant="contained"
											color="error"
											startIcon={<DeleteIcon />}
											onClick={() =>
												handleRemoveField(index)
											}>
											Remove
										</Button>
									</Grid>
								</Grid>
							))}
							<Button
								sx={{ maxWidth: "170px" }}
								size="small"
								variant="contained"
								color="primary"
								startIcon={<AddIcon />}
								onClick={() => handleAddField()}>
								Add Candidate
							</Button>
							<br></br>

							<TextField
								helperText="Please place each address on one line."
								id="outlined-basic"
								label="Voters Ethereum Addresses"
								variant="outlined"
								multiline
								minRows={5}
								maxRows={5}
								required
								value={voters}
								onChange={handleVotersChange}
							/>
							<LoadingButton
								color="primary"
								size="large"
								sx={{ width: "250px" }}
								startIcon={<AddIcon />}
								loadingPosition="start"
								loading={submitting}
								disabled={submitting}
								variant="contained"
								type="submit">
								{buttonLabel}
							</LoadingButton>
						</Stack>
					</Box>
				</Box>
			</Box>

			<Dialog
				open={open1}
				onClose={handleClose1}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Election created successfully.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose1}>OK</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={open2}
				onClose={handleClose2}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Failed to create election, please make sure the
						information entered is valid.
						<br />
						<br /> 1. Fill all required fields.
						<br /> 2. Ensure you have entered valid voter addresses.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose2}>OK</Button>
				</DialogActions>
			</Dialog>
			<Backdrop
				sx={{
					color: "#fff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={submitting}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</Box>
	);
}
