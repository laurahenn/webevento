import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import AppError from '../errors/AppError'
import authConfig from '../config/auth'
import Usuario from '../models/Usuario'

interface Request {
  login: string;
  password: string;
}

interface Response {
  user: Usuario;
  token: string;
}

class AuthenticateUserService {
  public async execute({ login, password }: Request): Promise<Usuario> {
    const usersRepository = getRepository(Usuario);

    const user = await usersRepository.findOne({ where: { login } });

    if(!user) {
      throw new AppError('Incorrect login/password combination.', 401)
    }

    const passwordMatched = await compare(password, user.password);
    if(!passwordMatched) {
      throw new AppError('Incorrect login/password combination.', 401)
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    }
  }
}

export default AuthenticateUserService;
