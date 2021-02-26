import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import * as Yup from 'yup';
import AppError from '../errors/AppError';

import UsersRepository from '../repositories/UsersRepository';

class UserController {

    async create(request: Request, response: Response) {
        const {name, email} = request.body;

        const schema = Yup.object().shape({
            name: Yup.string().required("Campo Obrigatório"),
            email: Yup.string().email().required("Campo Obrigatório"),
        });

        if(!(await schema.isValid(request.body))) {
            throw new AppError("Validation Failed!");
        }

        const userRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await userRepository.findOne({
            where: { email },
        });

        if(userAlreadyExists) {
            throw new AppError("User already exists!");
        }

        const user = userRepository.create({
            name,
            email,
        });

        await userRepository.save(user);

        return response.status(201).json(user);
    }

}
export default UserController;