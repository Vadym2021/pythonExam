import {createBrowserRouter, Navigate} from "react-router-dom";
import {MainLayout} from "./layouts/MainLayout";
import {LoginPage} from "./page/LoginPage";
import {CarPage} from "./page/CarPage";
import {UserPage} from "./page/UserPage";
import {PersonalUserPage} from "./page/PersonalUserPage";
import {CreateCar} from "./components/UserContainer/CreateCar";
import {BlockAds} from "./components/UserContainer/BlockAds";
import {BlockUser} from "./components/UserContainer/BlockUser";
import {NoBrandEmail} from "./components/UserContainer/NoBrandEmail";
import {UserCars} from "./components/UserContainer/UserCars";


const router = createBrowserRouter([
    {
        path: '', element: <MainLayout/>, children: [
            {
                path: 'auth', element: <LoginPage/>
            },
            {
                path: 'user', element: <UserPage/>
            },
            {
                path: 'user/:id', element: <PersonalUserPage/>, children: [
                    {path: 'create-car', element: <CreateCar/>},
                    {path: 'block-users', element: <BlockUser/>},
                    {path: 'block-ads', element: <BlockAds/>},
                    {path: 'no-brand', element: <NoBrandEmail/>},
                    {path: 'user-cars', element: <UserCars/>},
                ]
            },
            {
                path: 'cars', element: <CarPage/>
            }
        ]
    }
]);

export {
    router
};
