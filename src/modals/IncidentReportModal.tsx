import React, { useState } from "react";
import { api } from "~/utils/api";
import { UploadButton , UploadDropzone } from "@uploadthing/react"; 
import type { OurFileRouter } from "../server/uploadThing";
import "@uploadthing/react/styles.css";
import Loading from "~/components/Loading";
import LoadError from "~/components/LoadError";

type Props = {
    clientId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    refetchNextStep: () => void;
}

const IncidentReportModal = ({clientId, onClose, refetchNextStep}: Props) => {
    const [typeSelected, setTypeSelected] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [showUploadError, setShowUploadError] = useState(false);
    const [showSaveError, setShowSaveError] = useState(false);
    const [showCategoryError, setShowCategoryError] = useState(false);
    const [showCommentError, setShowCommentError] = useState(false);
    const [showAssessmentError, setShowAssessmentError] = useState(false);
    const [showGoalError, setShowGoalError] = useState(false);
    const [text, setText] = useState('');
    const [domesticViolence, setDomesticViolence] = useState(false);
    const [cognitiveRestructuring, setCognitiveRestructuring] = useState(false);
    const [drugAndAlcohol, setDrugAndAlcohol] = useState(false);
    const [mentalHealth, setMentalHealth] = useState(false);
    const [other, setOther] = useState(false);
    const [showUploadSuccess, setShowUploadSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const incidentTypeQuery = api.incidentType.list.useQuery();
    const documentTypeQuery = api.documentType.list.useQuery();
    const incidentCategoryQuery = api.incidentCategory.list.useQuery();
    const assessments = api.assessment.list.useQuery();
    const requiredIncidentsQuery = api.requireIncident.clientList.useQuery({ clientId });
    const goalsQuery = api.goal.list.useQuery();
    const uploadErrorLogMutation = api.uploadErrorLog.create.useMutation();
    const incidentMutation = api.incident.upsert.useMutation(); // This intentionally updates instead of creates a new one if within 3 days
    const documentLogMutation = api.documentLog.create.useMutation();
    const documentLogUpdateMutation = api.documentLog.update.useMutation();
    const documentMutation = api.document.create.useMutation();
    const requiredAssessmentsCreate = api.requiredAssessments.create.useMutation();
    const requiredIncidentCompleteMutation = api.requireIncident.complete.useMutation();
  
    if (incidentTypeQuery.isLoading || documentTypeQuery.isLoading || incidentCategoryQuery.isLoading || assessments.isLoading || requiredIncidentsQuery.isLoading || goalsQuery.isLoading) {
        return <Loading type='Modal' />
    }

    if (incidentTypeQuery.isError || documentTypeQuery.isError || incidentCategoryQuery.isError || assessments.isError || requiredIncidentsQuery.isError || goalsQuery.isError) {
        if (incidentTypeQuery.isError)
            console.error('incidentType: ', incidentCategoryQuery.error?.message)
        if (documentTypeQuery.isError)
            console.error('documentType: ', documentTypeQuery.error?.message)
        if (incidentCategoryQuery.isError)
            console.error('incident category: ', incidentCategoryQuery.error?.message)
        if (assessments.isError)
            console.error('assessments: ', assessments.error?.message)
        if (requiredIncidentsQuery.isError)
            console.error('required assessments: ', requiredIncidentsQuery.error?.message)
        if (goalsQuery.isError)
            console.error('goals query: ', goalsQuery.error?.message)
        return <LoadError type='Modal' />
    }

    const incidentTypes = incidentTypeQuery.data;
    const documentTypes = documentTypeQuery.data;

    const courtDocumentTypeId = documentTypes.find((d) => d.name === 'Court')?.id;

    if (!courtDocumentTypeId) {
        return <LoadError type='Modal' />
    }

    const requiredIncidents = requiredIncidentsQuery.data;

    const handleSelectIncidentReport = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTypeSelected(true);
        setSelectedType(e.target.value)
    }

    const handleCommentSave = async () => {
        if (!isProcessing) {
            setIsProcessing(() => true);
            if (domesticViolence ===  false && cognitiveRestructuring === false && drugAndAlcohol === false && mentalHealth === false && other === false) {
                setShowCategoryError(true);
                return;
            }

            if (text.length < 100) {
                setShowCategoryError(false);
                setShowCommentError(true);
                return;
            }

            const level1AssessmentId = assessments.data?.find((assessment) => assessment.name === 'DSM-5 Self Rated')?.id;
            if (!level1AssessmentId) {
                setShowCategoryError(false);
                setShowCommentError(false);
                setShowAssessmentError(true);
                return;
            }

            const orientationGoalId = goalsQuery.data?.find((goal) => goal.name === 'Orientation')?.id;
            if (!orientationGoalId) {
                setShowCategoryError(false);
                setShowCommentError(false);
                setShowAssessmentError(false);
                setShowGoalError(true);
                return;
            }

            // clear any errors on successful pass
            setShowCategoryError(false);
            setShowCommentError(false);
            setShowAssessmentError(false);
            setShowGoalError(false);

            const requiredIncidentsCount = requiredIncidents != undefined ? requiredIncidents.length : 0;

            const result = await incidentMutation.mutateAsync({
                accountId: clientId,
                incidentTypeId: selectedType,
                comment: text,
                completed: true,
                domesticViolence: domesticViolence,
                cognitiveRestructure: cognitiveRestructuring,
                drugsAlcohol: drugAndAlcohol,
                mentalHealth: mentalHealth,
                other: other
            })
            .catch((error) => {
                setShowSaveError(true);
                console.error(error);
            });

            let assessmentResult = true;
            if (requiredIncidentsCount === 0) {
                await requiredAssessmentsCreate.mutateAsync({
                    clientId: clientId,
                    assessmentId: level1AssessmentId,
                })
                .catch((err) => {
                    assessmentResult = false;
                    setShowSaveError(true);
                    console.error(err);
                });
            }

            let requiredIncidentsResult = true;
            if (requiredIncidentsCount > 0) {
                for (let i = 0; i < requiredIncidentsCount; ++i) {
                    const id = requiredIncidents[i]?.id;
                    if (id) {
                        await requiredIncidentCompleteMutation.mutateAsync({
                            id
                        })
                        .catch((err) => {
                            requiredIncidentsResult = false;
                            setShowSaveError(true);
                            console.error(err);
                        });
                    }
                }
            }

            if (result && requiredIncidentsResult && assessmentResult) {
                onClose(false);
                setIsProcessing(() => false);
                // if this does not get the next progress to update consistently then we need to try to break the nextstepsquery cache
                refetchNextStep();
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    const handleDomesticViolenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setDomesticViolence(true);
        } else {
            setDomesticViolence(false);
        }
    }

    const handleDrugAndAlcoholChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setDrugAndAlcohol(true);
        } else {
            setDrugAndAlcohol(false);
        }
    }

    const handleCognitiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setCognitiveRestructuring(true);
        } else {
            setCognitiveRestructuring(false);
        }
    }

    const handleMentalHealthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setMentalHealth(true);
        } else {
            setMentalHealth(false);
        }
    }

    const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setOther(true);
        } else {
            setOther(false);
        }
    }

    const saveFileToDB = async (fileURL: string, fileName: string, fileKey: string, fileSize: number) => {
        // Save to the Document Log
        const documentLog = await documentLogMutation.mutateAsync({
            accountId: clientId,
            url: fileURL,
            name: fileName,
            key: fileKey,
            size: fileSize,
            action: 'Incident Report Upload'
        })
        .catch((err) => {
            console.error(err);
            setShowSaveError(true);
            return;
        });

        // Save the Document to the client
        documentMutation.mutateAsync({
            accountId: clientId,
            url: fileURL,
            name: fileName,
            key: fileKey,
            size: fileSize,
            documentTypeId: courtDocumentTypeId,
        })
        .catch((err) => {
            console.error(err);
            setShowSaveError(true);
            if (documentLog?.id) {
                documentLogUpdateMutation.mutateAsync({
                    id: documentLog?.id,
                    action: 'Incident Report Upload Failed'
                })
                .catch((err) => {
                    console.error(err);
                    setShowSaveError(true);
                    return;
                });
            }
            return;
        });

        setShowUploadSuccess(true);
        setTimeout(() => {
            setShowUploadSuccess(false);
        }, 5000);
    }

    const getTitle = () => {
        if (selectedType == incidentTypes?.find((incidentType) => incidentType.name === 'Court Referred')?.id)
            return 'Court Referred Incident Report';

        if (selectedType == incidentTypes?.find((incidentType) => incidentType.name === 'DCFS Referred')?.id)
            return 'DCFS Referred Incidend Report';

        if (selectedType == incidentTypes?.find((incidentType) => incidentType.name === 'Employer Referred')?.id)
            return 'Employer Referred Incident Report';

        if (selectedType == incidentTypes?.find((incidentType) => incidentType.name === 'Self Referred')?.id)
            return 'Self Referred Incident Report';

        return 'Incident Report';
    }

    const title = getTitle();

    return (
        <div className="w-full">
            <div className="flex flex-row justify-center mb-2 text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md pb-6">{title}</div>
            <div className="px-4">
                <div>
                    {
                    !typeSelected &&
                    <>
                        <p className="flex justify-center text-2xl italic mb-2">You will need to select the incident type that matches your case.</p>
                        <p className="text-xl mb-2">Be advised the selected type will be used to create the type of certificate of completion you receive upon completing your requirements.</p>
                        <p className="text-xl">If you are court referred we will need the police report to give a certificate of completion which can be uploaded now or at a later point if you do not have it ready.</p>
                        <br />
                        <p><span className="font-semibold text-xl">• Court Referred:</span> This type we will need a police report to be uploaded and we give you room for your comments.</p>
                        <p><span className="font-semibold text-xl">• DCFS Referred:</span> This type will need a family plan or a similar document from DCFS to be uploaded and we give you room for your comments.</p>
                        <p><span className="font-semibold text-xl">• Employer Referred:</span> This type has the option to add a document or letter from your employer and a place for you to add your comments.</p>
                        <p><span className="font-semibold text-xl">• Self Referred:</span> This type has a place for you to add your comments.</p>
                    </>
                    }
                </div>
                { 
                    !typeSelected &&
                    <div className="my-4">
                        <select className="w-full border border-slate-700 rounded-md shadow-purple-900 shadow-sm p-2 text-xl" onChange={handleSelectIncidentReport}>
                            <option value="">Select Incident Type</option>
                            {
                                incidentTypes?.map((incidentType) => (
                                    <option key={incidentType.id} value={incidentType.id}>{incidentType.name}</option>
                                ))
                            }
                        </select>
                    </div>
                }
                {
                    selectedType == incidentTypes?.find((incidentType) => incidentType.name === 'Court Referred')?.id &&
                    <>
                        <div className="mt-4">
                            <div className="mt-4">
                                <p className="flex justify-center font-medium text-lg">Check all applicable boxes below to indicate the type of evaluation you are required to complete.  It is your responsibility to know which evaluation is required.  If you don&apos;t know then refer to your court order.</p>
                                <div className="flex justify-between mt-4 px-4">
                                    <div className="font-bold"><label>Domestic Violence:&nbsp;&nbsp;<input type="checkbox" onChange={handleDomesticViolenceChange} className="m-auto"></input></label></div>
                                    <div className="font-bold"><label>Drug and Alcohol:&nbsp;&nbsp;<input type="checkbox" onChange={handleDrugAndAlcoholChange}></input></label></div>
                                    <div className="font-bold"><label>Cognitive Restructuring:&nbsp;&nbsp;<input type="checkbox" onChange={handleCognitiveChange}></input></label></div>
                                    <div className="font-bold"><label>Mental Health:&nbsp;&nbsp;<input type="checkbox" onChange={handleMentalHealthChange}></input></label></div>
                                    <div className="font-bold"><label>Other:&nbsp;&nbsp;<input type="checkbox" onChange={handleOtherChange}></input></label></div>
                                </div>
                            </div>
                            <p className="flex justify-center font-medium text-lg mt-4">Upload any related documents: police report, BCI, DCFS family plan, etc.</p>
                            <p className="flex justify-center font-medium text-lg mt-4">A police report is required for a Domestic Violence certificate of completion.  If you don&apos;t have it yet you can upload it later. Be advised, new information in the police report may change your requirements.</p>
                            <div className="mt-6"> 
                                <UploadButton<OurFileRouter>
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        if (res !== undefined && res.length > 0) {
                                            const fileURL = res[0]?.url;
                                            const fileName = res[0]?.name;
                                            const fileKey = res[0]?.key;
                                            const fileSize = res[0]?.size;

                                            if (fileURL && fileName && fileKey && fileSize) {
                                                saveFileToDB(fileURL, fileName, fileKey, fileSize);
                                                return;
                                            }
                                            
                                            // set file import error if we reach here
                                            setShowUploadError(true);
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        setShowUploadError(true);
                                        uploadErrorLogMutation.mutate({
                                            accountId: clientId,
                                            error: error.message,
                                            url: 'IncidentReportModal - Court Referred'
                                        });
                                        console.error(`ERROR! ${error.message}`);
                                    }}
                                />
                            </div>
                            <div>
                                <UploadDropzone<OurFileRouter>
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        if (res !== undefined && res.length > 0) {
                                            const fileURL = res[0]?.url;
                                            const fileName = res[0]?.name;
                                            const fileKey = res[0]?.key;
                                            const fileSize = res[0]?.size;

                                            if (fileURL && fileName && fileKey && fileSize) {
                                                saveFileToDB(fileURL, fileName, fileKey, fileSize);
                                                return;
                                            }
                                            
                                            // set file import error if we reach here
                                            setShowUploadError(true);
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        setShowUploadError(true);
                                        uploadErrorLogMutation.mutate({
                                            accountId: clientId,
                                            error: error.message,
                                            url: 'IncidentReportModal - Court Referred'
                                        });
                                        console.log(`ERROR! ${error.message}`);
                                    }}
                                />
                            </div>
                            <p className="flex justify-center font-medium text-lg mt-4">We have provided an area for you to add your comments on the incident</p>
                            <div>
                                <textarea className="w-full h-48 border border-gray-300 rounded-md shadow-sm shadow-purple-900 p-2 mt-4" placeholder="Give a description of the incident and add any comments you wish to make." onChange={handleChange} value={text} />
                            </div>
                            <div className="mb-4 flex justify-end">
                                <button className="bg-slate-100 text-slate-700 border border-indigo-700 rounded-md shadow-sm shadow-purple-900 p-2 mt-4 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleCommentSave}>Submit</button>
                            </div>
                        </div>
                    </>
                }
                {
                    selectedType == incidentTypes?.find((incidentType) => incidentType.name === 'DCFS Referred')?.id &&
                    <>
                        <div className="mt-4">
                            <div className="mt-4">
                                <p className="flex justify-center font-medium text-lg">Check all applicable boxes below to indicate the type of evaluation you are required to complete.  It is your responsibility to know which evaluation is required.  If you don&apos;t know then refer to your court order.</p>
                                <div className="flex justify-between mt-4 px-4">
                                <div className="font-bold"><label>Domestic Violence:&nbsp;&nbsp;<input type="checkbox" onChange={handleDomesticViolenceChange} className="m-auto"></input></label></div>
                                    <div className="font-bold"><label>Drug and Alcohol:&nbsp;&nbsp;<input type="checkbox" onChange={handleDrugAndAlcoholChange}></input></label></div>
                                    <div className="font-bold"><label>Cognitive Restructuring:&nbsp;&nbsp;<input type="checkbox" onChange={handleCognitiveChange}></input></label></div>
                                    <div className="font-bold"><label>Mental Health:&nbsp;&nbsp;<input type="checkbox" onChange={handleMentalHealthChange}></input></label></div>
                                    <div className="font-bold"><label>Other:&nbsp;&nbsp;<input type="checkbox" onChange={handleOtherChange}></input></label></div>
                                </div>
                            </div>
                            <p className="flex justify-center font-medium text-lg mt-4">Upload any related documents: police report, BCI, DCFS family plan, etc.</p>
                            <div className="mt-6"> 
                                <UploadButton<OurFileRouter>
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        if (res !== undefined && res.length > 0) {
                                            const fileURL = res[0]?.url;
                                            const fileName = res[0]?.name;
                                            const fileKey = res[0]?.key;
                                            const fileSize = res[0]?.size;

                                            if (fileURL && fileName && fileKey && fileSize) {
                                                saveFileToDB(fileURL, fileName, fileKey, fileSize);
                                                return;
                                            }
                                            
                                            // set file import error if we reach here
                                            setShowUploadError(true);
                                        }
                                    }}
                                        onUploadError={(error: Error) => {
                                            setShowUploadError(true);
                                            uploadErrorLogMutation.mutate({
                                                accountId: clientId,
                                                error: error.message,
                                                url: 'IncidentReportModal - DCFS Referred'
                                            });
                                            console.error(`ERROR! ${error.message}`);
                                        }}
                                />
                            </div>
                            <div>
                                <UploadDropzone<OurFileRouter>
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        if (res !== undefined && res.length > 0) {
                                            const fileURL = res[0]?.url;
                                            const fileName = res[0]?.name;
                                            const fileKey = res[0]?.key;
                                            const fileSize = res[0]?.size;

                                            if (fileURL && fileName && fileKey && fileSize) {
                                                saveFileToDB(fileURL, fileName, fileKey, fileSize);
                                                return;
                                            }
                                            
                                            // set file import error if we reach here
                                            setShowUploadError(true);
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        setShowUploadError(true);
                                        uploadErrorLogMutation.mutate({
                                            accountId: clientId,
                                            error: error.message,
                                            url: 'IncidentReportModal - DCFS Referred'
                                        });
                                        console.error(`ERROR! ${error.message}`);
                                    }}
                                />
                            </div>
                            <p className="flex justify-center font-medium text-lg mt-4">We have provided an area for you to add your comments on the incident</p>
                            <div>
                                <textarea className="w-full h-48 border border-gray-300 rounded-md shadow-sm shadow-purple-900 p-2 mt-4" placeholder="Give a description of the incident and add any comments you wish to make." onChange={handleChange} value={text} />
                            </div>
                            <div className="mb-4 flex justify-end">
                                <button className="bg-slate-100 text-slate-700 border border-indigo-700 rounded-md shadow-sm shadow-purple-900 p-2 mt-4 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleCommentSave}>Submit</button>
                            </div>
                        </div>
                    </>
                }
                {
                    selectedType == incidentTypes?.find((incidentType) => incidentType.name === 'Employer Referred')?.id &&
                    <>
                        <div className="mt-4">
                            <div className="mt-4">
                                <p className="flex justify-center font-medium text-lg">Check all applicable boxes below to indicate the type of evaluation you are required to complete.  It is your responsibility to know which evaluation is required.  If you don&apos;t know then refer to your court order.</p>
                                <div className="flex justify-between mt-4 px-4">
                                <div className="font-bold"><label>Domestic Violence:&nbsp;&nbsp;<input type="checkbox" onChange={handleDomesticViolenceChange} className="m-auto"></input></label></div>
                                    <div className="font-bold"><label>Drug and Alcohol:&nbsp;&nbsp;<input type="checkbox" onChange={handleDrugAndAlcoholChange}></input></label></div>
                                    <div className="font-bold"><label>Cognitive Restructuring:&nbsp;&nbsp;<input type="checkbox" onChange={handleCognitiveChange}></input></label></div>
                                    <div className="font-bold"><label>Mental Health:&nbsp;&nbsp;<input type="checkbox" onChange={handleMentalHealthChange}></input></label></div>
                                    <div className="font-bold"><label>Other:&nbsp;&nbsp;<input type="checkbox" onChange={handleOtherChange}></input></label></div>
                                </div>
                            </div>
                            <p className="flex justify-center font-medium text-lg mt-4">If the employer has included a letter or document please upload it here</p>
                            <div className="mt-6"> 
                                <UploadButton<OurFileRouter>
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        if (res !== undefined && res.length > 0) {
                                            const fileURL = res[0]?.url;
                                            const fileName = res[0]?.name;
                                            const fileKey = res[0]?.key;
                                            const fileSize = res[0]?.size;

                                            if (fileURL && fileName && fileKey && fileSize) {
                                                saveFileToDB(fileURL, fileName, fileKey, fileSize);
                                                return;
                                            }
                                            
                                            // set file import error if we reach here
                                            setShowUploadError(true);
                                        }
                                    }}
                                        onUploadError={(error: Error) => {
                                            setShowUploadError(true);
                                            uploadErrorLogMutation.mutate({
                                                accountId: clientId,
                                                error: error.message,
                                                url: 'IncidentReportModal - Employer Referred'
                                            });
                                            console.error(`ERROR! ${error.message}`);
                                        }}
                                />
                            </div>
                            <div>
                                <UploadDropzone<OurFileRouter>
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        if (res !== undefined && res.length > 0) {
                                            const fileURL = res[0]?.url;
                                            const fileName = res[0]?.name;
                                            const fileKey = res[0]?.key;
                                            const fileSize = res[0]?.size;

                                            if (fileURL && fileName && fileKey && fileSize) {
                                                saveFileToDB(fileURL, fileName, fileKey, fileSize);
                                                return;
                                            }
                                            
                                            // set file import error if we reach here
                                            setShowUploadError(true);
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        setShowUploadError(true);
                                        uploadErrorLogMutation.mutate({
                                            accountId: clientId,
                                            error: error.message,
                                            url: 'IncidentReportModal - Employer Referred'
                                        });
                                        console.error(`ERROR! ${error.message}`);
                                    }}
                                />
                            </div>
                            <p className="flex justify-center font-medium text-lg mt-4">We have provided an area for you to add your comments on the incident</p>
                            <div>
                                <textarea className="w-full h-48 border border-gray-300 rounded-md shadow-sm shadow-purple-900 p-2 mt-4" placeholder="Give a description of the incident and add any comments you wish to make." onChange={handleChange} value={text} />
                            </div>
                            <div className="mb-4 flex justify-end">
                                <button className="bg-slate-100 text-slate-700 border border-indigo-700 rounded-md shadow-sm shadow-purple-900 p-2 mt-4 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleCommentSave}>Submit</button>
                            </div>
                        </div>
                    </>
                }
                {
                    selectedType == incidentTypes?.find((incidentType) => incidentType.name === 'Self Referred')?.id &&
                    <>
                        <div className="mt-4">
                            <div className="mt-4">
                                <p className="flex justify-center font-medium text-lg">Check all applicable boxes below to indicate the type of evaluation you are required to complete.  It is your responsibility to know which evaluation is required.  If you don&apos;t know then refer to your court order.</p>
                                <div className="font-bold my-4"><label>Domestic Violence:&nbsp;&nbsp;<input type="checkbox" onChange={handleDomesticViolenceChange}></input></label></div>
                                <div className="font-bold mb-4"><label>Drug and Alcohol:&nbsp;&nbsp;<input type="checkbox" onChange={handleDrugAndAlcoholChange}></input></label></div>
                                <div className="font-bold mb-4"><label>Cognitive Restructuring:&nbsp;&nbsp;<input type="checkbox" onChange={handleCognitiveChange}></input></label></div>
                                <div className="font-bold mb-4"><label>Mental Health:&nbsp;&nbsp;<input type="checkbox" onChange={handleMentalHealthChange}></input></label></div>
                                <div className="font-bold mb-4"><label>Other:&nbsp;&nbsp;<input type="checkbox" onChange={handleOtherChange}></input></label></div>
                            </div>
                            <p className="flex justify-center font-medium text-lg">We have provided an area for you to add your comments on the incident</p>
                            <div>
                                <textarea className="w-full h-72 border border-gray-300 rounded-md shadow-sm shadow-purple-900 p-2 mt-4" placeholder="Give a description of the incident and add any comments you wish to make." onChange={handleChange} value={text} />
                            </div>
                            <div>
                                <button className="bg-slate-100 text-slate-700 border border-indigo-700 rounded-md shadow-sm shadow-purple-900 p-2 my-3 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleCommentSave}>Submit comment</button>
                            </div>
                        </div>
                    </>
                }
                {
                    showUploadError &&
                    <div className="border border-yellow-600 round my-4 p-3 text-slate-700 text-2xl">Something went wrong with the file upload.  Please try again or contact our office at 8018881234 for assistance</div>
                }
                {
                    showSaveError &&
                    <div className="border border-yellow-600 round my-4 p-3 text-slate-700 text-2xl">Something went wrong with the file save.  Please contact our office at 8018881234 for assistance</div>
                }
                {
                    showCategoryError &&
                    <div className="border border-yellow-600 round my-4 p-3 text-slate-700 text-2xl">Please select at least 1 incident category</div>
                }
                {
                    showCommentError &&
                    <div className="border border-yellow-600 round my-4 p-3 text-slate-700 text-2xl">Please add a comment of at least 100 characters</div>
                }
                {
                    showAssessmentError &&
                    <div className="border border-yellow-600 round my-4 p-3 text-slate-700 text-2xl">Something went wrong loading the assessments.  Please contact our office at 8018881234 for assistance</div>
                }
                {
                    showGoalError &&
                    <div className="border border-yellow-600 round my-4 p-3 text-slate-700 text-2xl">Something went wrong loading the goals.  Please contact our office at 8018881234 for assistance</div>
                }
                {
                    showUploadSuccess &&
                    <div className="border border-green-800 round p-3 text-green-800 text-4xl fixed z-20 bottom-10 animate-pulse bg-green-200 w-1/2">File has been successfully uploaded</div>
                }
            </div>
        </div>
    )
}

export default IncidentReportModal;