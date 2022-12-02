import OwnerDetail from "./OwnerDetail";
import VoterDetail from "./VoterDetail";
import useEth from "../contexts/EthContext/useEth";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function ElectionDetail({ color = "primary" }) {
	const location = useLocation();
	const { id } = useParams();
	const [title, setTitle] = useState("");
	console.log(id);
	const {
		state: { contract, accounts },
	} = useEth();
	const [candidates, setCandidates] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isOwner, setIsOwner] = useState(null);

	useEffect(() => {
		const getRole = async () => {
			if (contract) {
				console.log("getting role");
				const isOwner = await contract.methods
					.isOwner(id)
					.call({ from: accounts[0] });
				setIsOwner(isOwner);
			}
		};
		const getCandidates = async () => {
			if (contract) {
				const candidates = await contract.methods
					.getCandidates(id)
					.call();
				setCandidates(candidates);
			}
		};
		const getTitle = async () => {
			if (contract) {
				const title = await contract.methods.electionTitles(id).call();
				setTitle(title);
				setLoading(false);
			}
		};
		getRole();
		getCandidates();
		getTitle();
	}, [contract, accounts, id, title]);

	return (
		<Box
			sx={{
				bgcolor: "background.default",
				color: "text.primary",
				height: "100vh",
			}}>
			{loading ? (
				<Backdrop
					sx={{
						color: "#fff",
						zIndex: (theme) => theme.zIndex.drawer + 1,
					}}
					open={true}>
					<CircularProgress color="inherit" />
				</Backdrop>
			) : (
				<Box>
					<Box marginTop={4}>
						<Typography
							sx={{
								color: (theme) => theme.palette[color].darker,
							}}
							align="center"
							variant="h4">
							{title}
						</Typography>
					</Box>
					{isOwner && (
						<OwnerDetail
							id={id}
							title={title}
							candidates={candidates}
							isOwner={isOwner}
							contract={contract}
							currentAccount={accounts[0]}
						/>
					)}

					{!isOwner && (
						<VoterDetail
							id={id}
							isOwner={isOwner}
							title={title}
							candidates={candidates}
							contract={contract}
							currentAccount={accounts[0]}
						/>
					)}
				</Box>
			)}
		</Box>
	);
}
