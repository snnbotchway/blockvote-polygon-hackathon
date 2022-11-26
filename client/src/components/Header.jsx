import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Container from "@mui/material/Container";
import HowToVoteIcon from "@mui/icons-material/HowToVote";

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(1),
		width: "auto",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			width: "30ch",
			"&:focus": {
				width: "30ch",
			},
		},
	},
}));

function Header() {
	return (
		<header>
			<AppBar
				sx={{ minHeight: "5rem" }}
				position="static"
				style={{ background: "#2E3B55" }}>
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
						<Search>
							<SearchIconWrapper>
								<SearchIcon />
							</SearchIconWrapper>
							<StyledInputBase
								placeholder="Search Elections…"
								inputProps={{ "aria-label": "search" }}
							/>
						</Search>
					</Toolbar>
				</Container>
			</AppBar>
		</header>
	);
}

export default Header;
