// // import React, { useState, useEffect } from 'react';
// // import Styles from './styles';
// // import closeModal from "../../helpres/closeModal";
// // import Button from '../Button';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { closeAddFieldsModal } from '../../store/modalSlice'; // Імпорт дії для закриття модалки

// // export default function AddFieldsModal() {
// //     const dispatch = useDispatch();
// //     const editFieldId = useSelector((state) => state.modals.editFieldId); // Отримання ідентифікатора редагованого поля з Redux
// //     const [groupName, setGroupName] = useState('');

// //     useEffect(() => {
// //         if (editFieldId) {
// //             // Завантажити дані поля для редагування, якщо є editFieldId
// //             // setGroupName(отримані дані);
// //         }
// //     }, [editFieldId]);

// //     // const handleWrapperClick = (e) => {
// //     //     if (e.target === e.currentTarget) {
// //     //         dispatch(closeAddFieldsModal());
// //     //     }
// //     // };

// //     const onClose = () => {
// //         dispatch(closeAddFieldsModal());
// //     };

// //     return (
// //         // <Styles.wrapper onClick={handleWrapperClick}>
// //             <Styles.modal>
// //                 <Styles.closeButton onClick={onClose} />
// //                 <Styles.title>{editFieldId ? 'Редагування поля' : 'Створення нового поля'}</Styles.title>
// //                 <Styles.label>
// //                     <Styles.subtitle>Назва нового поля</Styles.subtitle>
// //                     <Styles.input
// //                         value={groupName}
// //                         onChange={(e) => setGroupName(e.target.value)} // Зберігаємо назву поля
// //                     />
// //                 </Styles.label>
// //                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
// //                     <Button text={'Зберегти'} onClick={() => { /* Додати функціонал збереження */ }} />
// //                 </div>
// //             </Styles.modal>
// //         // </Styles.wrapper>
// //     );
// // }

// import React, { useState, useEffect } from 'react';
// import Styles from './styles';
// import Button from '../Button';
// import { useDispatch, useSelector } from 'react-redux';
// import { closeAddFieldsModal } from '../../store/modalSlice'; // Імпорт дії для закриття модалки

// export default function AddFieldsModal() {
//     const dispatch = useDispatch();
//     const editFieldId = useSelector((state) => state.modals.editFieldId); // Отримання ідентифікатора редагованого поля з Redux
//     const [groupName, setGroupName] = useState('');

//     useEffect(() => {
//         if (editFieldId) {
//             // Завантажити дані поля для редагування, якщо є editFieldId
//             // setGroupName(отримані дані);
//         }
//     }, [editFieldId]);

//     const onClose = () => {
//         dispatch(closeAddFieldsModal());
//     };

//     return (
//         <Styles.wrapper onClick={onClose}>
//             <Styles.modal onClick={(e) => e.stopPropagation()}>
//                 <Styles.closeButton onClick={onClose} />
//                 <Styles.title>{editFieldId ? 'Редагування поля' : 'Створення нового поля'}</Styles.title>
//                 <Styles.label>
//                     <Styles.subtitle>Назва нового поля</Styles.subtitle>
//                     <Styles.input
//                         value={groupName}
//                         onChange={(e) => setGroupName(e.target.value)} // Зберігаємо назву поля
//                     />
//                 </Styles.label>
//                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
//                     <Button text={'Зберегти'} onClick={() => { /* Додати функціонал збереження */ }} />
//                 </div>
//             </Styles.modal>
//         </Styles.wrapper>
//     );
// }


// import React, { useState, useEffect } from 'react';
// import Styles from './styles';
// import Button from '../Button';
// import { useDispatch, useSelector } from 'react-redux';
// import { closeAddFieldsModal } from '../../store/modalSlice'; // Імпорт дії для закриття модалки
// import { selectFieldById } from '../../store/fieldsSlice'; // Імпорт селектора для отримання поля за ID

// export default function AddFieldsModal() {
//     const dispatch = useDispatch();
//     const editFieldId = useSelector((state) => state.modals.editFieldId); // Отримання ідентифікатора редагованого поля з Redux
//     const fieldData = useSelector((state) => selectFieldById(state, editFieldId)); // Отримання даних поля за ID
//     const [fieldName, setFieldName] = useState('');
//     const [fieldArea, setFieldArea] = useState('');
//     const [fieldNote, setFieldNote] = useState('');

