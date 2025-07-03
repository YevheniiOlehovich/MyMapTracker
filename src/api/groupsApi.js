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