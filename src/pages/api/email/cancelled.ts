import { Resend } from 'resend';
import { env } from "~/env.mjs";
import type { NextApiRequest, NextApiResponse } from 'next';
import Cancelled from "~/emails/cancelled";

const resend = new Resend(env.RESEND_API_KEY);

type CancelledEmailProps = {
    firstName: string;
    lastName: string;
    accountId: string;
    email: string;
    appointmentDate?: Date;
    time?: string;
    appointmentType?: string;
}

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
    const params: CancelledEmailProps = { firstName: 'Ben', lastName: 'Anderson', accountId: '', email: 'ben@priorsolutionsllc.com', appointmentDate: new Date(), time: '12:00', appointmentType: 'Group' }

    // let emailProps;
    if (request) {
        // emailProps = await request.body;
        // console.log('body: ', emailProps)
        // console.log('query: ', request.query)
    }

    try {
        const data = await resend.sendEmail({
            from: 'onboarding@resend.dev',
            to: params?.email,
            subject: 'Your Appointment Is Confirmed',
            react: Cancelled({
                firstName: params?.firstName,
                lastName: params?.lastName,
                accountId: params?.accountId,
                appointmentDate: params?.appointmentDate,
                time: params?.time,
                appointmentType: params?.appointmentType
            })
        });

        return response.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        
        return response.status(500).json(error);
    } 
}