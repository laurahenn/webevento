import React, { useState, useCallback, useEffect, useMemo } from 'react';
// import ptBR, { isToday, format } from 'date-fns';
import { isToday, format } from 'date-fns';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FiPower, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
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
import ButtonC from '../../components/ButtonC';

import logoImg from '../../assets/logo-principal.png';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface Appointment {
  id: string;
  nome: string;
  data: string;
  hora_inicio: string;
  // hora_fim: string;
  // lugar: string;
  // preco: string;
  usuario_id: string;
  evento_id: string;
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { addToast } = useToast();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setSelectedDate(month);
  }, []);

  // Dia selecionado
  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      // locale: ptBR,
    });
  }, [selectedDate]);
  // Dia da semana selecionado
  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      // locale: ptBR,
    });
  }, [selectedDate]);

  useEffect(() => {

    console.log(user.id);

    api
      .get<Appointment[]>('/usuario-evento/usuario', { 
        params: {
          usuario_id: user.id,
        }
       })
      .then((response) => {
        const appointmentsFormatted = response.data.map((appointment) => {
          return {
            ...appointment,
          };
        });

        setAppointments(appointmentsFormatted);
        console.log(response.data);
      });
  }, [selectedDate]);

  // todos os Eventos
  const allAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      return appointment;
    });
  }, [appointments]);

  // Cancela a inscrição no evento.
  async function handleClick(evento_id:string) {

    try {
      const config = {
        data: {
          "usuario_id" : user.id,
          "evento_id" : evento_id
        }
      }

      await api.delete('usuario-evento', config);
      
      addToast({
        type: 'success',
        title: 'Inscrito!',
        description: 'Que pena! Sua inscrição foi cancelada.',
      });

    } catch (err) {

      addToast({
        type: 'error',
        title: 'Erro na Inscrição',
        description: 'Ocorreu um erro ao fazer o cancelamento da sua inscrição, tente novamente.',
      });

    }
  }


  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Web-Eventos" />

          <Profile>
            <div>
              <span>Olá, 
              <Link to="/profile">
                <strong> {user.nome}</strong>
              </Link>
              </span>
            </div>
          </Profile>
          
          <Profile>
            <div>
              <span>
              <Link to="/dashboard">
                <strong> Todos os eventos </strong>
              </Link>
              </span>
            </div>
          </Profile>

          <Profile>
            <div>
              <span>
              <Link to="/dashboard-certificados">
                <strong> Meus certificados </strong>
              </Link>
              </span>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Meus Eventos</h1>
          
          <Section>
            {allAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hora_inicio}
                </span>
                <div>
                  <strong>{appointment.nome}</strong>  
                  <span> { (appointment.data).substring(10, 0) } </span>
                  <Link to="#">
                    <ButtonC type="submit" onClick={(evento_id) => handleClick(appointment.evento_id)} >Cancelar</ButtonC>
                  </Link>
                </div>
              </Appointment>
            ))}

          </Section>

        </Schedule>

      </Content>
    </Container>
  );
};

export default Dashboard;
