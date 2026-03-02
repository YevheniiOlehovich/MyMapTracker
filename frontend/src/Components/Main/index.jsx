// import React, { useState, useEffect } from 'react';
// import { useQueryClient } from '@tanstack/react-query';
// import { CircularProgress, Typography, Box } from '@mui/material';

// import Login from '../Login';
// import Map from '../Map';
// import Header from '../Header';
// import Aside from '../Aside';
// import Modals from '../Modals';

// // API-функції
// import { fetchGroupsApi } from '../../api/groupsApi';
// import { fetchPersonnelApi } from '../../api/personnelApi';
// import { fetchVehiclesApi } from '../../api/vehicleApi';
// import { fetchTechniquesApi } from '../../api/techniquesApi';
// import { fetchFields } from '../../api/fieldsApi';
// import { fetchCadastre } from '../../api/cadastreApi';
// import { fetchGeozoneApi } from '../../api/geozonesApi';
// import { fetchUnits } from '../../api/unitsApi';
// import { fetchRents } from '../../api/rentApi';
// import { fetchProperties } from '../../api/propertyApi';

// export default function Main() {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);

//     const queryClient = useQueryClient();

//     // Перевірка токена при завантаженні сторінки
//     useEffect(() => {
//         const token = sessionStorage.getItem('token');
//         if (token) setIsAuthenticated(true);
//     }, []);

//     // Логін + preload даних
//     const handleLogin = async () => {
//         setIsAuthenticated(true); // одразу приховуємо Login
//         setIsLoading(true);       // показуємо loader

//         try {
//             const [
//                 groups,
//                 personnel,
//                 vehicles,
//                 techniques,
//                 rawFields,
//                 cadastre,
//                 geozone,
//                 rawUnits,
//                 rawRents,
//                 rawProperties
//             ] = await Promise.all([
//                 queryClient.fetchQuery({ queryKey: ['groups'], queryFn: fetchGroupsApi }),
//                 queryClient.fetchQuery({ queryKey: ['personnel'], queryFn: fetchPersonnelApi }),
//                 queryClient.fetchQuery({ queryKey: ['vehicles'], queryFn: fetchVehiclesApi }),
//                 queryClient.fetchQuery({ queryKey: ['techniques'], queryFn: fetchTechniquesApi }),
//                 queryClient.fetchQuery({ queryKey: ['fields'], queryFn: fetchFields }),
//                 queryClient.fetchQuery({ queryKey: ['cadastre'], queryFn: fetchCadastre }),
//                 queryClient.fetchQuery({ queryKey: ['geozone'], queryFn: fetchGeozoneApi }),
//                 queryClient.fetchQuery({ queryKey: ['units'], queryFn: fetchUnits }),
//                 queryClient.fetchQuery({ queryKey: ['rents'], queryFn: fetchRents }),
//                 queryClient.fetchQuery({ queryKey: ['properties'], queryFn: fetchProperties })
//             ]);

//             // ---------------------------
//             // Обробка видимості
//             // ---------------------------
//             const fieldsWithVisibility = Array.isArray(rawFields) ? rawFields.map(f => ({ ...f, visible: true })) : [];
//             const unitsWithVisibility = Array.isArray(rawUnits) ? rawUnits.map(u => ({ ...u, visible: true })) : [];
//             const rentsWithVisibility = Array.isArray(rawRents) ? rawRents.map(r => ({ ...r, visible: true })) : [];
//             const propertiesWithVisibility = Array.isArray(rawProperties) ? rawProperties.map(p => ({ ...p, visible: true })) : [];

//             // ---------------------------
//             // React Query cache
//             // ---------------------------
//             queryClient.setQueryData(['fields'], fieldsWithVisibility);
//             queryClient.setQueryData(['cadastre'], cadastre);
//             queryClient.setQueryData(['geozone'], geozone);
//             queryClient.setQueryData(['units'], unitsWithVisibility);
//             queryClient.setQueryData(['rents'], rentsWithVisibility);
//             queryClient.setQueryData(['properties'], propertiesWithVisibility);

//             // ---------------------------
//             // Session Storage
//             // ---------------------------
//             sessionStorage.setItem('groups', JSON.stringify(groups));
//             sessionStorage.setItem('personnel', JSON.stringify(personnel));
//             sessionStorage.setItem('vehicles', JSON.stringify(vehicles));
//             sessionStorage.setItem('techniques', JSON.stringify(techniques));
//             sessionStorage.setItem('fields', JSON.stringify(fieldsWithVisibility));
//             sessionStorage.setItem('cadastre', JSON.stringify(cadastre));
//             sessionStorage.setItem('geozone', JSON.stringify(geozone));
//             sessionStorage.setItem('units', JSON.stringify(unitsWithVisibility));
//             sessionStorage.setItem('rents', JSON.stringify(rentsWithVisibility));
//             sessionStorage.setItem('properties', JSON.stringify(propertiesWithVisibility));

//         } catch (error) {
//             console.error('Error loading initial data:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // ---------------------------
//     // Рендеринг
//     // ---------------------------
//     // Якщо не авторизований → показуємо Login
//     if (!isAuthenticated) return <Login onLogin={handleLogin} />;

//     // Якщо дані вантажаться → показуємо loader
    
