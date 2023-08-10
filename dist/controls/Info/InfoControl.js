import React, { useState } from 'react';
import { IoInformation } from 'react-icons/io5';
import { InfoModal } from './InfoModal';
import './InfoControl.css';
export const InfoControl = (props) => {
    const [modalOpen, setModalOpen] = useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { className: "p6o-controls-btn p6o-info", tabIndex: 41, "aria-label": "Information", onClick: () => setModalOpen(true) },
            React.createElement(IoInformation, null)),
        modalOpen && (React.createElement(InfoModal, { className: props.className, onClose: () => setModalOpen(false) }, props.children))));
};
//# sourceMappingURL=InfoControl.js.map