import React, { useState } from "react";
import LoadError from "~/components/LoadError";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import { UploadButton , UploadDropzone } from "@uploadthing/react"; 
import type { OurFileRouter } from "../server/uploadThing";
import "@uploadthing/react/styles.css";

type Props = {
    accountId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const DocumentModal = ({ accountId, onClose, onRefresh}: Props) => {
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showUploadSuccess, setShowUploadSuccess] = useState(false);

    const documentTypeQuery = api.documentType.list.useQuery();
    const documentLogMutation = api.documentLog.create.useMutation();
    const documentLogUpdateMutation = api.documentLog.update.useMutation();
    const documentMutation = api.document.create.useMutation();
    const uploadErrorLogMutation = api.uploadErrorLog.create.useMutation();

    if (documentTypeQuery.isLoading) {
        return <Loading type='Modal' />
    }

    if (documentTypeQuery.isError) {
        return <LoadError type='Modal' />
    }

    const documentTypes = documentTypeQuery.data;

    const courtDocumentTypeId = documentTypes.find((d) => d.name === 'Court')?.id;

    if (!courtDocumentTypeId) {
        return <LoadError type='Modal' />
    }

    const saveFileToDB = async (fileURL: string, fileName: string, fileKey: string, fileSize: number) => {
        // Save to the Document Log
        const documentLog = await documentLogMutation.mutateAsync({
            accountId,
            url: fileURL,
            name: fileName,
            key: fileKey,
            size: fileSize,
            action: 'Incident Report Upload'
        })
        .catch((err) => {
            console.error(err);
            setShowErrorAlert(true);
            return;
        });

        // Save the Document to the client
        documentMutation.mutateAsync({
            accountId,
            url: fileURL,
            name: fileName,
            key: fileKey,
            size: fileSize,
            documentTypeId: courtDocumentTypeId,
        })
        .catch((err) => {
            console.error(err);
            setShowErrorAlert(true);
            if (documentLog?.id) {
                documentLogUpdateMutation.mutateAsync({
                    id: documentLog?.id,
                    action: 'Incident Report Upload Failed'
                })
                .catch((err) => {
                    console.error(err);
                    setShowErrorAlert(true);
                    return;
                });
            }
            return;
        });

        onRefresh();

        setShowUploadSuccess(true);
        setTimeout(() => {
            onClose(false);
            setShowUploadSuccess(false);
        }, 5000); 
    }

    return (
        <div className="h-full w-full p-0 flex flex-col">
            <div className="flex flex-row justify-center mb-2 text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md pb-6">Document Upload</div>
            <div className="px-4">
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
                                setShowErrorAlert(true);
                            }
                        }}
                        onUploadError={(error: Error) => {
                            setShowErrorAlert(true);
                            uploadErrorLogMutation.mutate({
                                accountId,
                                error: error.message,
                                url: `IncidentReportModal - Modal`
                            });
                            console.error(`ERROR! ${error.message}`);
                        }}
                    />
                </div>
                <div className="mb-10">
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
                                setShowErrorAlert(true);
                            }
                        }}
                        onUploadError={(error: Error) => {
                            setShowErrorAlert(true);
                            uploadErrorLogMutation.mutate({
                                accountId,
                                error: error.message,
                                url: `IncidentReportModal - Modal`
                            });
                            console.log(`ERROR! ${error.message}`);
                        }}
                    />
                </div>
            </div>
            { 
                showErrorAlert &&
                <div className="border border-yellow-600 round my-4 p-3 text-slate-700 text-2xl">Something went wrong with the file upload.  Please try again or contact our office at 8018881234 for assistance</div>
            }
            {
                showUploadSuccess &&
                <div className="border border-green-800 round p-3 text-green-800 text-4xl fixed z-20 bottom-10 animate-pulse bg-green-200 w-1/2">File has been successfully uploaded</div>
            }
        </div>
    )
}

export default DocumentModal;