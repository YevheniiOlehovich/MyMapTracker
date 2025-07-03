import apiRoutes from '../helpres/ApiRoutes';

export const fetchOperationsApi = async () => {
    const response = await fetch(apiRoutes.getOperations);
    if (!response.ok) throw new Error('Не вдалося отримати операції');
    return await response.json();
};

export const saveOperationApi = async (operationData) => {
    const response = await fetch(apiRoutes.addOperation, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operationData),
    });
    if (!response.ok) throw new Error('Не вдалося створити операцію');
    return await response.json();
};

export const updateOperationApi = async ({ operationId, operationData }) => {
    const response = await fetch(apiRoutes.updateOperation(operationId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operationData),
    });
    if (!response.ok) throw new Error('Не вдалося оновити операцію');
    return await response.json();
};

export const deleteOperationApi = async (operationId) => {
    const response = await fetch(apiRoutes.deleteOperation(operationId), { method: 'DELETE' });
    if (!response.ok) throw new Error('Не вдалося видалити операцію');
    return operationId;
};
