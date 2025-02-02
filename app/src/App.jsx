import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import KruskalPage from './pages/KruskalsPage/KruskalsPage.jsx';
import HomePage from "./pages/HomePage/HomePage.jsx";
import Footer from "./components/Footer/Footer.jsx";

export default function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/kruskal" element={<KruskalPage />} />
                </Routes>

                <Footer />
            </div>
        </Router>
    );
}
