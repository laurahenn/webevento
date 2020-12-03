import { Router } from 'express';

import appointmentsRouter from './appointments.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import tiposRouter from './tipos.routes';
import eventoRouter from './evento.routes';
import certificadoRouter from './certificado.routes';
import checkinRouter from './checkin.routes';
import usuarioEventoRouter from './usuarioevento.routes';

// routes.get('/', (request, response) => response.json({ message: 'Hello World!' }));

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/tipos', tiposRouter);
routes.use('/evento', eventoRouter);
routes.use('/certificado', certificadoRouter);
routes.use('/checkin', checkinRouter);
routes.use('/usuario-evento', usuarioEventoRouter);
routes.use('/sessions', sessionsRouter);


export default routes;
