import * as React from "react";
import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import HowToVoteIcon from "@mui/icons-material/HowToVote";

function Header() {
	return (
		<header>
			<AppBar
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
							component={Link}
							to="/"
							style={{
								color: "inherit",
								textDecoration: "inherit",
							}}
							sx={{ flexGrow: 1 }}>
							BlockVote
						</Typography>
					</Toolbar>
				</Container>
			</AppBar>
		</header>
	);
}

export default Header;
