import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// lvl 1 data seeding - no dependencies
import accountStatus from "./data/accountStatus"; // lvl 1
import accountType from "./data/accountType"; // lvl 1
import state from "./data/state"; // lvl 1
import agentType from "./data/agentType"; // lvl 1
import requestStatus from "./data/requestStatus"; // lvl 1
import documentType from "./data/documentType"; // lvl 1
import incidentType from "./data/incidentType"; // lvl 1
import incidentCategory from "./data/incidentCategory"; // lvl 1
import assessment from "./data/assessment"; // lvl 1
import questionType from "./data/questionType"; // lvl 1
import calendarEventType from "./data/calendarEventTypes"; // lvl 1
import requirementType from "./data/requirementType"; // lvl 1
import goalAchievmentStatus from "./data/goalAchievmentStatus"; // lvl 1
import goalType from "./data/goalType"; // lvl 1
import goal from "./data/goal"; // lvl 1

// lvl 2 data seeding - lvl 1 dependencies
// import policy from "./data/policy"; // lvl 2 - DocumentTypeId
// import question from "./data/questionDSM5Level1"; // lvl 2 - assessmentId, questionTypeId
// import question2 from "./data/questionAnxiety"; // lvl 2 - assessmentId, questionTypeId
// import question3 from "./data/questionSubstanceUse"; // lvl 2 - assessmentId, questionTypeId
// import question4 from "./data/questionDepression"; // lvl 2 - assessmentId, questionTypeId
// import question5 from "./data/questionAnger"; // lvl 2 - assessmentId, questionTypeId
// import question6 from "./data/questionMania"; // lvl 2 - assessmentId, questionTypeId
// import question7 from "./data/questionSomatic"; // lvl 2 - assessmentId, questionTypeId
// import question8 from "./data/questionSleep"; // lvl 2 - assessmentId, questionTypeId
// import question9 from "./data/questionRepetitive"; // lvl 2 - assessmentId, questionTypeId

// lvl 3 data seeding - lvl 2 dependencies
// import requiredPolicy from "./data/requiredPolicy"; // lvl 3 AccountTypeId, policyId

// lvl 5 data seeding - data TBD
// import location from "./data/location"; // currently not needed
// import price from "./data/price";

async function main() {
    // ***** level 1 seed scripts - these run first *****
    // // seed accountStatus
    // await prisma.accountStatus.createMany({ data: accountStatus });

    // // seed accountType
    // await prisma.accountType.createMany({ data: accountType });

    // // seed state
    // await prisma.state.createMany({ data: state });

    // // seed agentType
    // await prisma.agentType.createMany({ data: agentType });

    // // seed requestStatus
    // await prisma.requestStatus.createMany({ data: requestStatus });

    // // seed documentType
    // await prisma.documentType.createMany({ data: documentType });

    // // seed incidentType
    // await prisma.incidentType.createMany({ data: incidentType });

    // // seed incidentCategory
    // await prisma.incidentCategory.createMany({ data: incidentCategory });

    // // seed assessment
    // await prisma.assessment.createMany({ data: assessment });

    // // seed questionType
    // await prisma.questionType.createMany({ data: questionType });

    // // seed calendarEventType
    // await prisma.calendarEventType.createMany({ data: calendarEventType });

    // // seed requirement types
    // await prisma.requirementType.createMany({ data: requirementType });

    // // seed goal achievment status
    // await prisma.goalAchievmentStatus.createMany({ data: goalAchievmentStatus });

    // // seed goal type
    // await prisma.goalTypes.createMany({ data: goalType });

    // // seed goal
    // await prisma.goal.createMany({ data: goal });

    // // seed demogrpahic
    // await prisma.demographic.create({ data: { native: 0, asian: 0, black: 0, hispanic: 0, islander: 0, white: 0, multi: 0, not: 0 } });

    // ***** end level 1 seed scripts *****



    // ***** level 2 seed scripts - these run second and have level 1 dependencies.  Need to update the ids before running! *****
    // // seed policy
    // await prisma.policy.createMany({ data: policy });

    // // seed dsm level 5 questions
    // await prisma.question.createMany({ data: question });

    // // seed anxiety questions
    // await prisma.question.createMany({ data: question2 });

    // // seed substance use questions
    // await prisma.question.createMany({ data: question3 });

    // // seed depression questions
    // await prisma.question.createMany({ data: question4 });

    // // seed anger questions
    // await prisma.question.createMany({ data: question5 });

    // // seed mania questions
    // await prisma.question.createMany({ data: question6 });

    // // seed somatic questions
    // await prisma.question.createMany({ data: question7 });

    // // seed sleep questions
    // await prisma.question.createMany({ data: question8 });

    // // seed repetitive questions
    // await prisma.question.createMany({ data: question9 });

    // ***** end level 2 seed scripts *****



    // ***** level 3 seed scripts - these run third and have level 2 dependencies.  Need to update ids before running! *****
    // // seed requiredPolicies
    // await prisma.requiredPolicies.createMany({ data: requiredPolicies });

    // ***** end level 3 seed scripts *****



    // ***** level 5 seed scripts - This data is TBD *****
    // // seed location
    // await prisma.location.createMany({ data: location });

    // // seed prices
    // await prisma.price.createMany({ data: price });

    // ***** end level 5 seed scripts *****
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
});