import { Resend } from 'resend';
import { env } from "~/env.mjs";
import type { NextApiRequest, NextApiResponse } from 'next';
import WelcomeEmail from "~/emails/welcome";

const resend = new Resend(env.RESEND_API_KEY);

type WelcomeEmailProps = {
    firstName: string;
    lastName: string;
    accountId: string;
    email: string;
}

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
    const params: WelcomeEmailProps = { firstName: 'Ben', lastName: 'Anderson', accountId: '', email: 'ben@priorsolutionsllc.com' }

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
            subject: 'Welcome to ACS',
            react: WelcomeEmail({
                firstName: params?.firstName,
                lastName: params?.lastName,
                accountId: params?.accountId
            })
        });

        return response.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        
        return response.status(500).json(error);
    } 
}