import { useEffect } from 'react';
import { RiCloseFill } from "react-icons/ri";

import Portal from './Portal';

type Props = {
    children: JSX.Element;
    isOpen: boolean;
    onClose: () => void;
}

// TODO: Add transition to the open and close of the modal.  Log Rocket has a good article on how to do this with CSSTransition from 'react-transition-group'
// We may want to consider passing in args to affect height/width
const LargeModal: React.FC<Props> = ({ children, isOpen, onClose }) => {
    useEffect(() => {
        const closeOnEscapeKey = (e: KeyboardEvent) => e.key === 'Escape' ? onClose() : null;
        document.body.addEventListener('keydown', closeOnEscapeKey);

        return () => document.body.removeEventListener('keydown', closeOnEscapeKey);
    }, [onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <Portal wrapperId='company-form'>
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                {/* <div className="relative w-5/6 rounded-md border shadow-lg shadow-purple-900 bg-white flex flex-col justify-center items-center h-fit"> */}
                <div className='fixed z-[1055] h-5/6 w-5/6 overflow-y-auto overflow-x-hidden outline-none bg-white top-12'>
                    <button className="fixed text-white top-12 right-28 z-10" onClick={onClose}>
                        <RiCloseFill color='black' size='2rem' />
                    </button>
                    {children}
                </div>
            </div>
        </Portal>
    );
}

export default LargeModal;