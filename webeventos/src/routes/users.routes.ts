import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import CreateUserService from '../services/CreateUserService';
import UpdateUserService from '../services/UpdateUserService';
import UsersRepository from '../repositories/UsersRepository';

import Mail from "../mail/mail";

const usersRouter = Router();

// listando os Usuários
usersRouter.get('/', async (request, response) => {
  const usersRepository = getCustomRepository(UsersRepository);

  const users = await usersRepository.find();
  return response.json(users);
});

// Criando um usuário
usersRouter.post('/', async (request, response) => {
  const { nome, email, login, password, tipo_id } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    nome,
    email,
    login,
    password,
    tipo_id
  });

  delete user.password;

  Mail.to = email;
  Mail.subject = 'Bem vindo ao Web-Evento [Novo Usuário]';
  Mail.message = 'Adoramos te ver aqui, espero que curta muitos eventos. <br> Abraços';
  let result = Mail.sendMail();

  return response.json(user);
});

// Atualizando um usuário
// routes.put('/users/:id', UserController.update);
usersRouter.put('/', async(request, response) => {
  const { user_id, nome, email, old_password, password } = request.body;

  const updateUser = new UpdateUserService();

  const user = await updateUser.execute({
    user_id, nome, email, old_password, password
  });

  delete user.password;

  return response.json(user);
});

export default usersRouter;
