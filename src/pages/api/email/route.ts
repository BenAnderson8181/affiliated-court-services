import { Resend } from 'resend';
import { env } from "~/env.mjs";
import { NextApiRequest, NextApiResponse } from 'next';
import WelcomeEmail from "~/emails/welcome";
import ProgressReportEmail from "~/emails/progressReport";
import Cancelled from "~/emails/cancelled";
import Booked from "~/emails/booked";

const resend = new Resend(env.RESEND_API_KEY);

// change this back to POST when done testing
export default async function GET(request: NextApiRequest, response: NextApiResponse) {
    // console.log('request: ', request)

    const email = 'banderson.mobile@gmail.com';
    const params = { type: 'Cancelled', firstName: 'Ben', lastName: 'Anderson' , accountId: '', appointmentDate: new Date(), time: '12:00', appointmentType: 'Group', comment: 'Lame comment', requirements: [] }
    // let emailProps;

    if (request) {
        // emailProps = await request.body;
        // console.log('body: ', emailProps)
        // console.log('query: ', request.query)
    }

    let data;
    try {
        if (!email)
            throw new Error('Email address is invalid');

        switch (params.type) {
            case 'Welcome':
                data = await resend.sendEmail({
                    from: 'onboarding@resend.dev',
                    to: 'ben@priorsolutionsllc.com',
                    subject: 'Welcome to ACS',
                    react: WelcomeEmail({
                        firstName: params?.firstName,
                        lastName: params?.lastName,
                        accountId: params?.accountId
                    })
                });

                break;

            case 'Progress':
                data = await resend.sendEmail({
                    from: 'onboarding@resend.dev',
                    to: 'ben@priorsolutionsllc.com',
                    subject: 'Client Progress Report',
                    react: ProgressReportEmail({
                        firstName: params?.firstName,
                        lastName: params?.lastName,
                        comment: params?.comment,
                        requirements: params?.requirements
                    })
                });

                break;

            case 'Booked':
                data = await resend.sendEmail({
                    from: 'onboarding@resend.dev',
                    to: 'ben@priorsolutionsllc.com',
                    subject: 'Your Appointment Is Confirmed',
                    react: Booked({
                        firstName: params?.firstName,
                        lastName: params?.lastName,
                        accountId: params?.accountId,
                        appointmentDate: params?.appointmentDate,
                        time: params?.time,
                        appointmentType: params?.appointmentType
                    })
                });

                break;

            case 'Cancelled':
                data = await resend.sendEmail({
                    from: 'onboarding@resend.dev',
                    to: 'ben@priorsolutionsllc.com',
                    subject: 'Your Appointment Is Cancelled',
                    react: Cancelled({
                        firstName: params?.firstName,
                        lastName: params?.lastName,
                        accountId: params?.accountId,
                        appointmentDate: params?.appointmentDate,
                        time: params?.time,
                        appointmentType: params?.appointmentType
                    })
                });

                break;

            default:
                data = await resend.sendEmail({
                    from: 'onboarding@resend.dev',
                    to: 'ben@priorsolutionsllc.com',
                    subject: 'Test',
                    react: WelcomeEmail({
                        firstName: 'John',
                        lastName: 'Doe',
                        accountId: ''
                    })
                });

                break;
        }

        return response.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        
        return response.status(400).json(error);
    }
}