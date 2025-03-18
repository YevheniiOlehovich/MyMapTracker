import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Styles from './styles';
import EditIco from '../../assets/ico/edit-icon-black.png';
import LocationIco from '../../assets/ico/location.png';
import TriangleIco from '../../assets/ico/triangle.png';
import ShowIco from '../../assets/ico/icon-shown.png';
import HideIco from '../../assets/ico/icon-hidden.png';
import { selectAllFields, toggleFieldVisibility, selectFieldVisibility } from '../../store/fieldsSlice'; // Імпорт селектора для отримання полів та дій для керування видимістю
import { setMapCenter } from '../../store/mapCenterSlice'; // Імпорт дії для встановлення центру карти
import { openAddFieldsModal, setSelectedField } from '../../store/modalSlice'; // Імпорт дій для відкриття модалки та встановлення вибраного поля

export default function FieldsLit() {
    const dispatch = useDispatch();
    const fieldsData = useSelector(selectAllFields); // Отримання полів з Redux-стору
    const [isFieldsListVisible, setIsFieldsListVisible] = useState(true); // Додаємо стан для видимості списку полів

    const toggleFieldsListVisibility = () => {
        setIsFieldsListVisible(!isFieldsListVisible);
    };

    const handleCenterMap = (field) => {
        const bounds = L.geoJSON(field).getBounds();
        const center = bounds.getCenter();
        dispatch(setMapCenter([center.lat, center.lng]));
    };

    const handleEditField = (field) => {
        dispatch(setSelectedField(field));
        dispatch(openAddFieldsModal());
    };

    const handleToggleFieldVisibility = (fieldId) => {
        dispatch(toggleFieldVisibility(fieldId));
    };

    return (
        <Styles.wrapper>
            <Styles.block>
                <Styles.Title>Поля</Styles.Title>
            
                <Styles.btn onClick={toggleFieldsListVisibility}>
                    <Styles.btnIco
                        pic={TriangleIco}
                        rotation={isFieldsListVisible ? 180 : 0} // Перевертаємо трикутник
                    />
                </Styles.btn>
            </Styles.block>
            
            <Styles.list>
                {isFieldsListVisible && fieldsData.map((field, index) => {
                    const isVisible = useSelector(state => selectFieldVisibility(state, field._id));
                    return (
                        <Styles.fieldBlock key={index}>
                            <Styles.fieldName>{field.properties.name}</Styles.fieldName>
                            <Styles.btnBlock>
                                <Styles.btn onClick={() => handleToggleFieldVisibility(field._id)}>
                                    <Styles.btnIco pic={isVisible ? ShowIco : HideIco} />
                                </Styles.btn>
                                <Styles.btn onClick={() => handleCenterMap(field)}>
                                    <Styles.btnIco pic={LocationIco}></Styles.btnIco>
                                </Styles.btn>
                                <Styles.btn onClick={() => handleEditField(field)}>
                                    <Styles.btnIco pic={EditIco}></Styles.btnIco>
                                </Styles.btn>
                            </Styles.btnBlock>
                        </Styles.fieldBlock>
                    );
                })}
            </Styles.list>
        </Styles.wrapper>
    );
}