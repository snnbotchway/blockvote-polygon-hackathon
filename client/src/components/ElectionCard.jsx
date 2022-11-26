import PropTypes from "prop-types";
import { Card, Typography, Button, Grid } from "@mui/material";

ElectionCard.propTypes = {
	color: PropTypes.string,
	title: PropTypes.string.isRequired,
	sx: PropTypes.object,
};

export default function ElectionCard({
	title,
	isOwner,
	id,
	color = "primary",
	sx,
	...other
}) {
	return (
		<Card
			sx={{
				height: "15vh",
				p: 5,
				boxShadow: 0,
				textAlign: "center",
				justifyContent: "center",
				color: (theme) => theme.palette[color].darker,
				bgcolor: (theme) => theme.palette[color].lighter,
				...sx,
			}}
			{...other}>
			<Grid
				container
				spacing={2}
				sx={{
					textAlign: "center",
					justifyContent: "center",
				}}>
				<Grid item>
					<Typography variant="subtitle1">{title}</Typography>
					<Button
						sx={{ my: 2 }}
						href={`/elections/${id}`}
						target="_blank"
						variant="contained">
						{isOwner ? "Manage Election" : "Go To Election"}
					</Button>
				</Grid>
			</Grid>
		</Card>
	);
}
