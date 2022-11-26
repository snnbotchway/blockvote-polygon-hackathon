import { EthProvider } from "./contexts/EthContext";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "@mui/material";
import HomeScreen from "./screens/HomeScreen";
import ThemeProvider from "./theme";

// import ElectionDetail from "./screens/ElectionDetail";
// import HomeScreen from "./screens/HomeScreen";
// import AddElection from "./screens/AddElection";

function App() {
	return (
		<EthProvider>
			<ThemeProvider>
				<Header />
				<Container>
					<HomeScreen />
				</Container>
				<Footer />
			</ThemeProvider>
		</EthProvider>
	);
}

export default App;