//     useEffect(() => {
//         if (editFieldId && fieldData) {
//             setFieldName(fieldData.properties.name);
//             setFieldArea(fieldData.properties.area);
//             setFieldNote(fieldData.properties.note);
//         } else {
//             setFieldName('');
//             setFieldArea('');
//             setFieldNote('');
//         }
//     }, [editFieldId, fieldData]);

//     const onClose = () => {
//         dispatch(closeAddFieldsModal());
//     };

//     return (
//         <Styles.wrapper onClick={onClose}>
//             <Styles.modal onClick={(e) => e.stopPropagation()}>
//                 <Styles.closeButton onClick={onClose} />
//                 <Styles.title>{editFieldId ? 'Редагування поля' : 'Створення нового поля'}</Styles.title>
//                 <Styles.label>
//                     <Styles.subtitle>Назва поля</Styles.subtitle>
//                     <Styles.input
//                         value={fieldName}
//                         onChange={(e) => setFieldName(e.target.value)} // Зберігаємо назву поля
//                     />
//                 </Styles.label>
//                 <Styles.label>
//                     <Styles.subtitle>Площа поля (га)</Styles.subtitle>
//                     <Styles.input
//                         value={fieldArea}
//                         onChange={(e) => setFieldArea(e.target.value)} // Зберігаємо площу поля
//                     />
//                 </Styles.label>
//                 <Styles.label>
//                     <Styles.subtitle>Примітка</Styles.subtitle>
//                     <Styles.input
//                         value={fieldNote}
//                         onChange={(e) => setFieldNote(e.target.value)} // Зберігаємо примітку
//                     />
//                 </Styles.label>
//                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
//                     <Button text={'Зберегти'} onClick={() => { /* Додати функціонал збереження */ }} />
//                 </div>
//             </Styles.modal>
//         </Styles.wrapper>
//     );
// }


// import React, { useState, useEffect } from 'react';
// import Styles from './styles';
// import Button from '../Button';
// import { useDispatch, useSelector } from 'react-redux';
// import { closeAddFieldsModal } from '../../store/modalSlice'; // Імпорт дії для закриття модалки
// import { selectFieldById } from '../../store/fieldsSlice'; // Імпорт селектора для отримання поля за ID

// export default function AddFieldsModal() {
//     const dispatch = useDispatch();
//     const editFieldId = useSelector((state) => state.modals.editFieldId); // Отримання ідентифікатора редагованого поля з Redux
//     const fieldData = useSelector((state) => selectFieldById(state, editFieldId)); // Отримання даних поля за ID
//     const [fieldName, setFieldName] = useState('');
//     const [fieldArea, setFieldArea] = useState('');
//     const [fieldNote, setFieldNote] = useState('');

//     useEffect(() => {
//         if (editFieldId && fieldData) {
//             setFieldName(fieldData.properties.name);
//             setFieldArea(fieldData.properties.area);
//             setFieldNote(fieldData.properties.note);
//         } else {
//             setFieldName('');
//             setFieldArea('');
//             setFieldNote('');
//         }
//     }, [editFieldId, fieldData]);

//     const onClose = () => {
//         dispatch(closeAddFieldsModal());
//     };

//     return (
//         <Styles.wrapper onClick={onClose}>
//             <Styles.modal onClick={(e) => e.stopPropagation()}>
//                 <Styles.closeButton onClick={onClose} />
//                 <Styles.title>{editFieldId ? 'Редагування поля' : 'Створення нового поля'}</Styles.title>
//                 <Styles.label>
//                     <Styles.subtitle>Назва поля</Styles.subtitle>
//                     <Styles.input
//                         value={fieldName}
//                         onChange={(e) => setFieldName(e.target.value)} // Зберігаємо назву поля
//                     />
//                 </Styles.label>
//                 <Styles.label>
//                     <Styles.subtitle>Площа поля (га)</Styles.subtitle>
//                     <Styles.input
//                         value={fieldArea}
//                         onChange={(e) => setFieldArea(e.target.value)} // Зберігаємо площу поля
//                     />
//                 </Styles.label>
//                 <Styles.label>
//                     <Styles.subtitle>Примітка</Styles.subtitle>
//                     <Styles.input
//                         value={fieldNote}
//                         onChange={(e) => setFieldNote(e.target.value)} // Зберігаємо примітку
//                     />
//                 </Styles.label>
//                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
//                     <Button text={'Зберегти'} onClick={() => { /* Додати функціонал збереження */ }} />
//                 </div>
//             </Styles.modal>
//         </Styles.wrapper>
//     );
// }



