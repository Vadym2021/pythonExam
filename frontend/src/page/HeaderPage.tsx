import React from 'react';

// import css from './HeaderPage.module.css';
import {NavLink} from 'react-router-dom';




const HeaderPage = () => {



    return (
        // <div className={css.Header}>
        <div>


            <div>

                <NavLink to={'cars'}>Cars</NavLink>
                <NavLink to={'user'}>User</NavLink>
                {/*<NavLink to={`/users/${userId}`}>User By Id</NavLink>*/}
            </div>

        </div>
    );
};

export {HeaderPage};


