import { useState } from 'react';
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
import Button from '../Button';
import apiRoutes from '../../helpres/ApiRoutes';

export default function AddTaskModal({ onClose }) {
    const handleWrapperClick = closeModal(onClose);

    const { data: groups = [] } = useGroupsData();
    const { data: personnel = [] } = usePersonnelData();
    const { data: techniques = [] } = useTechniquesData();
    const { data: fieldsData = [] } = useFieldsData();
    const { data: operations = [] } = useOperationsData();
    const { data: crops = [] } = useCropsData();
    const { data: varieties = [] } = useVarietiesData();
    const { data: vehicles = [] } = useVehiclesData();

    // Стейти для вибору
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedPersonnel, setSelectedPersonnel] = useState(null);
    const [selectedTechnique, setSelectedTechnique] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedField, setSelectedField] = useState(null);
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [selectedVariety, setSelectedVariety] = useState(null);
    const [selectedCrop, setSelectedCrop] = useState(null);

    // Обробники зміни
    const handleGroupChange = (opt) => setSelectedGroup(opt);
    const handlePersonnelChange = (opt) => setSelectedPersonnel(opt);
    const handleTechniqueChange = (opt) => setSelectedTechnique(opt);
    const handleVehicleChange = (opt) => setSelectedVehicle(opt);
    const handleFieldChange = (opt) => setSelectedField(opt);
    const handleOperationChange = (opt) => setSelectedOperation(opt);
    const handleVarietyChange = (opt) => setSelectedVariety(opt);
    const handleCropChange = (opt) => setSelectedCrop(opt);

    const handleSave = async () => {
        const formData = {
            group: selectedGroup,
            personnel: selectedPersonnel,
            technique: selectedTechnique,
            vehicle: selectedVehicle,
            field: selectedField,
            operation: selectedOperation,
            variety: selectedVariety,
            crop: selectedCrop,
            // статус не передаємо — на бекенді буде 'new' за замовчуванням
        };

        try {
            console.log("Відправляю таску:", formData);
            const resp = await fetch(apiRoutes.addTask, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            });

            if (!resp.ok) {
            const errBody = await resp.json();
            console.error('Помилка створення таски:', errBody);
            // можеш показати користувачу повідомлення
            return;
            }

            const created = await resp.json();
            console.log('Таска створена:', created);
            // тут можеш закрити модалку або оновити список
            onClose?.();
        } catch (e) {
            console.error('Network error створення таски:', e);
        }
    };

    return (
        <Styles.StyledWrapper onClick={handleWrapperClick}>
            <Styles.StyledModal onClick={e => e.stopPropagation()}>
                <Styles.StyledCloseButton onClick={handleWrapperClick} />
                    <Styles.StyledTitle>Додавання нового завдання</Styles.StyledTitle>

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
                    

                    {/* Персонал */}
                    <Styles.StyledLabel>
                        <Styles.StyledSubtitle>Персонал</Styles.StyledSubtitle>
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
                    

                    {/* Техніка */}
                    <Styles.StyledLabel>
                        <Styles.StyledSubtitle>Техніка</Styles.StyledSubtitle>
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
                    

                    {/* Транспорт */}
                    <Styles.StyledLabel>
                        <Styles.StyledSubtitle>Транспорт</Styles.StyledSubtitle>
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

                    {/* Операція */}
                    <Styles.StyledLabel>
                        <Styles.StyledSubtitle>Операція</Styles.StyledSubtitle>
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
                    <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                        <Button text={'Зберегти'} onClick={handleSave}/>
                    </div>
            </Styles.StyledModal>
        </Styles.StyledWrapper>
    );
}
