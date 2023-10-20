type Props = {
    isSubmitting: boolean;
    isDirty: boolean;
    isValid: boolean;
    onClose?: () => void;
    onDelete?: () => void;
}

const FormSubmitButtons = ({isSubmitting, isDirty, isValid, onClose, onDelete}: Props) => {
    return (
        <div className="flex justify-start mt-8 relative">
            {
                onClose &&
                <button className="px-5 py-2 text-slate-100 bg-orange-500 duration-300 hover:opacity-50 rounded-lg cursor-pointer hover:shadow-purple-900 hover:shadow-md" onClick={onClose}>Cancel</button>
            }
            <input
                type="submit"
                disabled={isSubmitting || !isDirty || !isValid}
                className="rounded border border-indigo-700 text-indigo-700 ml-2 px-5 py-2 duration-300 hover:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:shadow-purple-900 hover:shadow-md"
            />
            {
                onDelete &&
                <button className="px-5 py-2 text-slate-100 bg-red-700 duration-300 hover:opacity-50 rounded-lg cursor-pointer hover:shadow-purple-900 hover:shadow-md absolute right-0" onClick={onDelete}>Delete</button>
            }
        </div>
    )
}

export default FormSubmitButtons;
