import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

  import TimeTable from "./pages/TimeTable";
  import SettingTable from "./pages/SettingTable"
  
  export default function App() {
    return (
      <Router>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/timetable">
              <TimeTable />
            </Route>
            <Route path="/setting">
              <SettingTable />
            </Route>
          </Switch>
      </Router>
    );
  }