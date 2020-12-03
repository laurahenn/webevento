import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';

// import ptBR, { isToday, format } from 'date-fns';
import { isToday, format } from 'date-fns';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock, FiUser, FiLock } from 'react-icons/fi';
import { parseISO } from 'date-fns/esm';
import { Link, useHistory } from 'react-router-dom';

import {
  Container,
  Header,
  HeaderContent,
  Profile,   
  Content,
  Schedule,
  NextAppointment,
  Appointment,
  Section,
  Calendar,
} from './styles';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';


import Input from '../../components/Input';
import ButtonC from '../../components/ButtonC';
import Button from '../../components/Button';

import logoImg from '../../assets/logo-principal.png';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

// eventos
interface Appointment {
  id: string;
  nome: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  lugar: string;
  preco: string;
  usuario_id: string;
  evento_id: string;
}

interface CheckinFormData {
  evento_id: string;
  login: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  
// Busca os eventos
// Appointments = Eventos
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const allAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return appointment;
    });
  }, [appointments]);

  function clickEventos() {
    
    console.log('Sincroniza os eventos');

    try {

      api
        .get<Appointment[]>('/evento')
        .then((response) => {
          const appointmentsFormatted = response.data.map((appointment) => {
            return {
              ...appointment,
            };
          });
  
          setAppointments(appointmentsFormatted);
          console.log(response.data);

          addToast({
            type: 'success',
            title: 'Realizado!',
            description: 'Eventos Sincronizados!',
          });

        });

    } catch (err) {

      addToast({
        type: 'error',
        title: 'Erro!',
        description: 'Sem conexão, verifique e tente novamente.',
      });

    }

  }

  // const checkins = string[];
  var checkins:Object[] = [] 

  // Lista com os check-in's feitos localmente
  function clickCheckin(data: CheckinFormData) {

    var checkin = { evento_id: data.evento_id, login: data.login, email: data.email }; 
    checkins.push(checkin);

    console.log(checkins);

    addToast({
      type: 'success',
      title: 'Check-in!',
      description: 'Check-in : '+data.login+' '+data.email+'!',
    });

  }

  async function clickEnviaCheckins() {
    console.log("Sincroniza os check-in's");

    try {

      const data = {
        "array" : checkins
      };
      await api.post('checkin/sincroniza-checkin', data);
      
      addToast({
        type: 'success',
        title: 'Realizado!',
        description: "Check-in's Sincronizados!",
      });
    } catch (err) {

      addToast({
        type: 'error',
        title: 'Erro na Inscrição',
        description: 'Ocorreu um erro ao fazer sua inscrição, tente novamente.',
      });

    }
  }

  return (
    <Container>
      <Header>

        <HeaderContent>
          <img src={logoImg} alt="Desk-Eventos" />
          <Profile>
            <div>
              <Link to="#">
                <ButtonC type="submit" onClick={clickEventos}>Buscar Eventos</ButtonC>
              </Link>
            </div>
            <div>
              <Link to="#">
                <ButtonC type="submit" onClick={clickEnviaCheckins}>Envia Check-in's</ButtonC>
              </Link>
            </div>
            <div>
              <Link to="/">
                <ButtonC type="submit">Voltar</ButtonC>
              </Link>
            </div>
          </Profile>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Eventos</h1>

          <Section>
            {allAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {(appointment.data).substring(10, 0)} {(appointment.hora_inicio).substring(5, 0)}
                </span>
                <div>
                  <strong>{appointment.nome}</strong> - {appointment.lugar}
                  <span> </span>

                    <Form ref={formRef} onSubmit={clickCheckin}>
                      <Input name="evento_id" icon={FiUser} value={appointment.id} />
                      <Input name="login" icon={FiUser} placeholder="Login" />
                      <Input name="email" icon={FiUser} placeholder="E-mail (caso sem Login)" />
                      <Button type="submit">Check-in</Button>
                    </Form>

                  {/* <Link to="/checkins">
                    <Button type="submit" >Fazer checkin</Button>
                  </Link> */}
                </div>
              </Appointment>
            ))}

          </Section>


          <div className="Array-preview">
          <pre>
            {/* {JSON.stringify(tasks, null, 4)} */}
          </pre>
          </div>

        </Schedule>

      </Content>
    </Container>
  );
};

export default Dashboard;
