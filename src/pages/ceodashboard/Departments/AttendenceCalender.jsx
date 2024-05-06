import { Card, CardHeader, Typography } from '@material-tailwind/react';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar'; // Assuming you've installed 'react-calendar'
import 'react-calendar/dist/Calendar.css';

function AttendanceCalendar({ attendanceData }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAttendanceAndEmployees = async () => {
      try {
        // Fetch attendance data
        const attendanceResponse = await fetch(`${import.meta.env.REACT_APP_BACKEND_URL}/api/erp/attendance/get/attendance/byuserId/${attendanceData.userId}`);
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
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month starts from 0, so add 1
    const day = date.getDate();

    // Pad single-digit month and day with leading zeros if necessary
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const getTileClassName = ({ date }) => {
    const formattedDate = formatDate(date);

    // Check if the user is present on the selected date
    const isPresent = attendance.some(entry => entry.date === formattedDate && entry.attendanceStatus === 'Present');

    // Determine the background color based on attendance status
    return isPresent ? 'bg-green-500 rounded-full text-white' : 'bg-red-500 rounded-full text-white'; // User is present or not
  };

  // Get the present dates in the month
  const presentDates = attendance
    .filter(entry => entry.attendanceStatus === 'Present')
    .map(entry => new Date(entry.date));

  return (
    <div>
      <Card className='p-10 flex justify-center items-center'>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Attendance Tracker
          </Typography>
        </CardHeader>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={getTileClassName}
          className="rounded-lg p-2 text-xl w-25"
        />
      </Card>
      {/* <div className="mt-4 flex justify-center">
        <Card className="p-4">
          <Typography className="font-semibold mb-2">Present Days</Typography>
          <ul>
            
              <li >{presentDates.length}</li>
           
          </ul>
        </Card>
      </div><br/><br/> */}
    </div>
  );
}

export default AttendanceCalendar;
