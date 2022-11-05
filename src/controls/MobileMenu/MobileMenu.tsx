import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { FiMenu } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';

import './MobileMenu.css';

type MobileMenuProps = {

  items: React.ReactElement[]

}

export const MobileMenu = (props: MobileMenuProps) => {

  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        className="p6o-controls-btn p6o-mobile-menu-btn"
        tabIndex={42}
        aria-label="Open menu"
        onClick={() => setOpen(true)}>
        <FiMenu />
      </button>

      <CSSTransition
        in={open}
        className="p6o-mobile-menu"
        classNames="p6o-mobile-menu"
        timeout={200}
        unmountOnExit>

        <div className="p6o-mobile-menu">
          <button
            className="p6o-mobile-menu-close"
            onClick={() => setOpen(false)}>

            <IoCloseOutline />
          </button>

          <main>
            {props.items.length === 1  ? (
              props.items[0]
            ) : null}
          </main>
        </div>

      </CSSTransition>
    </>
  )

}