import React, { useState, useEffect } from 'react';
import Styles from './styles';
import Button from '../Button';
import { useDispatch } from 'react-redux';
import { closeAddFieldsModal } from '../../store/modalSlice';
import { updateField } from '../../store/fieldsSlice';
import apiRoutes from '../../helpres/ApiRoutes';

export default function AddFieldsModal({ field }) {
    const dispatch = useDispatch();
    const TOTAL_SLIDES = 3; // Кількість слайдів
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isEditable, setIsEditable] = useState(false);
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
    const [calculatedArea, setCalculatedArea] = useState('');
    const [matchingPlots, setMatchingPlots] = useState([]);
    const [notProcessed, setNotProcessed] = useState([]);

    useEffect(() => {
        if (field?.properties) {
            setFieldName(field.properties.name || '');
            setMapKey(field.properties.mapkey || '');
            setFieldArea(field.properties.area || '');
            setKoatuu(field.properties.koatuu || '');
            setNote(field.properties.note || '');
            setCulture(field.properties.culture || '');
            setSort(field.properties.sort || '');
            setDate(field.properties.date || '');
            setCrop(field.properties.crop || '');
            setBranch(field.properties.branch || '');
            setRegion(field.properties.region || '');
            setCalculatedArea(field.properties.calculated_area || '');
            setMatchingPlots(field.matching_plots || []);
            setNotProcessed(field.not_processed || []);
        }
    }, [field]);

    const onClose = (e) => {
        e.stopPropagation();
        dispatch(closeAddFieldsModal());
    };

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % TOTAL_SLIDES);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
    };

    const handleSave = async () => {
        const fieldData = {
            _id: field?._id, // Передаємо ID, якщо є
            type: "Feature",
            properties: {
                name: fieldName,
                branch: branch,
                crop: crop,
                date: date,
                sort: sort,
                mapkey: mapKey,
                area: fieldArea,
                koatuu: koatuu,
                note: note,
                culture: culture,
                region: region,
                calculated_area: calculatedArea,
            },
            geometry: field?.geometry || { type: "Polygon", coordinates: [] },
            matching_plots: matchingPlots,
            not_processed: notProcessed,
        };

        try {
            let response;
            if (field?._id) {
                response = await fetch(apiRoutes.updateField(field._id), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(fieldData),
                });
            } else {
                response = await fetch(apiRoutes.addFields, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(fieldData),
                });
            }

            if (!response.ok) {
                throw new Error('Не вдалося зберегти поле');
            }

            const updatedField = await response.json();
            console.log(field?._id ? 'Поле оновлено' : 'Поле створено', updatedField);

            // Оновлюємо стан полів у Redux
            dispatch(updateField(updatedField));

            setIsEditable(false);
            dispatch(closeAddFieldsModal());
        } catch (error) {
            console.error('Помилка збереження:', error.message);
        }
    };

    const renderSlideContent = () => {
        switch (currentSlide) {
            case 0:
                return (
                    <>
                        <Styles.label>
                            <Styles.subtitle>Назва поля</Styles.subtitle>
                            <Styles.input value={fieldName} onChange={(e) => setFieldName(e.target.value)} disabled={!isEditable} />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Ключ карти</Styles.subtitle>
                            <Styles.input value={mapKey} onChange={(e) => setMapKey(e.target.value)} disabled={!isEditable} />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Код КОАТУУ</Styles.subtitle>
                            <Styles.input value={koatuu} onChange={(e) => setKoatuu(e.target.value)} disabled={!isEditable} />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Філія</Styles.subtitle>
                            <Styles.input value={branch} onChange={(e) => setBranch(e.target.value)} disabled={!isEditable} />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Регіон</Styles.subtitle>
                            <Styles.input value={region} onChange={(e) => setRegion(e.target.value)} disabled={!isEditable} />
                        </Styles.label>
                        <Styles.label>
                            <Styles.textarea value={note} onChange={(e) => setNote(e.target.value)} disabled={!isEditable} />
                        </Styles.label>
                    </>
                );
            case 1:
                return (
                    <>
                        <Styles.label>
                            <Styles.subtitle>Культура</Styles.subtitle>
                            <Styles.input value={culture} onChange={(e) => setCulture(e.target.value)} disabled={!isEditable} />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Сорт</Styles.subtitle>
                            <Styles.input value={sort} onChange={(e) => setSort(e.target.value)} disabled={!isEditable} />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Дата</Styles.subtitle>
                            <Styles.input value={date} onChange={(e) => setDate(e.target.value)} disabled={!isEditable} />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Урожай</Styles.subtitle>
                            <Styles.input value={crop} onChange={(e) => setCrop(e.target.value)} disabled={!isEditable} />
                        </Styles.label>
                    </>
                );
            case 2:
                return (
                    <>
                        <Styles.label>
                            <Styles.subtitle>Площа поля (га)</Styles.subtitle>
                            <Styles.input value={fieldArea} onChange={(e) => setFieldArea(e.target.value)} disabled={!isEditable} />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Розрахована площа поля (га)</Styles.subtitle>
                            <Styles.subtitle>{calculatedArea}</Styles.subtitle>
                        </Styles.label>
                        <Styles.labelBlock>
                            <Styles.subtitle>Відповідні ділянки</Styles.subtitle>
                            {matchingPlots.length > 0 ? (
                                matchingPlots.map((plot, index) => (
                                    <Styles.rowBlock key={plot.id || index}>
                                        <Styles.text>UID: {plot.properties?.uid}</Styles.text>
                                        <Styles.text>Площа: {plot.properties?.area} га</Styles.text>
                                    </Styles.rowBlock>
                                ))
                            ) : (
                                <Styles.text>Немає відповідних ділянок</Styles.text>
                            )}
                        </Styles.labelBlock>
                        <Styles.labelBlock>
                            <Styles.subtitle>Неопрацьовані ділянки</Styles.subtitle>
                            {notProcessed.length > 0 ? (
                                notProcessed.map((plot, index) => (
                                    <Styles.rowBlock key={plot.id || index}>
                                        <Styles.text>UID: {plot?.properties?.uid}</Styles.text>
                                        <Styles.text>Площа: {plot?.properties?.area} га</Styles.text>
                                    </Styles.rowBlock>
                                ))
                            ) : (
                                <Styles.text>Немає неопрацьованих ділянок</Styles.text>
                            )}
                        </Styles.labelBlock>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Styles.wrapper onClick={onClose}>
            <Styles.modal onClick={(e) => e.stopPropagation()}>
                <Styles.arrowBlock>
                    <Styles.arrowBtn direction="left" onClick={handlePrevSlide} />
                    <Styles.arrowBtn direction="right" onClick={handleNextSlide} />
                </Styles.arrowBlock>
                <Styles.closeButton onClick={onClose} />
                <Styles.title>{field ? 'Редагування поля' : 'Створення нового поля'}</Styles.title>
                <Styles.labelBlock>{renderSlideContent()}</Styles.labelBlock>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Button text="Редагувати" onClick={() => setIsEditable(true)} />
                    <Button text="Зберегти" onClick={handleSave} />
                </div>
            </Styles.modal>
        </Styles.wrapper>
    );
}