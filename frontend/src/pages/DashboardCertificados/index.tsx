import React, { useState, useCallback, useEffect, useMemo } from 'react';
// import ptBR, { isToday, format } from 'date-fns';
import { isToday, format } from 'date-fns';
import { jsPDF } from "jspdf";
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiFile } from 'react-icons/fi';
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
import { useAuth} from '../../hooks/auth';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface Appointment {
  id: string;
  titulo: string;
  descricao: string;
  usuario_id: string;
  evento_id: string;
  certificado_id: string;
}

const Dashboard: React.FC = () => {
  const { user, signOut} = useAuth();
  const { addToast } = useToast()

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
    api
      .get<Appointment[]>('/certificado/usuario', {
        params: {
          usuario_id: user.id
        },
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

    // GERA?
   // api.get('/certificado/gera-pdf', {
     // params: {
       // id: id
     // },
   // })
   // .then((response) => {});

    // ABRE?
    // api.get('/certificado/abre-pdf', {
    //   params: {
    //     id: id
    //   },
    // })
    // .then((response) => {});
  
    async function handleClick(id:string, titulo:string, descricao:string) {

      const doc = new jsPDF("landscape", "mm", [297,410]);

      doc.setFont("helvitica");
      doc.setFontSize(11);

      var conteudo = `
            Seu certificado
            
            Presença no evento
            `+titulo+`
            `+descricao+`
            Chave: `+id+`
        `;

      doc.text(conteudo, 10,10);

      doc.autoPrint();
      doc.output("dataurlnewwindow");
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
              <Link to="/dashboard-eventos">
                <strong> Meus eventos </strong>
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
          <h1>Meus certificados</h1>
          <Section>
            {allAppointments.map((appointment) => (
              <Appointment key={appointment.id}>
                <span>
                  <Link to="#">
                  <ButtonC type="submit" onClick={(certificado_id) => handleClick(appointment.id,appointment.titulo,appointment.descricao)}> <FiFile />Ver</ButtonC>
                  </Link>
                </span>
                <div>
                  <strong>{appointment.titulo}</strong> - {appointment.descricao}
                </div>
              </Appointment>
            ))}

          </Section>
        </Schedule>

      </Content>
    </Container>
  );}

export default Dashboard;