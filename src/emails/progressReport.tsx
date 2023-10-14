import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Text,
    Tailwind,
    Section
  } from '@react-email/components';
  import * as React from 'react';
  
  type Requirement = {
    fulfilled: number;
    required: number;
    requirementType: string;
  }

  type ProgressReportProps = {
    firstName?: string;
    lastName?: string;
    email?: string;
    comment?: string;
    percentComplete?: number;
    requirements?: Requirement[]
  }
  
  export const ProgressReportEmail = ({
    firstName = 'John',
    lastName = 'Doe',
    email = 'Has been an active participant in groups.  Seems to be getting the concepts.',
    comment = 'Has been an active participant in groups.  Seems to be getting the concepts.',
    percentComplete = 26.2,
    requirements = [
                        { fulfilled: 2, required: 8, requirementType: 'Individual'},
                        { fulfilled: 6, required: 24, requirementType: 'SUD Group'},
                        { fulfilled: 1, required: 1, requirementType: 'Orientation Workshop'},
                        { fulfilled: 0, required: 1, requirementType: 'Aggreesive Driving Workshop'},
                        { fulfilled: 0, required: 1, requirementType: 'Prime for Life'},
                    ]
  }: ProgressReportProps) => (
    <Html>
        <Head />
        <Tailwind>
            <Body className="bg-white text-slate-100 my-12 mx-auto font-sans text-lg p-8">
                <Container className="bg-purple-900 p-8 rounded-lg shadow-black shadow-xl">
                    <Heading >Progress Report for {firstName} {lastName}!</Heading>
                    <Section>
                        <Text className='text-lg'>
                            As of {new Date().toDateString()}<br />
                            Client is {percentComplete.toFixed(2)}% complete.
                        </Text>
                        <Text>
                            {
                                requirements?.map((requirement, index) => {
                                    return <div key={index}>{requirement.fulfilled}/{requirement.required} {requirement.requirementType}</div>
                                })
                            }
                        </Text>
                    </Section>
                    {
                        comment.length > 0 &&
                        <Section>
                            <Text className='text-lg'>
                                {email}
                            </Text>
                            <Text className="text-lg">
                                {comment}
                            </Text>
                        </Section>
                    }
                </Container>
            </Body>
        </Tailwind>
    </Html>
  );
  
  export default ProgressReportEmail;
  