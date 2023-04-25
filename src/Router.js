import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MediaPublisherDashboard from './pages/MediaPublisherDashboard';
import StationDashboard from './pages/StationDashboard';
import RequestForm from './pages/RequestForm';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        <Route path="/publisher-dashboard" component={MediaPublisherDashboard} />
        <Route path="/station-dashboard" component={StationDashboard} />
        <Route path="/request-form" component={RequestForm} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
