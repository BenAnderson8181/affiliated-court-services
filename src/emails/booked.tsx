import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Button,
    Text,
    Tailwind
  } from '@react-email/components';
  import * as React from 'react';
  
  type BookedProps = {
    accountId?: string;
    firstName?: string;
    lastName?: string;
    appointmentDate?: Date;
    time?: string;
    appointmentType?: string;
  }
  
  export const BookedAppointmentEmail = ({
    accountId = '',
    firstName = 'John',
    lastName = 'Doe',
    appointmentDate = new Date(),
    time = '12:00',
    appointmentType = 'Group'
  }: BookedProps) => (
    <Html>
        <Head />
        <Tailwind>
            <Body className="bg-white text-slate-100 my-12 mx-auto font-sans text-lg p-8">
                <Container className="bg-purple-900 p-8 rounded-lg shadow-black shadow-xl">
                    <Heading className="leading-10">Hello {firstName} {lastName},</Heading>
                    <Text className='text-lg'>
                        Your {appointmentType} appointment is confirmed for {appointmentDate.toDateString()} at {time}. 
                    </Text>
                    <Text className='text-lg'>
                        As per our cancellation policy, written in the Payment Agreement, you will be charged {appointmentType === 'Group' ? '$20.00' : '$50.00'} for canceling your
                        appointment without providing a 48 hour notice.
                    </Text>
                    <Text className="text-lg">
                        Thank you for booking an appointment with ACS we look forward to serving you.
                    </Text>
                    <Text className="text-lg">
                        Kind regards,<br /> Affiliate Court Services
                    </Text>
                    <Text className='text-lg italic'>
                        If you would like to reschedule please use the link below to get back to your client portal and then go to the calendar to find a new appointment and/or click on your existing appointment to cancel your currently scheduled appointment.
                    </Text>
                    <Button 
                        className="py-6 px-4 rounded-md bg-amber-300 font-semibold"
                        href={`localhost:3000/account/${accountId}`}>
                        Affiliated Court Services
                    </Button>
                </Container>
            </Body>
        </Tailwind>
    </Html>
  );
  
  export default BookedAppointmentEmail;
  