//     if (isLoading) {
//         return (
//             <Box
//                 sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     height: '100vh',
//                     gap: 2,
//                     bgcolor: 'rgba(255,255,255,0.95)', // легкий фон
//                 }}
//             >
//                 <CircularProgress
//                     size={80}
//                     thickness={5}
//                     sx={{
//                         color: 'primary.main',
//                         animation: 'spin 1.5s linear infinite', // додатково можна додати keyframes
//                     }}
//                 />
//                 <Typography variant="h6" sx={{ opacity: 0, animation: 'fadeIn 1s forwards', mt: 2 }}>
//                     Завантаження даних… ⏳
//                 </Typography>

//                 {/* CSS-анімації через styled-component або глобальні keyframes */}
//                 <style>
//                     {`
//                         @keyframes spin {
//                             0% { transform: rotate(0deg); }
//                             100% { transform: rotate(360deg); }
//                         }
//                         @keyframes fadeIn {
//                             to { opacity: 1; }
//                         }
//                     `}
//                 </style>
//             </Box>
//         );
//     }

//     // Все готово → показуємо застосунок
//     return (
//         <>
//             <Header />
//             <Aside />
//             <Map />
//             <Modals />
//         </>
//     );
// }



import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CircularProgress, Typography, Box } from '@mui/material';

import Login from '../Login';
import Map from '../Map';
import Header from '../Header';
import Aside from '../Aside';
import Modals from '../Modals';

// API
import { fetchGroupsApi } from '../../api/groupsApi';
import { fetchPersonnelApi } from '../../api/personnelApi';
import { fetchVehiclesApi } from '../../api/vehicleApi';
import { fetchTechniquesApi } from '../../api/techniquesApi';
import { fetchFields } from '../../api/fieldsApi';
import { fetchCadastre } from '../../api/cadastreApi';
import { fetchGeozoneApi } from '../../api/geozonesApi';
import { fetchUnits } from '../../api/unitsApi';
import { fetchRents } from '../../api/rentApi';
import { fetchProperties } from '../../api/propertyApi';
import { fetchLastGpsByDateApi } from '../../api/gpsLastByDateApi';

export default function Main() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Підготовка...');

    const queryClient = useQueryClient();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) setIsAuthenticated(true);
    }, []);

    const handleLogin = async () => {
        setIsAuthenticated(true);
        setIsLoading(true);

        const todayStr = new Date().toISOString().split('T')[0];

        try {
            setLoadingText('Завантаження довідників...');

            const [
                groups,
                personnel,
                vehicles,
                techniques,
                rawFields,
                cadastre,
                geozone,
                rawUnits,
                rawRents,
                rawProperties
            ] = await Promise.all([
                queryClient.fetchQuery({ queryKey: ['groups'], queryFn: fetchGroupsApi }),
                queryClient.fetchQuery({ queryKey: ['personnel'], queryFn: fetchPersonnelApi }),
                queryClient.fetchQuery({ queryKey: ['vehicles'], queryFn: fetchVehiclesApi }),
                queryClient.fetchQuery({ queryKey: ['techniques'], queryFn: fetchTechniquesApi }),
                queryClient.fetchQuery({ queryKey: ['fields'], queryFn: fetchFields }),
                queryClient.fetchQuery({ queryKey: ['cadastre'], queryFn: fetchCadastre }),
                queryClient.fetchQuery({ queryKey: ['geozone'], queryFn: fetchGeozoneApi }),
                queryClient.fetchQuery({ queryKey: ['units'], queryFn: fetchUnits }),
                queryClient.fetchQuery({ queryKey: ['rents'], queryFn: fetchRents }),
                queryClient.fetchQuery({ queryKey: ['properties'], queryFn: fetchProperties })
            ]);

            setLoadingText('Завантаження останніх GPS координат...');

            await queryClient.fetchQuery({
                queryKey: ['lastGpsByDate', todayStr],
                queryFn: () => fetchLastGpsByDateApi(todayStr)
            });

            // Видимість
            const fieldsWithVisibility = rawFields?.map(f => ({ ...f, visible: true })) || [];
            const unitsWithVisibility = rawUnits?.map(u => ({ ...u, visible: true })) || [];
            const rentsWithVisibility = rawRents?.map(r => ({ ...r, visible: true })) || [];
            const propertiesWithVisibility = rawProperties?.map(p => ({ ...p, visible: true })) || [];

            queryClient.setQueryData(['fields'], fieldsWithVisibility);
            queryClient.setQueryData(['units'], unitsWithVisibility);
            queryClient.setQueryData(['rents'], rentsWithVisibility);
            queryClient.setQueryData(['properties'], propertiesWithVisibility);

            sessionStorage.setItem('groups', JSON.stringify(groups));
            sessionStorage.setItem('personnel', JSON.stringify(personnel));
            sessionStorage.setItem('vehicles', JSON.stringify(vehicles));
            sessionStorage.setItem('techniques', JSON.stringify(techniques));

        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) return <Login onLogin={handleLogin} />;

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    gap: 3,
                    bgcolor: 'rgba(255,255,255,0.95)',
                }}
            >
                <CircularProgress size={70} thickness={4} />
                <Typography variant="h6">
                    {loadingText}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Будь ласка, зачекайте…
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Header />
            <Aside />
            <Map />
            <Modals />
        </>
    );
}
