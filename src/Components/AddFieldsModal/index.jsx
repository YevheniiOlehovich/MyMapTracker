import React, { useState, useEffect } from 'react';
import Styles from './styles';
import Button from '../Button';
import { useDispatch } from 'react-redux';
import { closeAddFieldsModal } from '../../store/modalSlice'; // Імпорт дії для закриття модалки
import { fetchFields } from '../../store/fieldsSlice'; // Імпорт дії для фетчінгу всіх полів
import apiRoutes from '../../helpres/ApiRoutes'; // Імпорт маршрутів API

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
    const [isEditable, setIsEditable] = useState(false); // Додаємо стан для блокування/розблокування інпутів

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

    const handleSave = async () => {
        const updatedField = {
            properties: {
                name: fieldName,
                mapkey: mapKey,
                area: fieldArea,
                koatuu: koatuu,
                note: note,
                culture: culture,
                sort: sort,
                date: date,
                crop: crop,
                branch: branch,
                region: region,
            },
        };

        try {
            const response = await fetch(apiRoutes.updateField(field._id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedField),
            });

            if (!response.ok) {
                throw new Error('Помилка при оновленні поля');
            }

            const result = await response.json();
            console.log('Поле оновлено:', result);
            dispatch(fetchFields()); // Запускаємо оновлення фетчінгу всіх полів
            onClose();
        } catch (error) {
            console.error('Помилка:', error);
        }
    };

    const handleEdit = () => {
        setIsEditable(true); // Розблоковуємо інпути при натисканні на кнопку "Редагувати"
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
                        disabled={!isEditable} // Блокуємо інпут за замовчуванням
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Ключ карти</Styles.subtitle>
                    <Styles.input
                        value={mapKey}
                        onChange={(e) => setMapKey(e.target.value)} // Зберігаємо ключ карти
                        disabled={!isEditable} // Блокуємо інпут за замовчуванням
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Площа поля (га)</Styles.subtitle>
                    <Styles.input
                        value={fieldArea}
                        onChange={(e) => setFieldArea(e.target.value)} // Зберігаємо площу поля
                        disabled={!isEditable} // Блокуємо інпут за замовчуванням
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Код КОАТУУ</Styles.subtitle>
                    <Styles.input
                        value={koatuu}
                        onChange={(e) => setKoatuu(e.target.value)} // Зберігаємо код КОАТУУ
                        disabled={!isEditable} // Блокуємо інпут за замовчуванням
                    />
                </Styles.label>
                
                <Styles.label>
                    <Styles.subtitle>Культура</Styles.subtitle>
                    <Styles.input
                        value={culture}
                        onChange={(e) => setCulture(e.target.value)} // Зберігаємо культуру
                        disabled={!isEditable} // Блокуємо інпут за замовчуванням
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Сорт</Styles.subtitle>
                    <Styles.input
                        value={sort}
                        onChange={(e) => setSort(e.target.value)} // Зберігаємо сорт
                        disabled={!isEditable} // Блокуємо інпут за замовчуванням
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Дата</Styles.subtitle>
                    <Styles.input
                        value={date}
                        onChange={(e) => setDate(e.target.value)} // Зберігаємо дату
                        disabled={!isEditable} // Блокуємо інпут за замовчуванням
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Урожай</Styles.subtitle>
                    <Styles.input
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)} // Зберігаємо урожай
                        disabled={!isEditable} // Блокуємо інпут за замовчуванням
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Філія</Styles.subtitle>
                    <Styles.input
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)} // Зберігаємо філію
                        disabled={!isEditable} // Блокуємо інпут за замовчуванням
                    />
                </Styles.label>
                <Styles.label>
                    <Styles.subtitle>Регіон</Styles.subtitle>
                    <Styles.input
                        value={region}
                        onChange={(e) => setRegion(e.target.value)} // Зберігаємо регіон
                        disabled={!isEditable} // Блокуємо інпут за замовчуванням
                    />
                </Styles.label>

                <Styles.label>
                    {/* <Styles.subtitle>Примітка</Styles.subtitle> */}
                    <Styles.textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)} // Зберігаємо примітку
                        disabled={!isEditable} // Блокуємо textarea за замовчуванням
                    />
                </Styles.label>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', width: `100%` }}>
                    <Button text={'Редагувати'} onClick={handleEdit} />
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </Styles.modal>
        </Styles.wrapper>
    );
}