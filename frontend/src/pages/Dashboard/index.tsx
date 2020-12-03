import React, { useState, useCallback, useEffect, useMemo } from 'react';
// import ptBR, { isToday, format } from 'date-fns';
import { isToday, format } from 'date-fns';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import { parseISO } from 'date-fns/esm';
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
  hora_fim: string;
  lugar: string;
  preco: string;
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

  // busca na api os appointments no dia/mes/ano selecionado
  useEffect(() => {
    api
      .get<Appointment[]>('/evento/eventos-dia', {
        params: {
          ano: selectedDate.getFullYear(),
          mes: selectedDate.getMonth() + 1,
          dia: selectedDate.getDate(),
          usuario_id: user.id,
        },
      })
      .then((response) => {
        const appointmentsFormatted = response.data.map((appointment) => {
          return {
            ...appointment,
            // hora_inicio: format(parseISO(appointment.hora_inicio), 'HH:mm'),
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

  // Realiza a inscrição no evento.
  async function handleClick(evento_id:any) {

    try {

      const data = {
        "usuario_id" : user.id,
        "evento_id" : evento_id
      };
      await api.post('usuario-evento', data);
      
      addToast({
        type: 'success',
        title: 'Inscrito!',
        description: 'Legal! Você está inscrito nesse evento.',
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
              <Link to="/dashboard-eventos">
                <strong> Meus eventos </strong>
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
          <h1>Eventos</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          <Section>
            {allAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hora_inicio} {appointment.hora_fim}
                </span>
                <div>
                  <strong>{appointment.nome}</strong> - {appointment.lugar}
                  <span>R$ {appointment.preco}</span>
                  <Link to="#">
                    <ButtonC type="submit" onClick={(evento_id) => handleClick(appointment.id)} >Me inscrever</ButtonC>
                  </Link>
                </div>
              </Appointment>
            ))}

          </Section>

        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            // fromMonth={new Date()}
            // // disabledDays={[{ daysOfWeek: [0, 8] }]}
            modifiers={{ available: { daysOfWeek: [0, 1, 2, 3, 4, 5, 6, 7] } }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              'Jan',
              'Fev',
              'Mar',
              'Abr',
              'Mai',
              'Jun',
              'Jul',
              'Ago',
              'Set',
              'Out',
              'Nov',
              'Dez',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
