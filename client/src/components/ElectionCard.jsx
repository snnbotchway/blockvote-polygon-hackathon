import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

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
				maxHeight: "17vh",
				p: 3,
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
					<Link
						to={`/elections/${id}`}
						style={{ textDecoration: "none" }}
						state={{ id: id, title: title }}>
						<Button
							sx={{ mt: 3, mb: 1 }}
							target="_blank"
							variant="contained">
							{isOwner ? "Manage Election" : "Go To Election"}
						</Button>
					</Link>
				</Grid>
			</Grid>
		</Card>
	);
}
