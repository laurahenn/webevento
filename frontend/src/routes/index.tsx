import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ValidaCertificado from '../pages/ValidaCertificado';

import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import DashboardEventos from '../pages/DashboardEventos';
import DashboardCertificados from '../pages/DashboardCertificados';

import Checkins from '../pages/Checkins';

import Alimentacao from '../pages/Alimentacao';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />

    <Route path="/valida-certificado" component={ValidaCertificado} />

    <Route path="/profile" component={Profile} isPrivate />
    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/dashboard-eventos" component={DashboardEventos} isPrivate />
    <Route path="/dashboard-certificados" component={DashboardCertificados} isPrivate />
    <Route path="/alimentacao" component={Alimentacao} isPrivate />

    <Route path="/checkins" component={Checkins} isPrivate />

  </Switch>
);

export default Routes;
