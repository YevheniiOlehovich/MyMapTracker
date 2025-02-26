// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Styles from './styles';
// import EditIco from '../../assets/ico/edit-icon-black.png';
// import LocationIco from '../../assets/ico/location.png';
// import TriangleIco from '../../assets/ico/triangle.png';
// import { selectAllFields } from '../../store/fieldsSlice'; // Імпорт селектора для отримання полів
// import { setMapCenter } from '../../store/mapCenterSlice'; // Імпорт дії для встановлення центру карти
// import { openAddFieldsModal, closeAddFieldsModal } from '../../store/modalSlice'; // Імпорт дій для відкриття та закриття модалки
// import AddFieldsModal from '../AddFieldsModal'; // Імпорт компонента модалки

// export default function FieldsLit() {
//     const dispatch = useDispatch();
//     const fieldsData = useSelector(selectAllFields); // Отримання полів з Redux-стору
//     const isAddFieldsModalVisible = useSelector((state) => state.modals.isAddFieldsModalVisible); // Отримання стану видимості модалки
//     const [isFieldsListVisible, setIsFieldsListVisible] = useState(true); // Додаємо стан для видимості списку полів

//     const toggleFieldsListVisibility = () => {
//         setIsFieldsListVisible(!isFieldsListVisible);
//     };

//     const handleCenterMap = (field) => {
//         const bounds = L.geoJSON(field).getBounds();
//         const center = bounds.getCenter();
//         dispatch(setMapCenter([center.lat, center.lng]));
//     };

//     const handleEditField = (fieldId) => {
//         dispatch(openAddFieldsModal(fieldId));
//     };

//     return (
//         <>
//             <Styles.wrapper>
//                 <Styles.block>
//                     <Styles.Title>Поля</Styles.Title>
                
//                     <Styles.btn onClick={toggleFieldsListVisibility}>
//                         <Styles.btnIco
//                             pic={TriangleIco}
//                             rotation={isFieldsListVisible ? 0 : 180} // Перевертаємо трикутник
//                         />
//                     </Styles.btn>
//                 </Styles.block>
                
//                 <Styles.list>
//                     {isFieldsListVisible && fieldsData.map((field, index) => (
//                         <Styles.fieldBlock key={index}>
//                             <Styles.fieldName>{field.properties.name}</Styles.fieldName>
//                             <Styles.btnBlock>
//                                 <Styles.btn onClick={() => handleCenterMap(field)}>
//                                     <Styles.btnIco pic={LocationIco}></Styles.btnIco>
//                                 </Styles.btn>
//                                 <Styles.btn onClick={() => handleEditField(field.id)}>
//                                     <Styles.btnIco pic={EditIco}></Styles.btnIco>
//                                 </Styles.btn>
//                             </Styles.btnBlock>
//                         </Styles.fieldBlock>
//                     ))}
//                 </Styles.list>
                
                
//             </Styles.wrapper>
//             {isAddFieldsModalVisible && <AddFieldsModal />} {/* Відображення модалки при відкритті */}
//         </>
//     );
// }


// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Styles from './styles';
// import EditIco from '../../assets/ico/edit-icon-black.png';
// import LocationIco from '../../assets/ico/location.png';
// import TriangleIco from '../../assets/ico/triangle.png';
// import { selectAllFields } from '../../store/fieldsSlice'; // Імпорт селектора для отримання полів
// import { setMapCenter } from '../../store/mapCenterSlice'; // Імпорт дії для встановлення центру карти
// import { openAddFieldsModal } from '../../store/modalSlice'; // Імпорт дії для відкриття модалки

// export default function FieldsLit() {
//     const dispatch = useDispatch();
//     const fieldsData = useSelector(selectAllFields); // Отримання полів з Redux-стору
//     const [isFieldsListVisible, setIsFieldsListVisible] = useState(true); // Додаємо стан для видимості списку полів

//     const toggleFieldsListVisibility = () => {
//         setIsFieldsListVisible(!isFieldsListVisible);
//     };

//     const handleCenterMap = (field) => {
//         const bounds = L.geoJSON(field).getBounds();
//         const center = bounds.getCenter();
//         dispatch(setMapCenter([center.lat, center.lng]));
//     };

//     const handleEditField = (fieldId) => {
//         dispatch(openAddFieldsModal(fieldId));
//     };

//     return (
//         <Styles.wrapper>
//             <Styles.block>
//                 <Styles.Title>Поля</Styles.Title>
            
//                 <Styles.btn onClick={toggleFieldsListVisibility}>
//                     <Styles.btnIco
//                         pic={TriangleIco}
//                         rotation={isFieldsListVisible ? 0 : 180} // Перевертаємо трикутник
//                     />
//                 </Styles.btn>
//             </Styles.block>
            
