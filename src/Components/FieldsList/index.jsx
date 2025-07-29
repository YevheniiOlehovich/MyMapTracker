import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Styles from './styles';
import EditIco from '../../assets/ico/edit-icon-black.png';
import LocationIco from '../../assets/ico/location.png';
import TriangleIco from '../../assets/ico/triangle.png';
import ShowIco from '../../assets/ico/icon-shown.png';
import HideIco from '../../assets/ico/icon-hidden.png';
import { useFieldsData, useToggleFieldVisibility } from '../../hooks/useFieldsData'; // Використовуємо React Query
import { setMapCenter } from '../../store/mapCenterSlice';
import { openAddFieldsModal, setSelectedField } from '../../store/modalSlice';

export default function FieldsList() {
    const dispatch = useDispatch();
    const [isFieldsListVisible, setIsFieldsListVisible] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Отримуємо дані полів через React Query
    const { data: fieldsData, isLoading, error } = useFieldsData();
    const toggleFieldVisibility = useToggleFieldVisibility();

    // Логування даних полів
    // console.log('Fields Data from React Query:', fieldsData);

    const toggleFieldsListVisibility = () => {
        setIsFieldsListVisible(!isFieldsListVisible);
    };

    const handleCenterMap = (field) => {
        const bounds = L.geoJSON(field).getBounds();
        const center = bounds.getCenter();
        dispatch(setMapCenter([center.lat, center.lng]));
    };

    const handleEditField = (field) => {
        dispatch(setSelectedField(field._id));
        dispatch(openAddFieldsModal());
    };

    const handleToggleFieldVisibility = (fieldId, currentVisibility) => {
    
        // Виконуємо мутацію
        toggleFieldVisibility.mutate(
            { fieldId, isVisible: !currentVisibility },
            {
                onSuccess: () => {
                    // Логування після успішної зміни
                    const updatedField = fieldsData.find((field) => field._id === fieldId);
                    // console.log('Updated field data:', updatedField);
                },
            }
        );
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Мемоізуємо відфільтровані поля
    const filteredFields = useMemo(() => {
        if (!fieldsData) return [];
        return fieldsData.filter((field) =>
            field.properties.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [fieldsData, searchTerm]);

    if (isLoading) return <p>Loading fields...</p>;
    if (error) return <p>Error loading fields: {error.message}</p>;

    return (
        <Styles.wrapper>
            <Styles.block>
                <Styles.Title>Поля</Styles.Title>
                <Styles.btn onClick={toggleFieldsListVisibility}>
                    <Styles.btnIco
                        $pic={TriangleIco}
                        $rotation={isFieldsListVisible ? 180 : 0}
                    />
                </Styles.btn>
            </Styles.block>

            {isFieldsListVisible && (
                <Styles.searchInput
                    type="text"
                    placeholder="Пошук поля по назві"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            )}

            <Styles.list>
                {isFieldsListVisible && filteredFields.map((field, index) => {
                    return (
                        <Styles.fieldBlock key={index}>
                            <Styles.fieldName>{field.properties.name}</Styles.fieldName>
                            <Styles.btnBlock>
                                <Styles.btn onClick={() => handleToggleFieldVisibility(field._id, field.visible)}>
                                    <Styles.btnIco $pic={field.visible ? ShowIco : HideIco} />
                                </Styles.btn>
                                <Styles.btn onClick={() => handleCenterMap(field)}>
                                    <Styles.btnIco $pic={LocationIco} />
                                </Styles.btn>
                                <Styles.btn onClick={() => handleEditField(field)}>
                                    <Styles.btnIco $pic={EditIco} />
                                </Styles.btn>
                            </Styles.btnBlock>
                        </Styles.fieldBlock>
                    );
                })}
            </Styles.list>
        </Styles.wrapper>
    );
}