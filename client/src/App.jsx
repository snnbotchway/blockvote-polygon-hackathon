import { EthProvider } from "./contexts/EthContext";
import { Routes, Route } from "react-router-dom";

import ThemeProvider from "./theme";

import AddElection from "./screens/AddElection";
import ElectionDetail from "./screens/ElectionDetail";
import HomeScreen from "./screens/HomeScreen";

import Footer from "./components/Footer";
import Header from "./components/Header";

import Container from "@mui/material/Container";

function App() {
	return (
		<EthProvider>
			<ThemeProvider>
				<Header />
				<Container>
					<Routes>
						<Route path="/" element={<HomeScreen />} exact />
						<Route
							path="/elections/new/"
							element={<AddElection />}
						/>
						<Route
							path="/elections/:id"
							element={<ElectionDetail />}
						/>
					</Routes>
				</Container>
				<Footer />
			</ThemeProvider>
		</EthProvider>
	);
}

export default App;
