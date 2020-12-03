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

interface ValidaFormData {
  chave: string;
}

const Checkin: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, signOut } = useAuth();

  const handleSubmit = useCallback(
    async (data: ValidaFormData) => {
      try {
        formRef.current?.setErrors({});

        const config = {
          data: {
            "chave" : data.chave
          }
        }


        await api.get('certificado/validar', config);

        addToast({
          type: 'success',
          title: 'Valido!',
          description: 'Esse certificado é valido!',
        });

        // data.usuario_login = '';
        // history.push('/checkins');
      } catch (err) {
        
        addToast({
          type: 'error',
          title: 'Erro no certificado',
          description: 'Esse certificado pode ser fake, em caso de dúvida tente novamente.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>

      <header>
        <div>
          <Link to="/">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      
      <Content>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
        >

          <h1>Validar um certificado</h1>

          <Input name="chave" icon={FiKey} placeholder="Chave do certificado" />
          <Button type="submit">Validar</Button>

        </Form>
      </Content>
    </Container>
  );
};

export default Checkin;