// import React, { useState, useEffect } from 'react';
// import Styles from './styles';
// import Button from '../Button';

// export default function AddFieldsModal({ field, onClose }) {
//     const [fieldName, setFieldName] = useState('');
//     const [fieldArea, setFieldArea] = useState('');
//     const [fieldNote, setFieldNote] = useState('');

//     useEffect(() => {
//         if (field) {
//             setFieldName(field.properties.name);
//             setFieldArea(field.properties.area);
//             setFieldNote(field.properties.note);
//         } else {
//             setFieldName('');
//             setFieldArea('');
//             setFieldNote('');
//         }
//     }, [field]);

//     return (
//         <Styles.wrapper onClick={onClose}>
//             <Styles.modal onClick={(e) => e.stopPropagation()}>
//                 <Styles.closeButton onClick={onClose} />
//                 <Styles.title>{field ? 'Редагування поля' : 'Створення нового поля'}</Styles.title>
//                 <Styles.label>
//                     <Styles.subtitle>Назва поля</Styles.subtitle>
//                     <Styles.input
//                         value={fieldName}
//                         onChange={(e) => setFieldName(e.target.value)} // Зберігаємо назву поля
//                     />
//                 </Styles.label>
//                 <Styles.label>
//                     <Styles.subtitle>Площа поля (га)</Styles.subtitle>
//                     <Styles.input
//                         value={fieldArea}
//                         onChange={(e) => setFieldArea(e.target.value)} // Зберігаємо площу поля
//                     />
//                 </Styles.label>
//                 <Styles.label>
//                     <Styles.subtitle>Примітка</Styles.subtitle>
//                     <Styles.input
//                         value={fieldNote}
//                         onChange={(e) => setFieldNote(e.target.value)} // Зберігаємо примітку
//                     />
//                 </Styles.label>
//                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
//                     <Button text={'Зберегти'} onClick={() => { /* Додати функціонал збереження */ }} />
//                 </div>
//             </Styles.modal>
//         </Styles.wrapper>
//     );
// }


// import React, { useState, useEffect } from 'react';
// import Styles from './styles';
// import Button from '../Button';

// export default function AddFieldsModal({ field, onClose }) {
//     const [fieldName, setFieldName] = useState('');
//     const [fieldArea, setFieldArea] = useState('');
//     const [fieldNote, setFieldNote] = useState('');

//     useEffect(() => {
//         if (field) {
//             setFieldName(field.properties.name);
//             setFieldArea(field.properties.area);
//             setFieldNote(field.properties.note);
//         } else {
//             setFieldName('');
//             setFieldArea('');
//             setFieldNote('');
//         }
//     }, [field]);

//     return (
//         <Styles.wrapper onClick={onClose}>
//             <Styles.modal onClick={(e) => e.stopPropagation()}>
//                 <Styles.closeButton onClick={onClose} />
//                 <Styles.title>{field ? 'Редагування поля' : 'Створення нового поля'}</Styles.title>
//                 <Styles.label>
//                     <Styles.subtitle>Назва поля</Styles.subtitle>
//                     <Styles.input
//                         value={fieldName}
//                         onChange={(e) => setFieldName(e.target.value)} // Зберігаємо назву поля
//                     />
//                 </Styles.label>
//                 <Styles.label>
//                     <Styles.subtitle>Площа поля (га)</Styles.subtitle>
//                     <Styles.input
//                         value={fieldArea}
//                         onChange={(e) => setFieldArea(e.target.value)} // Зберігаємо площу поля
//                     />
//                 </Styles.label>
//                 <Styles.label>
//                     <Styles.subtitle>Примітка</Styles.subtitle>
//                     <Styles.input
//                         value={fieldNote}
//                         onChange={(e) => setFieldNote(e.target.value)} // Зберігаємо примітку
//                     />
//                 </Styles.label>
//                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
//                     <Button text={'Зберегти'} onClick={() => { /* Додати функціонал збереження */ }} />
//                 </div>
//             </Styles.modal>
//         </Styles.wrapper>
//     );
// }


