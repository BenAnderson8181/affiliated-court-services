import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

// import { accountStatusRouter } from "~/server/api/routers/accountStatus";
// import { accountTypeRouter } from "~/server/api/routers/accountType";
// import { accountRouter } from "~/server/api/routers/account";
// import { stateRouter } from "./routers/state";
// import { locationRouter } from "./routers/location";
// import { agentTypeRouter } from "./routers/agentType";
// import { accountRequestRouter } from "./routers/accountRequest";
// import { requestStatusRouter } from "./routers/requestStatus";
// import { accountSignatureRouter } from "./routers/accountSignature";
// import { documentRouter } from "./routers/document";
// import { documentLogRouter } from "./routers/documentLog";
// import { policyRouter } from "./routers/policy";
// import { accountPolicyRouter } from "./routers/accountPolicy";
// import { requiredPoliciesRouter } from "./routers/requiredPolicies";
// import { clientProgressRouter } from "./routers/clientProgress";
// import { incidentTypeRouter } from "./routers/incidentType";
// import { uploadErrorLogRouter } from "./routers/uploadErrorLog";
// import { incidentRouter } from "./routers/incident";
// import { documentTypeRouter } from "./routers/documentType";
// import { incidentCategoryRouter } from "./routers/incidentCategory";
// import { requiredAssessmentsRouter } from "./routers/requiredAssessments";
// import { assessmentRouter } from "./routers/assessment";
// import { questionRouter } from "./routers/question";
// import { clientAssessmentAnswersRouter } from "./routers/clientAssessmentAnswers";
// import { domainScoreCardRouter } from "./routers/domainScoreCard";
// import { calendarEventRouter } from "./routers/calendatEvent";
// import { calendarEventTypeRouter } from "./routers/calendarEventType";
// import { clientCalendarEventRouter } from "./routers/clientCalendarEvent";
// import { clientAccessLimitRouter } from "./routers/clientAccessLimit";
// import { requireIncidentRouter } from "./routers/requireIncident";
// import { requirementTypeRouter } from "./routers/requirementType";
// import { clientRequirementRouter } from "./routers/clientRequirements";
// import { priceRouter } from "./routers/price";
// import { clientPriceRouter } from "./routers/clientPrice";
// import { messageRouter } from "./routers/message";
// import { clinicalNoteRouter } from "./routers/clinicalNote";
// import { contactRouter } from "./routers/contact";
// import { discountPriceRouter } from "./routers/discountPrice";
// import { accountFinancialRouter } from "./routers/accountFinancial";
// import { demographicRouter } from "./routers/demographic";
// import { requiredGoalsRouter } from "./routers/requireGoals";
// import { goalRouter } from "./routers/goal";
// import { clientGoalAnswerRouter } from "./routers/clientGoalAnswer";
// import { goalAchievementStatusRouter } from "./routers/goalAchievementStatus";
// import { clientListRouter } from "./routers/clientList";
// import { clientAlertRouter } from "./routers/clientAlert";
// import { clientParticipationNoteRouter } from "./routers/clientParticipationNote";

export const appRouter = createTRPCRouter({
    // accountStatus: accountStatusRouter,
    // accountType: accountTypeRouter,
    // account: accountRouter,
    // state: stateRouter,
    // location: locationRouter,
    // agentType: agentTypeRouter,
    // accountRequest: accountRequestRouter,
    // requestStatus: requestStatusRouter,
    // accountSignature: accountSignatureRouter,
    // document: documentRouter,
    // documentLog: documentLogRouter,
    // policy: policyRouter,
    // accountPolicy: accountPolicyRouter,
    // requiredPolicies: requiredPoliciesRouter,
    // clientProgress: clientProgressRouter,
    // incidentType: incidentTypeRouter,
    // uploadErrorLog: uploadErrorLogRouter,
    // incident: incidentRouter,
    // documentType: documentTypeRouter,
    // incidentCategory: incidentCategoryRouter,
    // requiredAssessments: requiredAssessmentsRouter,
    // assessment: assessmentRouter,
    // question: questionRouter,
    // clientAssessmentAnswers: clientAssessmentAnswersRouter,
    // domainScoreCard: domainScoreCardRouter,
    // calendarEvent: calendarEventRouter,
    // calendarEventType: calendarEventTypeRouter,
    // clientCalendarEvent: clientCalendarEventRouter,
    // clientAccessLimit: clientAccessLimitRouter,
    // requireIncident: requireIncidentRouter,
    // requirementType: requirementTypeRouter,
    // clientRequirement: clientRequirementRouter,
    // price: priceRouter,
    // clientPrice: clientPriceRouter,
    // message: messageRouter,
    // clinicalNote: clinicalNoteRouter,
    // contact: contactRouter,
    // discountPrice: discountPriceRouter,
    // accountFinancial: accountFinancialRouter,
    // demographic: demographicRouter,
    // requiredGoal: requiredGoalsRouter,
    // goal: goalRouter,
    // clientGoalAnswer: clientGoalAnswerRouter,
    // goalAchievementStatus: goalAchievementStatusRouter,
    // clientList: clientListRouter,
    // clientAlert: clientAlertRouter,
    // clientParticipationNote: clientParticipationNoteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
