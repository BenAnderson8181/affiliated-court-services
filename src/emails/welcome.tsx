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
  
  type WelcomeProps = {
    accountId?: string;
    firstName?: string;
    lastName?: string;
  }
  
  export const WelcomeEmail = ({
    accountId = '',
    firstName = 'John',
    lastName = 'Doe'
  }: WelcomeProps) => (
    <Html>
        <Head />
        <Tailwind>
            <Body className="bg-white text-slate-100 my-12 mx-auto font-sans text-lg p-8">
                <Container className="bg-purple-900 p-8 rounded-lg shadow-black shadow-xl">
                    <Heading >Welcome {firstName} {lastName}!</Heading>
                    <Text className='text-lg'>
                        Thank you for signing up with ACS!<br />
                        We look forward to serving you.
                    </Text>
                    <Text className="text-lg">
                        Kind regards,<br /> Affiliate Court Services
                    </Text>
                    <Text className='text-lg italic'>
                        To get started use the link below to get to the site and onto your client portal.<br />
                        From there we have prompts for the next steps you need to take.<br />
                        There is also a message system if you need further assistance.
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
  
  export default WelcomeEmail;
  