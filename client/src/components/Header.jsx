import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import HowToVoteIcon from "@mui/icons-material/HowToVote";

function Header() {
	return (
		<header>
			<AppBar
				sx={{
					minHeight: "5rem",
				}}
				position="static"
				style={{
					background: "#2E3B55",
				}}>
				<Container>
					<Toolbar>
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="open drawer"
							sx={{ mr: 2 }}>
							<HowToVoteIcon />
						</IconButton>
						<Typography
							variant="h6"
							noWrap
							component="div"
							sx={{
								flexGrow: 1,
								display: { xs: "none", sm: "block" },
							}}>
							BLOCK-VOTE
						</Typography>
					</Toolbar>
				</Container>
			</AppBar>
		</header>
	);
}

export default Header;
