import { useEffect } from 'react';

const closeModal = (onClose) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleWrapperClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose(); 
        }
    };

    return handleWrapperClick;
};

export default closeModal;
