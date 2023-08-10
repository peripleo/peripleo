import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { FiMenu } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import './MobileMenu.css';
export const MobileMenu = (props) => {
    const [open, setOpen] = useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { className: "p6o-controls-btn p6o-mobile-menu-btn", tabIndex: 42, "aria-label": "Open menu", onClick: () => setOpen(true) },
            React.createElement(FiMenu, null)),
        React.createElement(CSSTransition, { in: open, className: "p6o-mobile-menu", classNames: "p6o-mobile-menu", timeout: 200, unmountOnExit: true },
            React.createElement("div", { className: "p6o-mobile-menu" },
                React.createElement("button", { className: "p6o-mobile-menu-close", onClick: () => setOpen(false) },
                    React.createElement(IoCloseOutline, null)),
                React.createElement("main", null, props.items.length === 1 ? (props.items[0]) : null)))));
};
//# sourceMappingURL=MobileMenu.js.map