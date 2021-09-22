import "./App.css";
import { Switch, Route } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import DashboardFilter from "./components/DashboardFilter";

import People from "./components/People";
import PeopleFilterSearch from "./components/PeopleFilterSearch";

import Police from "./components/Police";
import PoliceFilteredSearch from "./components/PoliceFilterSearch";

import Rank from "./components/Rank";
import SubDivision from "./components/SubDivision";

import PoliceStation from "./components/PoliceStation";

import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={Login} exact />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/filter-dashboard" component={DashboardFilter} />
        <Route path="/get-people-list" component={People} />
        <Route path="/filter-people" component={PeopleFilterSearch} />
        <Route path="/police-list" component={Police} />
        <Route path="/filter-police" component={PoliceFilteredSearch} />
        <Route path="/rank-page" component={Rank} />
        <Route path="/sub-divisions" component={SubDivision} />
        <Route path="/police-stations" component={PoliceStation} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
      </Switch>
    </div>
  );
}

export default App;
