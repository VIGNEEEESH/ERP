import { Card,CardHeader,Typography } from '@material-tailwind/react';
import React, { useState } from 'react';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css';

  
function AttendanceCalendar({ attendanceData }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const formatDate = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };
  const getTileClassName = ({ date }) => {
    const formattedDate = formatDate(date);
    const attendanceStatus = attendanceData[formattedDate];
  
    if (attendanceStatus === 'present') {
      return 'bg-green-500'; 
    } else if (attendanceStatus === 'leave') {
      return 'bg-yellow-500'; 
    } else if (attendanceStatus === 'absent') {
      return 'bg-red-500'; 
    } else {
      return '';
    }
  };
  
  

  return (
    <Card className='p-10 flex justify-center items-center'>
    <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
        <Typography variant="h6" color="white">
            Attendence Tracker
        </Typography>
    </CardHeader>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={getTileClassName}
        className="br-4"
      />
      </Card>
  );
}

export default AttendanceCalendar;