import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO, startOfHour } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// listando os agendamentos
appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();

  const { date } = request.body;

  if(date) {
    const appointmentDate = startOfHour(date);

    const appointments = await appointmentsRepository.find({
      where: { date },
    });
  }

  return response.json(appointments);
});

// Criando um agendamento
appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const creatAppointment = new CreateAppointmentService();
  const appointment = await creatAppointment.execute({
    date: parsedDate,
    provider_id,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
