import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useEth from "../contexts/EthContext/useEth";

import OwnerDetail from "./OwnerDetail";
import VoterDetail from "./VoterDetail";

import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export default function ElectionDetail({ color = "primary" }) {
	const { id } = useParams();
	const [title, setTitle] = useState("");
	const {
		state: { contract, accounts },
	} = useEth();
	const [candidates, setCandidates] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isOwner, setIsOwner] = useState(null);

	useEffect(() => {
		const getRole = async () => {
			if (contract) {
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
				const title = await contract.methods
					.getElectionTitle(id)
					.call();
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
