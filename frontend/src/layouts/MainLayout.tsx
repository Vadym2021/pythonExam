import React from 'react';
import {Outlet} from 'react-router-dom';
import {HeaderPage} from "../page/HeaderPage";

const MainLayout = () => {
    return (
        <div>
            <HeaderPage/>
            <div>
                <Outlet/>
            </div>
        </div>
    );
};

export {MainLayout};
