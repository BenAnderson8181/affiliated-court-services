import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";

export const clientProgressRouter = createTRPCRouter({
    getNextStep: protectedProcedure
        .input(
            z.object({
                accountId: z.string().optional(),
                externalId: z.string().optional()
            })
        )
        .query(async ({ctx, input}) => {
            if (!input.accountId && !input.externalId)
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Either an account id or external id must be passed.' });

            let clientId = input.accountId;
            if (!clientId) {
                const account = await ctx.prisma.account.findUnique({
                    where: {
                        externalId: input.externalId
                    }
                });

                if (!account)
                    throw new TRPCError({ code: 'NOT_FOUND', message: 'Failed to find an account.' });

                clientId = account.id;
            }

            const accountTypes = await ctx.prisma.accountType.findMany();

            const clientTypeId = accountTypes.filter(type => type.name === 'Client')[0]?.id;

            if (!clientTypeId)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find the client account type.' });

            const requiredPolicies = await ctx.prisma.requiredPolicies.findMany({ where: { accountTypeId: clientTypeId } });
            const accountPolicies = await ctx.prisma.accountPolicies.findMany({ where: { accountId: clientId } });

            let policiesNeeded = false;
            for (const required of requiredPolicies ?? []) {
                const found = accountPolicies?.find((ap) => ap.policyId === required.policyId);
                if (!found) {
                    policiesNeeded = true;
                    break;
                }

                if (found.signed === false) {
                    policiesNeeded = true;
                    break;
                }
            }

            if (policiesNeeded)
                return 'policies';

            // If policies are all signed and up to date, check for incident report
            const incidents = await ctx.prisma.incident.findMany({ where: { accountId: clientId } });

            if (incidents === undefined || incidents == null || incidents.length === 0)
                return 'incident report';

            const incompleteIncidents = incidents.filter((i) => i.completed !== true);
            if (incompleteIncidents.length > 0)
                return 'incident report';

            const requiredIncidents = await ctx.prisma.requireIncident.findMany({ where: { clientId, completed: false }});
            
            if (requiredIncidents.length > 0)
                return 'incident report';

            // release of information and criminal background check are conditionally required based on incident type
            // the next section of code is here to see if they have been signed or rejected but only self referred allows them to continue if rejected
            // as we need to be able to release information to the appropriate referring agency
            const laterPolicies = await ctx.prisma.policy.findMany({
                where: {
                    OR: [
                        {
                            title: 'Release of Information'
                        },
                        {
                            title: 'Criminal Background'
                        }
                    ]
                }
            });

            const releaseOfInformation = laterPolicies.find((p) => p.title === 'Release of Information');
            const criminalBackground = laterPolicies.find((p) => p.title === 'Criminal Background');

            if (!releaseOfInformation?.id || !criminalBackground?.id)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find later policies.' });

            const laterPoliciesNeeded = await ctx.prisma.accountPolicies.findMany({
                where: {
                    OR: [
                        {
                            accountId: clientId,
                            policyId: releaseOfInformation.id
                        },
                        {
                            accountId: clientId,
                            policyId: criminalBackground.id
                        }
                    ]
                },
            });

            const laterReleaseOfInformation = laterPoliciesNeeded.find((p) => p.policyId === releaseOfInformation.id);
            if (!laterReleaseOfInformation)
                return 'release of information';

            
                
            const laterCriminalBackground = laterPoliciesNeeded.find((p) => p.policyId === criminalBackground.id);
            if (!laterCriminalBackground)
                return 'criminal background';

            const incidentTypes = await ctx.prisma.incidentType.findMany();
            const selfReferred = incidentTypes.find((t) => t.name === 'Self Referred');

            if (!selfReferred?.id)
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Unable to find incident type.' });

            const latestIncident = incidents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

            if (laterReleaseOfInformation?.signed !== true) {
                if (latestIncident?.incidentTypeId !== selfReferred.id) {
                    return 'release of information';
                }
                else {
                    if (laterReleaseOfInformation?.rejected !== true)
                        return 'release of information';
                }
            }

            if (laterCriminalBackground?.signed !== true) {
                if (latestIncident?.incidentTypeId !== selfReferred.id) {
                    return 'criminal background';
                }
                else {
                    if (laterCriminalBackground?.rejected !== true)
                        return 'criminal background';
                }
            }

            // If incident reports check is passed and later policies are passed, check for assessments
            const requiredAssessments = await ctx.prisma.requiredAssessments.findMany({ where: { accountId: clientId, completed: false } });
            
            if (requiredAssessments?.length > 0)
                return 'assessments';

            // If assessments check is passed, check for evaluation
            const clientCalendarEvents = await ctx.prisma.clientCalendarEvent.findMany({ where: { accountId: clientId }, include: { calendarEvent: true} });
            if (clientCalendarEvents.length === 0)
                return 'evaluation';
                
            const calendarEventTypes = await ctx.prisma.calendarEventType.findMany();
            const interviewType = calendarEventTypes.find((t) => t.name === 'Interview');
            const completedClientInterviews = clientCalendarEvents.find((e) => e.calendarEvent.calendarEventTypeId === interviewType?.id && e.attended === true);

            if (!completedClientInterviews)
                return 'evaluation';

            // TODO: Do we need to re-think this or does this just happen in workshops/groups??
            // Check for any required unfinished goals
            // const requiredGoals = await ctx.prisma.requiredGoals.findMany({ where: { accountId: clientId } });

            // if (requiredGoals?.length > 0)
            //     return 'goals';

            // If no next step needed return empty string
            return '';
        }
    ),
})