//             <Styles.list>
//                 {isFieldsListVisible && fieldsData.map((field, index) => (
//                     <Styles.fieldBlock key={index}>
//                         <Styles.fieldName>{field.properties.name}</Styles.fieldName>
//                         <Styles.btnBlock>
//                             <Styles.btn onClick={() => handleCenterMap(field)}>
//                                 <Styles.btnIco pic={LocationIco}></Styles.btnIco>
//                             </Styles.btn>
//                             <Styles.btn onClick={() => handleEditField(field.id)}>
//                                 <Styles.btnIco pic={EditIco}></Styles.btnIco>
//                             </Styles.btn>
//                         </Styles.btnBlock>
//                     </Styles.fieldBlock>
//                 ))}
//             </Styles.list>
//         </Styles.wrapper>
//     );
// }

// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Styles from './styles';
// import EditIco from '../../assets/ico/edit-icon-black.png';
// import LocationIco from '../../assets/ico/location.png';
// import TriangleIco from '../../assets/ico/triangle.png';
// import { selectAllFields } from '../../store/fieldsSlice'; // Імпорт селектора для отримання полів
// import { setMapCenter } from '../../store/mapCenterSlice'; // Імпорт дії для встановлення центру карти
// import { openAddFieldsModal } from '../../store/modalSlice'; // Імпорт дії для відкриття модалки
// import AddFieldsModal from '../AddFieldsModal'; // Імпорт компонента модалки

// export default function FieldsLit() {
//     const dispatch = useDispatch();
//     const fieldsData = useSelector(selectAllFields); // Отримання полів з Redux-стору
//     const isAddFieldsModalVisible = useSelector((state) => state.modals.isAddFieldsModalVisible); // Отримання стану видимості модалки
//     const [isFieldsListVisible, setIsFieldsListVisible] = useState(true); // Додаємо стан для видимості списку полів

//     const toggleFieldsListVisibility = () => {
//         setIsFieldsListVisible(!isFieldsListVisible);
//     };

//     const handleCenterMap = (field) => {
//         const bounds = L.geoJSON(field).getBounds();
//         const center = bounds.getCenter();
//         dispatch(setMapCenter([center.lat, center.lng]));
//     };

//     const handleEditField = (fieldId) => {
//         dispatch(openAddFieldsModal(fieldId));
//     };

//     return (
//         <>
//             <Styles.wrapper>
//                 <Styles.block>
//                     <Styles.Title>Поля</Styles.Title>
                
//                     <Styles.btn onClick={toggleFieldsListVisibility}>
//                         <Styles.btnIco
//                             pic={TriangleIco}
//                             rotation={isFieldsListVisible ? 0 : 180} // Перевертаємо трикутник
//                         />
//                     </Styles.btn>
//                 </Styles.block>
                
//                 <Styles.list>
//                     {isFieldsListVisible && fieldsData.map((field, index) => (
//                         <Styles.fieldBlock key={index}>
//                             <Styles.fieldName>{field.properties.name}</Styles.fieldName>
//                             <Styles.btnBlock>
//                                 <Styles.btn onClick={() => handleCenterMap(field)}>
//                                     <Styles.btnIco pic={LocationIco}></Styles.btnIco>
//                                 </Styles.btn>
//                                 <Styles.btn onClick={() => handleEditField(field.id)}>
//                                     <Styles.btnIco pic={EditIco}></Styles.btnIco>
//                                 </Styles.btn>
//                             </Styles.btnBlock>
//                         </Styles.fieldBlock>
//                     ))}
//                 </Styles.list>
//             </Styles.wrapper>
//             {isAddFieldsModalVisible && <AddFieldsModal />} {/* Відображення модалки при відкритті */}
//         </>
//     );
// }




// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Styles from './styles';
// import EditIco from '../../assets/ico/edit-icon-black.png';
// import LocationIco from '../../assets/ico/location.png';
// import TriangleIco from '../../assets/ico/triangle.png';
// import { selectAllFields } from '../../store/fieldsSlice'; // Імпорт селектора для отримання полів
// import { setMapCenter } from '../../store/mapCenterSlice'; // Імпорт дії для встановлення центру карти
// import AddFieldsModal from '../AddFieldsModal'; // Імпорт компонента модалки

// export default function FieldsLit() {
//     const dispatch = useDispatch();
//     const fieldsData = useSelector(selectAllFields); // Отримання полів з Redux-стору
//     const [isFieldsListVisible, setIsFieldsListVisible] = useState(true); // Додаємо стан для видимості списку полів
//     const [selectedField, setSelectedField] = useState(null); // Додаємо стан для вибраного поля

//     const toggleFieldsListVisibility = () => {
//         setIsFieldsListVisible(!isFieldsListVisible);
//     };

//     const handleCenterMap = (field) => {
//         const bounds = L.geoJSON(field).getBounds();
//         const center = bounds.getCenter();
//         dispatch(setMapCenter([center.lat, center.lng]));
//     };

//     const handleEditField = (field) => {
//         setSelectedField(field);
//     };

//     const handleCloseModal = () => {
//         setSelectedField(null);
//     };

