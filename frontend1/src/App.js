import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>React Django JWT Auth App</h1>

      <Router>
        <AuthProvider>
          <Header />
          <Switch>
            <Route component={LoginPage} path="/login" />
            <PrivateRoute component={HomePage} path="/" exact />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