import React, { useState, useEffect } from 'react';
import Styles from './styles';
import Button from '../Button';
import { useDispatch } from 'react-redux';
import { closeAddFieldsModal } from '../../store/modalSlice'; // Імпорт дії для закриття модалки

export default function AddFieldsModal({ field }) {
    const dispatch = useDispatch();
    const [fieldName, setFieldName] = useState('');
    const [mapKey, setMapKey] = useState('');
    const [fieldArea, setFieldArea] = useState('');
    const [koatuu, setKoatuu] = useState('');
    const [note, setNote] = useState('');
    const [culture, setCulture] = useState('');
    const [sort, setSort] = useState('');
    const [date, setDate] = useState('');
    const [crop, setCrop] = useState('');
    const [branch, setBranch] = useState('');
    const [region, setRegion] = useState('');

    useEffect(() => {
        if (field) {
            setFieldName(field.properties.name);
            setMapKey(field.properties.mapkey);
            setFieldArea(field.properties.area);
            setKoatuu(field.properties.koatuu);
            setNote(field.properties.note);
            setCulture(field.properties.culture);
            setSort(field.properties.sort);
            setDate(field.properties.date);
            setCrop(field.properties.crop);
            setBranch(field.properties.branch);
            setRegion(field.properties.region);
        } else {
            setFieldName('');
            setMapKey('');
            setFieldArea('');
            setKoatuu('');
            setNote('');
            setCulture('');
            setSort('');
            setDate('');
            setCrop('');
            setBranch('');
            setRegion('');
        }
    }, [field]);

    const onClose = () => {
        dispatch(closeAddFieldsModal());
    };

    return (
        <Styles.wrapper onClick={onClose}>
            <Styles.modal onClick={(e) => e.stopPropagation()}>
                <Styles.closeButton onClick={onClose} />
                <Styles.title>{field ? 'Редагування поля' : 'Створення нового поля'}</Styles.title>
                <Styles.label>
                    <Styles.subtitle>Назва поля</Styles.subtitle>
                    <Styles.input
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)} // Зберігаємо назву поля
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Ключ карти</Styles.subtitle>
                    <Styles.input
                        value={mapKey}
                        onChange={(e) => setMapKey(e.target.value)} // Зберігаємо ключ карти
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Площа поля (га)</Styles.subtitle>
                    <Styles.input
                        value={fieldArea}
                        onChange={(e) => setFieldArea(e.target.value)} // Зберігаємо площу поля
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Код КОАТУУ</Styles.subtitle>
                    <Styles.input
                        value={koatuu}
                        onChange={(e) => setKoatuu(e.target.value)} // Зберігаємо код КОАТУУ
                    />
                </Styles.label>
                
                <Styles.label>
                    <Styles.subtitle>Культура</Styles.subtitle>
                    <Styles.input
                        value={culture}
                        onChange={(e) => setCulture(e.target.value)} // Зберігаємо культуру
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Сорт</Styles.subtitle>
                    <Styles.input
                        value={sort}
                        onChange={(e) => setSort(e.target.value)} // Зберігаємо сорт
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Дата</Styles.subtitle>
                    <Styles.input
                        value={date}
                        onChange={(e) => setDate(e.target.value)} // Зберігаємо дату
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Урожай</Styles.subtitle>
                    <Styles.input
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)} // Зберігаємо урожай
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Філія</Styles.subtitle>
                    <Styles.input
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)} // Зберігаємо філію
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Регіон</Styles.subtitle>
                    <Styles.input
                        value={region}
                        onChange={(e) => setRegion(e.target.value)} // Зберігаємо регіон
                    />
                </Styles.label>

                <Styles.label>
                    {/* <Styles.subtitle>Примітка</Styles.subtitle> */}
                    <Styles.textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)} // Зберігаємо примітку
                    />
                </Styles.label>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button text={'Зберегти'} onClick={() => { /* Додати функціонал збереження */ }} />
                </div>
            </Styles.modal>
        </Styles.wrapper>
    );
}