import React, { useContext, useEffect, useState } from 'react';
import { Card, CardHeader, Typography } from '@material-tailwind/react';
import { message } from 'antd';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AuthContext } from '@/pages/auth/Auth-context';
import './CalenderStyles.css';

function AttendanceCalendar({ attendanceData }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchAttendanceAndEmployees = async () => {
      try {
        const attendanceResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/attendance/get/attendance/byuserId/${attendanceData._id}`, {
          headers: { Authorization: "Bearer " + auth.token }
        });
        if (!attendanceResponse.ok) {
          throw new Error(`Failed to fetch attendance data: ${attendanceResponse.status}`);
        }
        const attendanceDataa = await attendanceResponse.json();
        setAttendance(attendanceDataa.attendance);
      } catch (error) {
        message.error("Error fetching attendance", error.message);
      }
    };

    fetchAttendanceAndEmployees();
  }, [attendanceData._id, auth.token]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const getTileClassName = ({ date }) => {
    const formattedDate = formatDate(date);
    const isPresent = attendance.some(entry => entry.date === formattedDate && entry.attendanceStatus === 'Present');
    return isPresent ? 'react-calendar__tile--present' : 'react-calendar__tile--absent';
  };

  return (
    <div>
      <Card className='p-10 flex flex-col items-center'>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center w-full">
          <Typography variant="h6" color="white">
            Attendance Tracker
          </Typography>
        </CardHeader>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={getTileClassName}
          className="rounded-lg p-2 text-xl w-25 react-calendar"
        />
        <div className="legend mt-4 flex justify-center">
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Present</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>Absent</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AttendanceCalendar;
