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
  
  type CancelledProps = {
    accountId?: string;
    firstName?: string;
    lastName?: string;
    appointmentDate?: Date;
    time?: string;
    appointmentType?: string;
  }
  
  export const CancelAppointmentEmail = ({
    accountId = '',
    firstName = 'John',
    lastName = 'Doe',
    appointmentDate = new Date(),
    time = '12:00',
    appointmentType = 'Group'
  }: CancelledProps) => (
    <Html>
        <Head />
        <Tailwind>
            <Body className="bg-white text-slate-100 my-12 mx-auto font-sans text-lg p-8">
                <Container className="bg-purple-900 p-8 rounded-lg shadow-black shadow-xl">
                    <Heading className="leading-10">Dear {firstName} {lastName},</Heading>
                    <Text className='text-lg'>
                    This email serves as a notification that you have cancelled your appointment on {appointmentDate.toDateString()} at {time}. 
                    </Text>
                    <Text className='text-lg'>
                        As per our cancellation policy, written in the Payment Agreement, you will be charged {appointmentType === 'Group' ? '$20.00' : '$50.00'} for canceling your
                        appointment without providing a 48 hour notice. This amount must be paid in full before
                        you can make your next appointment. In the future, please provide our office 48 hours
                        notice if you will be unable to make your scheduled appointment in order to avoid the late fee.
                        Please contact our office if you need to ask for an exception to our cancellation policy.
                    </Text>
                    <Text className="text-lg">
                        Thank you for your understanding and we look forward to serving you in the future.
                    </Text>
                    <Text className="text-lg">
                        Kind regards,<br /> Affiliate Court Services
                    </Text>
                    <Text className='text-lg italic'>
                        If you would like to reschedule please use the link below to get back to your client portal and then go to the calendar to find a new appointment.
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
  
  export default CancelAppointmentEmail;
  