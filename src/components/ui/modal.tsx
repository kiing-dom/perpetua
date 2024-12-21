import React from 'react';
import ReactDOM from 'react-dom';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if(!isOpen) return null;

    return ReactDOM.createPortal(
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg shadow-lg w-11/12 max-w-lg'>
                <div className='border-b px-4 py-3 flex justify-between items-center'>
                    <h2 className='text-lg font-bold'>{title}</h2>
                    <button
                        onClick={onClose}
                        className='text-gray-500 hover:text-gray-700 focus:outline-none'
                    >
                        <IoClose />
                    </button>
                </div>

                <div
                    className='p-4'
                >
                    {children}
                </div>
                <div
                    className='border-t px-4 py-3 flex justify-end'
                >
                    <button
                        onClick={onClose}
                        className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};