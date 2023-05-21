import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MediaPublisherDashboard from './pages/MediaPublisherDashboard';
import StationDashboard from './pages/StationDashboard';
import RequestForm from './pages/RequestForm';
import CalendarPage from "./pages/CalendarPage";
import AdminDashboard from './pages/AdminDashboard';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        <Route path="/publisher-dashboard" component={MediaPublisherDashboard} />
        <Route path="/station-dashboard" component={StationDashboard} />
        <Route path="/request-form" component={RequestForm} />
        <Route exact path="/calendar" component={CalendarPage} />
        <Route exact path="/admin-dashboard" component={AdminDashboard} />

      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
