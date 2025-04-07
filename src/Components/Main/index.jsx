// import Map from "../Map"
// import Header from "../Header"
// import Aside from '../Aside'
// import LayersList from "../LayersList"
// import Modals from "../Modals"

// export default function Main(){
//     return(
//         <>
//             <Header />
//             <Aside />
//             <Map />
//             <LayersList />
//             <Modals />
//         </>
//     )
// }


import React, { useState, useEffect } from 'react';
import Login from '../Login';
import Map from '../Map';
import Header from '../Header';
import Aside from '../Aside';
import LayersList from '../LayersList';
import Modals from '../Modals';

export default function Main() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Перевіряємо, чи є токен у localStorage
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true); // Оновлюємо стан після успішного логіну
    };

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />; // Якщо не авторизований, показуємо компонент Login
    }

    return (
        <>
            <Header />
            <Aside />
            <Map />
            <LayersList />
            <Modals />
        </>
    );
}