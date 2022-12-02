import * as React from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function Candidate({ id, name, voteCount, imageURL }) {
	return (
		<Card sx={{ width: 300 }}>
			<CardHeader
				title={
					<Typography align="center" variant="subtitle1">
						{name}
					</Typography>
				}
			/>
			<CardContent sx={{ padding: 0 }}>
				<CardMedia
					component="img"
					alt={`${name}'s picture`}
					height="300"
					image={imageURL}
				/>
			</CardContent>
			<CardActions sx={{ justifyContent: "center" }}>
				{voteCount && (
					<Typography align="center" variant="">
						<strong>{voteCount}</strong> votes
					</Typography>
				)}
			</CardActions>
		</Card>
	);
}
