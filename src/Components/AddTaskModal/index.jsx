import { useState, useEffect } from 'react';
import Styles from './styled';
import closeModal from '../../helpres/closeModal';
import SelectComponent from '../Select';
import { useGroupsData } from '../../hooks/useGroupsData';
import { usePersonnelData } from '../../hooks/usePersonnelData';
import { useTechniquesData } from '../../hooks/useTechniquesData';
import { useFieldsData } from '../../hooks/useFieldsData';
import { useOperationsData } from '../../hooks/useOperationsData';
import { useCropsData } from '../../hooks/useCropsData';
import { useVarietiesData } from '../../hooks/useVarietiesData';
import { useVehiclesData } from '../../hooks/useVehiclesData';
import { useSaveTask, useTasksData, useUpdateTask } from '../../hooks/useTasksData';
import Button from '../Button';
import apiRoutes from '../../helpres/ApiRoutes';
import MapBlock from '../MapBlock';
import { useSelector } from 'react-redux';

export default function AddTaskModal({ onClose }) {
    const handleWrapperClick = closeModal(onClose);
    const { editTaskId } = useSelector((state) => state.modals);
    
    

    const { data: groups = [] } = useGroupsData();
    const { data: personnel = [] } = usePersonnelData();
    const { data: techniques = [] } = useTechniquesData();
    const { data: fieldsData = [] } = useFieldsData();
    const { data: operations = [] } = useOperationsData();
    const { data: crops = [] } = useCropsData();
    const { data: varieties = [] } = useVarietiesData();
    const { data: vehicles = [] } = useVehiclesData();
    const { data: tasks = [] } = useTasksData();

    const editTask = tasks.find(task => task._id === editTaskId);
    // console.log(editTask)
    

    // Стейти для вибору
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedPersonnel, setSelectedPersonnel] = useState(null);
    const [selectedTechnique, setSelectedTechnique] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedField, setSelectedField] = useState(null);
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [selectedVariety, setSelectedVariety] = useState(null);
    const [selectedCrop, setSelectedCrop] = useState(null);

    const [width, setWidth] = useState('');
    const [note, setNote] = useState('');
    const [deadline, setDeadline] = useState(null);

    useEffect(() => {
        if (editTask) {
            setSelectedGroup(
            editTask.groupId
                ? { value: editTask.groupId._id, label: editTask.groupId.name || '' }
                : null
            );
            setSelectedPersonnel(
            editTask.personnelId
                ? { value: editTask.personnelId._id, label: `${editTask.personnelId.firstName} ${editTask.personnelId.lastName}`.trim() || '' }
                : null
            );
            setSelectedTechnique(
            editTask.techniqueId
                ? { value: editTask.techniqueId._id, label: editTask.techniqueId.name || '' }
                : null
            );
            setSelectedVehicle(
            editTask.vehicleId
                ? { value: editTask.vehicleId._id, label: editTask.vehicleId.mark || editTask.vehicleId.regNumber || editTask.vehicleId.vehicleType || '' }
                : null
            );
            setSelectedField(
            editTask.fieldId
                ? { value: editTask.fieldId._id, label: editTask.fieldId.properties?.name || '' }
                : null
            );
            setSelectedOperation(
            editTask.operationId
                ? { value: editTask.operationId._id, label: editTask.operationId.name || '' }
                : null
            );
            setSelectedVariety(
            editTask.varietyId
                ? { value: editTask.varietyId._id, label: editTask.varietyId.name || '' }
                : null
            );
            setSelectedCrop(
            editTask.cropId
                ? { value: editTask.cropId._id, label: editTask.cropId.name || '' }
                : null
            );

            setWidth(editTask.width || '');
            setNote(editTask.note || '');
            setDeadline(editTask.daysToComplete || null);
        } else {
            setSelectedGroup(null);
            setSelectedPersonnel(null);
            setSelectedTechnique(null);
            setSelectedVehicle(null);
            setSelectedField(null);
            setSelectedOperation(null);
            setSelectedVariety(null);
            setSelectedCrop(null);
            setWidth('');
            setNote('');
            setDeadline(null);
        }
    }, [editTask]);


    const [isWidthEditable, setIsWidthEditable] = useState(false);

    // Обробники зміни
    const handleGroupChange = (opt) => setSelectedGroup(opt);
    const handlePersonnelChange = (opt) => setSelectedPersonnel(opt);
    const handleTechniqueChange = (opt) => setSelectedTechnique(opt);
    const handleVehicleChange = (opt) => setSelectedVehicle(opt);
    const handleFieldChange = (opt) => setSelectedField(opt);
    
    const handleOperationChange = (opt) => setSelectedOperation(opt);
    const handleVarietyChange = (opt) => setSelectedVariety(opt);
    const handleCropChange = (opt) => setSelectedCrop(opt);

    const saveTask = useSaveTask();
    const updateTask = useUpdateTask();

    useEffect(() => {
    if (selectedTechnique?.value) {
        const fullTechnique = techniques.find(t => t._id === selectedTechnique.value);
        if (fullTechnique?.width !== undefined) {
        setWidth(fullTechnique.width);
        } else {
        setWidth('');
        }
    } else {
        setWidth('');
    }
    }, [selectedTechnique, techniques]);

    const handleSave = async () => {
        try {
            const formData = new FormData();

            formData.append('group', selectedGroup?.value || '');
            formData.append('personnel', selectedPersonnel?.value || '');
            formData.append('technique', selectedTechnique?.value || '');
            formData.append('vehicle', selectedVehicle?.value || '');
            formData.append('field', selectedField?.value || '');
            formData.append('operation', selectedOperation?.value || '');
            formData.append('variety', selectedVariety?.value || '');
            formData.append('crop', selectedCrop?.value || '');
            formData.append('width', width ? String(width) : '');
            formData.append('note', note || '');
            formData.append('daysToComplete', deadline ? String(deadline) : '');

            if (editTaskId) {
                // Оновлення існуючої таски
                await updateTask.mutateAsync({ taskId: editTaskId, taskData: formData });
            } else {
                // Створення нової таски
                await saveTask.mutateAsync(formData);
            }

            onClose();
        } catch (error) {
            console.error('Помилка при збереженні таски:', error);
            alert('Сталася помилка при збереженні таски');
        }
    };

    return (
        <Styles.StyledWrapper onClick={handleWrapperClick}>
            <Styles.StyledModal onClick={e => e.stopPropagation()}>
                <Styles.StyledCloseButton onClick={handleWrapperClick} />
                    <Styles.StyledTitle>{editTaskId ? `Редагування завдання ${editTask.order}` : 'Додавання нового завдання'}</Styles.StyledTitle>
                    <Styles.StyledBlock>
                        <Styles.StyledColumn>

                        {/* Група */}
                        <Styles.StyledLabel>
                            <Styles.StyledSubtitle>Група</Styles.StyledSubtitle>
                            <SelectComponent
                                options={groups}
                                value={selectedGroup}
                                onChange={handleGroupChange}
                                placeholder="Оберіть групу"
                            />
                        </Styles.StyledLabel>

                        {/* Поле */}
                        <Styles.StyledLabel>
                            <Styles.StyledSubtitle>Поле</Styles.StyledSubtitle>
                            <SelectComponent
                                options={fieldsData.map(f => ({
                                    _id: f._id,
                                    name: f.properties?.name || 'Без назви',
                                    original: f,
                                }))}
                                value={selectedField}
                                onChange={handleFieldChange}
                                placeholder="Оберіть поле"
                            />
                        </Styles.StyledLabel>

                        {/* Транспорт */}
                        <Styles.StyledLabel>
                            <Styles.StyledSubtitle>Транспортний засіб</Styles.StyledSubtitle>
                            <SelectComponent
                                options={vehicles.map(v => ({
                                    _id: v._id,
                                    name: v.mark
                                    ? `${v.mark}${v.regNumber ? ` (${v.regNumber})` : ''}`
                                    : v.regNumber || v.vehicleType || 'Транспорт',
                                }))}
                                value={selectedVehicle}
                                onChange={handleVehicleChange}
                                placeholder="Оберіть транспорт"
                            />
                        </Styles.StyledLabel>

                        {/* Техніка */}
                        <Styles.StyledLabel>
                            <Styles.StyledSubtitle>Технічний засіб</Styles.StyledSubtitle>
                            <SelectComponent
                                options={techniques.map(t => ({
                                    _id: t._id,
                                    name: t.name,
                                }))}
                                value={selectedTechnique}
                                onChange={handleTechniqueChange}
                                placeholder="Оберіть техніку"
                            />
                        </Styles.StyledLabel>

                        {/* Виконавець */}
                        <Styles.StyledLabel>
                            <Styles.StyledSubtitle>Виконавець</Styles.StyledSubtitle>
                            <SelectComponent
                                options={personnel.map(p => ({
                                    _id: p._id,
                                    name: `${p.firstName} ${p.lastName}`.trim(),
                                }))}
                                value={selectedPersonnel}
                                onChange={handlePersonnelChange}
                                placeholder="Оберіть працівника"
                            />
                        </Styles.StyledLabel>

                        {/* Операція */}
                        <Styles.StyledLabel>
                            <Styles.StyledSubtitle>Технологічна операція</Styles.StyledSubtitle>
                            <SelectComponent
                                options={operations.map(op => ({
                                    _id: op._id,
                                    name: op.name || 'Без назви',
                                }))}
                                value={selectedOperation}
                                onChange={handleOperationChange}
                                placeholder="Оберіть операцію"
                            />
                        </Styles.StyledLabel>

                        {/* Культура */}
                        <Styles.StyledLabel>
                            <Styles.StyledSubtitle>Культура</Styles.StyledSubtitle>
                            <SelectComponent
                                options={crops.map(c => ({
                                    _id: c._id,
                                    name: c.name || 'Без назви',
                                }))}
                                value={selectedCrop}
                                onChange={handleCropChange}
                                placeholder="Оберіть культуру"
                            />
                        </Styles.StyledLabel>

                        {/* Сорт */}
                        <Styles.StyledLabel>
                            <Styles.StyledSubtitle>Сорт</Styles.StyledSubtitle>
                            <SelectComponent
                                options={varieties.map(v => ({
                                    _id: v._id,
                                    name: v.name || 'Без назви',
                                }))}
                                value={selectedVariety}
                                onChange={handleVarietyChange}
                                placeholder="Оберіть сорт"
                            />
                        </Styles.StyledLabel>
                    </Styles.StyledColumn>
                    
                    <Styles.StyledColumn>
                        <Styles.StyledMapBlock>
                            <MapBlock field={selectedField} fieldsList={fieldsData} height="400px" />
                        </Styles.StyledMapBlock>
                        {/* Тут можна додати інші поля, якщо потрібно */}
                        <Styles.StyledLabel>
                            <Styles.StyledSubtitle>Додаткова інформація</Styles.StyledSubtitle>
                            <Styles.StyledTextArea
                                maxLength={250}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </Styles.StyledLabel>

                        <Styles.StyledLabel>
                            <Styles.StyledSubtitle>
                                Ширина техніки (м)
                                <Styles.StyledEditToggle onClick={() => setIsWidthEditable(prev => !prev)}>
                                {isWidthEditable ? '🔒 Заблокувати' : '✏️ Редагувати'}
                                </Styles.StyledEditToggle>
                            </Styles.StyledSubtitle>
                            <Styles.StyledInput
                                type="number"
                                min="0"
                                step="0.1"
                                value={width}
                                disabled={!isWidthEditable}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                placeholder="Ширина"
                            />
                            </Styles.StyledLabel>

                            <Styles.StyledLabel>
                                <Styles.StyledSubtitle>Термін виконання (днів)</Styles.StyledSubtitle>
                                <Styles.StyledInput
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={deadline ?? ''}
                                    onChange={(e) => setDeadline(e.target.value ? Number(e.target.value) : '')}
                                    placeholder="Введіть кількість днів"
                                />
                            </Styles.StyledLabel>

                        </Styles.StyledColumn>
                    </Styles.StyledBlock>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                        <Button text={'Зберегти'} onClick={handleSave}/>
                    </div>
            </Styles.StyledModal>
        </Styles.StyledWrapper>
    );
}