//     return (
//         <>
//             <Styles.wrapper>
//                 <Styles.block>
//                     <Styles.Title>Поля</Styles.Title>
                
//                     <Styles.btn onClick={toggleFieldsListVisibility}>
//                         <Styles.btnIco
//                             pic={TriangleIco}
//                             rotation={isFieldsListVisible ? 0 : 180} // Перевертаємо трикутник
//                         />
//                     </Styles.btn>
//                 </Styles.block>
                
//                 <Styles.list>
//                     {isFieldsListVisible && fieldsData.map((field, index) => (
//                         <Styles.fieldBlock key={index}>
//                             <Styles.fieldName>{field.properties.name}</Styles.fieldName>
//                             <Styles.btnBlock>
//                                 <Styles.btn onClick={() => handleCenterMap(field)}>
//                                     <Styles.btnIco pic={LocationIco}></Styles.btnIco>
//                                 </Styles.btn>
//                                 <Styles.btn onClick={() => handleEditField(field)}>
//                                     <Styles.btnIco pic={EditIco}></Styles.btnIco>
//                                 </Styles.btn>
//                             </Styles.btnBlock>
//                         </Styles.fieldBlock>
//                     ))}
//                 </Styles.list>
//             </Styles.wrapper>
//             {selectedField && <AddFieldsModal field={selectedField} onClose={handleCloseModal} />} {/* Відображення модалки при відкритті */}
//         </>
//     );
// }


// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Styles from './styles';
// import EditIco from '../../assets/ico/edit-icon-black.png';
// import LocationIco from '../../assets/ico/location.png';
// import TriangleIco from '../../assets/ico/triangle.png';
// import { selectAllFields } from '../../store/fieldsSlice'; // Імпорт селектора для отримання полів
// import { setMapCenter } from '../../store/mapCenterSlice'; // Імпорт дії для встановлення центру карти
// import { openAddFieldsModal } from '../../store/modalSlice'; // Імпорт дії для відкриття модалки
// import Modals from '../Modals'; // Імпорт компонента для модалок

// export default function FieldsLit() {
//     const dispatch = useDispatch();
//     const fieldsData = useSelector(selectAllFields); // Отримання полів з Redux-стору
//     const [isFieldsListVisible, setIsFieldsListVisible] = useState(true); // Додаємо стан для видимості списку полів
//     const [selectedField, setSelectedField] = useState(null); // Додаємо стан для вибраного поля

//     const toggleFieldsListVisibility = () => {
//         setIsFieldsListVisible(!isFieldsListVisible);
//     };

//     const handleCenterMap = (field) => {
//         const bounds = L.geoJSON(field).getBounds();
//         const center = bounds.getCenter();
//         dispatch(setMapCenter([center.lat, center.lng]));
//     };

//     const handleEditField = (field) => {
//         setSelectedField(field);
//         dispatch(openAddFieldsModal());
//     };

//     const handleCloseModal = () => {
//         setSelectedField(null);
//     };

//     return (
//         <>
//             <Styles.wrapper>
//                 <Styles.block>
//                     <Styles.Title>Поля</Styles.Title>
                
//                     <Styles.btn onClick={toggleFieldsListVisibility}>
//                         <Styles.btnIco
//                             pic={TriangleIco}
//                             rotation={isFieldsListVisible ? 0 : 180} // Перевертаємо трикутник
//                         />
//                     </Styles.btn>
//                 </Styles.block>
                
//                 <Styles.list>
//                     {isFieldsListVisible && fieldsData.map((field, index) => (
//                         <Styles.fieldBlock key={index}>
//                             <Styles.fieldName>{field.properties.name}</Styles.fieldName>
//                             <Styles.btnBlock>
//                                 <Styles.btn onClick={() => handleCenterMap(field)}>
//                                     <Styles.btnIco pic={LocationIco}></Styles.btnIco>
//                                 </Styles.btn>
//                                 <Styles.btn onClick={() => handleEditField(field)}>
//                                     <Styles.btnIco pic={EditIco}></Styles.btnIco>
//                                 </Styles.btn>
//                             </Styles.btnBlock>
//                         </Styles.fieldBlock>
//                     ))}
//                 </Styles.list>
//             </Styles.wrapper>
//             {/* <Modals selectedField={selectedField} onClose={handleCloseModal} />  */}
//         </>
//     );
// }


import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Styles from './styles';
import EditIco from '../../assets/ico/edit-icon-black.png';
import LocationIco from '../../assets/ico/location.png';
import TriangleIco from '../../assets/ico/triangle.png';
import { selectAllFields } from '../../store/fieldsSlice'; // Імпорт селектора для отримання полів
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
                            <Styles.btn onClick={() => handleEditField(field)}>
                                <Styles.btnIco pic={EditIco}></Styles.btnIco>
                            </Styles.btn>
                        </Styles.btnBlock>
                    </Styles.fieldBlock>
                ))}
            </Styles.list>
        </Styles.wrapper>
    );
}