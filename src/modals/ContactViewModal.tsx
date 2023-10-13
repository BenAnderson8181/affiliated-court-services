import { useState } from "react";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import Modal from "./Modal";
import ContactUpdateModal from "./ContactUpdateModal";

type Props = {
    contactId: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onRefresh: () => void;
}

const ContactViewModal = ({ contactId, onClose, onRefresh }: Props) => {
    const [contactUpdateModalIsOpen, setContactUpdateModalIsOpen] = useState(false);

    const contactQuery = api.contact.get.useQuery({ id: contactId });

    if (contactQuery.isLoading) {
        return <Loading type="Modal" />
    }

    if (contactQuery.isError) {
        return <Loading type="Modal" />
    }

    const contact = contactQuery.data;

    const handleEmail = () => {
        console.log('hanlde email here')
    }

    const handleUpdate = () => {
        setContactUpdateModalIsOpen(true);
    }

    return (
        <div className="h-full w-full p-0">
            <div className="flex flex-row justify-center text-3xl py-2 bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 w-full rounded-t-md">Update Contact</div>
            <div className="text-2xl p-3">
                <div className="flex justify-between">
                    <div>First Name:</div>
                    <div>{contact?.firstName}</div>
                </div>
                <div className="flex justify-between">
                    <div>Last Name:</div>
                    <div>{contact?.lastName}</div>
                </div>
                <div className="flex justify-between">
                    <div>Phone:</div>
                    <div>{contact?.phone}</div>
                </div>
                <div className="flex justify-between">
                    <div>Email:</div>
                    <div>{contact?.email}</div>
                </div>
                <div className="flex justify-between">
                    <div>Agency:</div>
                    <div>{contact?.agency}</div>
                </div>
                <div className="flex justify-between">
                    <div>Agent Type:</div>
                    <div>{contact?.agentType?.name}</div>
                </div>
            </div>
            <div className="p-3 flex justify-between">
                <button className="rounded border border-indigo-700 px-3 py-1 text-indigo-700 mr-12 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleUpdate}>Update</button>
                <button className="rounded border border-indigo-700 px-3 py-1 text-indigo-700 mr-12 hover:scale-110 hover:shadow-lg hover:shadow-purple-900 hover:opacity-70" onClick={handleEmail}>Email</button>
            </div>
            <Modal
                onClose={() => onClose(false)}
                isOpen={contactUpdateModalIsOpen}
            >
                <ContactUpdateModal contactId={contactId} onClose={() => onClose(false)} onRefresh={onRefresh} />
            </Modal>
        </div>
    )
}

export default ContactViewModal;