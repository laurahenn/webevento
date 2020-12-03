import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import AppError from '../errors/AppError'
import Usuario from '../models/Usuario'

interface Request {
  nome: string;
  email: string;
  login: string;
  password: string;
  tipo_id: string;
}

class CreateUserService {
  public async execute({ nome, email, login, password, tipo_id }: Request): Promise<Usuario>{
    const usersRepository = getRepository(Usuario);

    const checkUserExists = await usersRepository.findOne({
      where: { login },
    });

    if (checkUserExists) {
      throw new AppError('Login already used.')
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      nome, email, login, tipo_id,
      password: hashedPassword,
    });
    await usersRepository.save(user);
    return user;
  }
}

export default CreateUserService;
