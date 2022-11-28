import { EthProvider } from "./contexts/EthContext";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "@mui/material";
import HomeScreen from "./screens/HomeScreen";
import AddElection from "./screens/AddElection";
import ElectionDetail from "./screens/ElectionDetail";
import ThemeProvider from "./theme";

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
