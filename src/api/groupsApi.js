// import apiRoutes from '../helpres/ApiRoutes';

// // Отримання всіх груп
// export const fetchGroupsApi = async () => {
//     const response = await fetch(apiRoutes.getGroups);
//     if (!response.ok) {
//         throw new Error('Не вдалося отримати групи');
//     }
//     return await response.json();
// };

// // Оновлення групи
// export const updateGroupApi = async ({ groupId, groupData }) => {
//     const response = await fetch(apiRoutes.updateGroup(groupId), {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(groupData),
//     });
//     if (!response.ok) {
//         throw new Error('Не вдалося оновити групу');
//     }
//     return await response.json();
// };

// // Видалення групи
// export const deleteGroupApi = async (groupId) => {
//     const response = await fetch(apiRoutes.deleteGroup(groupId), {
//         method: 'DELETE',
//     });
//     if (!response.ok) {
//         throw new Error('Не вдалося видалити групу');
//     }
//     return groupId; // Повертаємо ID видаленої групи
// };

// // Видалення персоналу
// export const deletePersonnelApi = async ({ groupId, personnelId }) => {
//     const response = await fetch(apiRoutes.deletePersonnel(groupId, personnelId), {
//         method: 'DELETE',
//     });
//     if (!response.ok) {
//         throw new Error('Не вдалося видалити персонал');
//     }
//     return personnelId; // Повертаємо ID видаленого персоналу
// };

// // Оновлення персоналу
// // export const updatePersonnelApi = async ({ groupId, personnelId, personnelData }) => {
// //     const url = apiRoutes.updatePersonnel(groupId, personnelId);
// //     console.log('Запит на оновлення персоналу:', url);
// //     console.log('Тіло запиту:', personnelData);

// //     const response = await fetch(url, {
// //         method: 'PUT',
// //         body: personnelData,
// //     });

// //     if (!response.ok) {
// //         throw new Error('Не вдалося оновити персонал');
// //     }

// //     return await response.json();
// // };

// // Видалення техніки
// export const deleteVehicleApi = async ({ groupId, vehicleId }) => {
//     const response = await fetch(apiRoutes.deleteVehicle(groupId, vehicleId), {
//         method: 'DELETE',
//     });
//     if (!response.ok) {
//         throw new Error('Не вдалося видалити техніку');
//     }
//     return vehicleId; // Повертаємо ID видаленої техніки
// };

// // Оновлення техніки
// // export const updateVehicleApi = async ({ groupId, vehicleId, vehicleData }) => {
// //     const formData = new FormData();
// //     formData.append('groupId', groupId);
// //     formData.append('vehicleType', vehicleData.vehicleType);
// //     formData.append('regNumber', vehicleData.regNumber);
// //     formData.append('mark', vehicleData.mark);
// //     formData.append('note', vehicleData.note);
// //     formData.append('imei', vehicleData.imei);

// //     const response = await fetch(apiRoutes.updateVehicle(groupId, vehicleId), {
// //         method: 'PUT',
// //         body: formData,
// //     });
// //     if (!response.ok) {
// //         throw new Error('Не вдалося оновити техніку');
// //     }
// //     return await response.json();
// // };

// export const saveVehicleApi = async ({ groupId, vehicleData }) => {
//     // Створення нової техніки
//     const url = apiRoutes.addVehicle(groupId);
//     const response = await fetch(url, { method: 'POST', body: vehicleData });

//     if (!response.ok) {
//         throw new Error('Не вдалося створити техніку');
//     }

//     const savedVehicle = await response.json();
//     console.log('Нова техніка створена:', savedVehicle);

//     return savedVehicle;
// };

// export const savePersonnelApi = async ({ groupId, personnelData }) => {
//     // Створення нового персоналу
//     const url = apiRoutes.addPersonnel(groupId);
//     const response = await fetch(url, { method: 'POST', body: personnelData });

//     if (!response.ok) {
//         throw new Error('Не вдалося створити персонал');
//     }

//     const savedPersonnel = await response.json();
//     console.log('Новий персонал створений:', savedPersonnel);

//     return savedPersonnel;
// };


// export const saveGroupApi = async (groupData) => {
//     const response = await fetch(apiRoutes.addGroup, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(groupData),
//     });

//     if (!response.ok) {
//         throw new Error('Не вдалося створити групу');
//     }

//     const savedGroup = await response.json();
//     console.log('Нова група створена:', savedGroup);

//     return savedGroup;
// };


// // Додавання техніки
// export const saveTechniqueApi = async ({ groupId, techniqueData }) => {
//     // Створення нової техніки
//     const url = apiRoutes.addTechnique(groupId);
//     const response = await fetch(url, { method: 'POST', body: techniqueData });

//     if (!response.ok) {
//         throw new Error('Не вдалося створити техніку');
//     }

//     const savedTechnique = await response.json();
//     console.log('Нова техніка створена:', savedTechnique);

//     return savedTechnique;
// };

// // Видалення техніки
// export const deleteTechniqueApi = async ({ groupId, techniqueId }) => {
//     const url = apiRoutes.deleteTechnique(groupId, techniqueId);
//     const response = await fetch(url, { method: 'DELETE' });

//     if (!response.ok) {
//         throw new Error('Не вдалося видалити техніку');
//     }

//     console.log(`Техніка з ID ${techniqueId} успішно видалена.`);
//     return techniqueId; // Повертаємо ID видаленої техніки
// };

import apiRoutes from '../helpres/ApiRoutes';

export const fetchGroupsApi = async () => {
    const response = await fetch(apiRoutes.getGroups);
    if (!response.ok) throw new Error('Не вдалося отримати групи');
    return await response.json();
};

export const saveGroupApi = async (groupData) => {
    const response = await fetch(apiRoutes.addGroup, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData),
    });
    if (!response.ok) throw new Error('Не вдалося створити групу');
    return await response.json();
};

export const updateGroupApi = async ({ groupId, groupData }) => {
    const response = await fetch(apiRoutes.updateGroup(groupId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData),
    });
    if (!response.ok) throw new Error('Не вдалося оновити групу');
    return await response.json();
};

export const deleteGroupApi = async (groupId) => {
    const response = await fetch(apiRoutes.deleteGroup(groupId), { method: 'DELETE' });
    if (!response.ok) throw new Error('Не вдалося видалити групу');
    return groupId;
};