import React, { useCallback, useRef } from 'react';
import { FiPower, FiMail, FiKey, FiUser, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';

import { useAuth } from '../../hooks/auth';

import logoImg from '../../assets/logo-principal.png';

interface CheckinFormData {
  evento_id: string;
  usuario_login: string;
  // usuario_email: string;
}

const Checkin: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, signOut } = useAuth();

  const handleSubmit = useCallback(
    async (data: CheckinFormData) => {
      try {
        formRef.current?.setErrors({});

        console.log(data);

        await api.post('checkin', data);

        addToast({
          type: 'success',
          title: 'Realizado!',
          description: 'Aproveite seu evento!',
        });

        // data.usuario_login = '';
        // history.push('/checkins');
      } catch (err) {
        
        addToast({
          type: 'error',
          title: 'Erro no checkin',
          description: 'Ocorreu um erro ao fazer seu checkin, tente novamente.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>

      <header>
        <div>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </div>
      </header>
      
      <Content>
        <Form
          ref={formRef}
          initialData={{ nome: user.nome, email: user.email }}
          onSubmit={handleSubmit}
        >

          <h1>Checkins</h1>

          <Input name="evento_id" icon={FiKey} placeholder="Chave do evento" />
          <Input name="usuario_login" icon={FiUser} placeholder="Login do participante" />          
          <Button type="submit">Salva checkin!</Button>

          {/* <Input name="usuario_email" icon={FiMail} placeholder="Email para novo participante" /> */}
        </Form>
      </Content>
    </Container>
  );
};

export default Checkin;
