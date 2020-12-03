import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import ValidaCertificado from '../pages/ValidaCertificado';

import Dashboard from '../pages/Dashboard';
import DashboardEventos from '../pages/DashboardEventos';
import DashboardCertificados from '../pages/DashboardCertificados';

import Checkins from '../pages/Checkins';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />

    <Route path="/valida-certificado" component={ValidaCertificado} />

    <Route path="/dashboard" component={Dashboard} />
    <Route path="/dashboard-eventos" component={DashboardEventos} />
    <Route path="/dashboard-certificados" component={DashboardCertificados} />

    <Route path="/checkins" component={Checkins} />

  </Switch>
);

export default Routes;
