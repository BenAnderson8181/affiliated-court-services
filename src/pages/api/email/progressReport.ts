import { Resend } from 'resend';
import { env } from "~/env.mjs";
import { NextApiRequest, NextApiResponse } from 'next';
import ProgressReport from "~/emails/progressReport";

const resend = new Resend(env.RESEND_API_KEY);

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

export default async function POST(request: NextApiRequest, response: NextApiResponse) {
    const _requirements = [
        { fulfilled: 2, required: 8, requirementType: 'Individual'},
        { fulfilled: 6, required: 24, requirementType: 'SUD Group'},
        { fulfilled: 1, required: 1, requirementType: 'Orientation Workshop'},
        { fulfilled: 0, required: 1, requirementType: 'Aggreesive Driving Workshop'},
        { fulfilled: 0, required: 1, requirementType: 'Prime for Life'},
    ]
    const params: ProgressReportProps = { firstName: 'Ben', lastName: 'Anderson', email: 'ben@priorsolutionsllc.com', comment: 'Has been an active participant in groups.  Seems to be getting the concepts.', percentComplete: 26.2, requirements: _requirements }

    // let emailProps;
    if (request) {
        // emailProps = await request.body;
        // console.log('body: ', emailProps)
        // console.log('query: ', request.query)
    }

    try {
        const data = await resend.sendEmail({
            from: 'onboarding@resend.dev',
            to: params?.email ?? 'ben@priorsolutionsllc.com',
            subject: 'Progress Report',
            react: ProgressReport({
                firstName: params?.firstName,
                lastName: params?.lastName,
                email: params?.email,
                comment: params?.comment,
                percentComplete: params?.percentComplete,
                requirements: params?.requirements
            })
        });

        return response.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        
        return response.status(500).json(error);
    } 
}