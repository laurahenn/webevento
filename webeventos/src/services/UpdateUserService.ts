import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'

import { hash } from 'bcryptjs'

import AppError from '../errors/AppError'
import Usuario from '../models/Usuario'

interface Request {
  user_id: string;
  nome: string;
  email: string;
  old_password: string;
  password: string;
}

class UpdateUserService {
  public async execute({ user_id, nome, email, old_password, password }: Request): Promise<Usuario>
  {
    const usersRepository = getRepository(Usuario);

    const id = user_id;
    const user = await usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new AppError('Usuario not found');
    }

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password.',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      user.nome = nome;
      user.email = email;
      user.password = await hash(password, 8);
    }

    await usersRepository.save(user);
    return user;
  }
}

export default UpdateUserService;
// Quando ta caindo nos throw new AppError fica em loop e buga
