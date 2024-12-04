import { Router } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Sidebar";
import Login from "./pages/Login";

function App() {
  return (
      <div className="App">
        <Header></Header>
        <Sidebar></Sidebar>
      </div>
  );
}

export default App;
