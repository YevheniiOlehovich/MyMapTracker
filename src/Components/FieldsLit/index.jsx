import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Styles from './styles';
import EditIco from '../../assets/ico/edit-icon-black.png';
import LocationIco from '../../assets/ico/location.png';
import TriangleIco from '../../assets/ico/triangle.png';
import { selectAllFields } from '../../store/fieldsSlice'; // Імпорт селектора для отримання полів
import { setMapCenter } from '../../store/mapCenterSlice'; // Імпорт дії для встановлення центру карти

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

    return (
        <Styles.wrapper>
            <Styles.block>
                <Styles.Title>Поля</Styles.Title>
            
                <Styles.btn onClick={toggleFieldsListVisibility}>
                    <Styles.btnIco
                        pic={TriangleIco}
                        rotation={isFieldsListVisible ? 0 : 180} // Перевертаємо трикутник
                    />
                </Styles.btn>
            </Styles.block>
            
            <Styles.list>
                {isFieldsListVisible && fieldsData.map((field, index) => (
                    <Styles.fieldBlock key={index}>
                        <Styles.fieldName>{field.properties.name}</Styles.fieldName>
                        <Styles.btnBlock>
                            <Styles.btn onClick={() => handleCenterMap(field)}>
                                <Styles.btnIco pic={LocationIco}></Styles.btnIco>
                            </Styles.btn>
                            <Styles.btn>
                                <Styles.btnIco pic={EditIco}></Styles.btnIco>
                            </Styles.btn>
                        </Styles.btnBlock>
                    </Styles.fieldBlock>
                ))}
            </Styles.list>
            
        </Styles.wrapper>
    );
}