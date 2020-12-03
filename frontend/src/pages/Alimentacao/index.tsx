import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiClock, FiCalendar, FiFileText } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { Container, Content } from './styles';

import { useAuth } from '../../hooks/auth';

interface AlimentacaoFormData {
  dia: string;
  hora: string;
  salada: string;
  principal: string;
  fruta: string;
  sobremesa: string;
  user_id: string;
  turno_id: string;
}

const Alimentacao: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user } = useAuth();

  const handleSubmit = useCallback(
    async (data: AlimentacaoFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          userNome: Yup.string().required('Usuário é obrigatório'),
          turnoNome: Yup.string().required('Turno é obrigatório'),
          principal: Yup.string().required('Prato principal é obrigatório'),
          dia: Yup.string().required('Dia é obrigatório'),
          hora: Yup.string().required('Hora é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('alimentacao', data);

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: '',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        {/* <AnimationContainer> */}
        <Form
          ref={formRef}
          initialData={{ userNome: user.nome }}
          onSubmit={handleSubmit}
        >
          <h1>O que você comeu?</h1>
          <Input name="dia" icon={FiCalendar} placeholder="Dia" type="date" />
          <Input name="hora" icon={FiClock} placeholder="Hora" type="time" />
          <Input
            name="salada"
            icon={FiFileText}
            placeholder="Saladas"
            type="text"
          />
          <Input
            name="principal"
            icon={FiFileText}
            placeholder="Prato principal"
            type="text"
          />
          <Input
            name="fruta"
            icon={FiFileText}
            placeholder="Frutas"
            type="text"
          />
          <Input
            name="sobremesa"
            icon={FiFileText}
            placeholder="Sobremesas"
            type="text"
          />
          {/* <Input name="userNome" icon={FiUser} placeholder="Usuário" /> */}
          {/* <Input name="turnoNome" icon={FiFileText} placeholder="Turno" /> */}

          <Button type="submit">Cadastrar</Button>
        </Form>

        {/* </AnimationContainer> */}
      </Content>
    </Container>
  );
};

export default Alimentacao;
