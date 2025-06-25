import React, { useState, useEffect } from 'react';
import Styles from './styles';
import Button from '../Button';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { useFieldsData, useUpdateField } from '../../hooks/useFieldsData';
import { closeAddFieldsModal } from '../../store/modalSlice';

export default function AddFieldsModal() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    // Отримуємо всі поля через React Query
    const { data: fields, isLoading, error } = useFieldsData();
    const updateField = useUpdateField();

    // Отримуємо fieldId із Redux Store
    const fieldId = useSelector((state) => state.modals?.selectedField);

    // Знаходимо потрібне поле за fieldId
    const field = fields?.find((f) => f._id === fieldId);

    const TOTAL_SLIDES = 3; // Кількість слайдів
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isEditable, setIsEditable] = useState(false);

    // Локальний стан для властивостей поля
    const [fieldState, setFieldState] = useState({
        fieldName: '',
        mapKey: '',
        fieldArea: '',
        koatuu: '',
        note: '',
        culture: '',
        sort: '',
        date: '',
        crop: '',
        branch: '',
        region: '',
        calculatedArea: '',
        matchingPlots: [],
        notProcessed: [],
    });

    useEffect(() => {
        if (field?.properties) {
            setFieldState({
                fieldName: field.properties.name || '',
                mapKey: field.properties.mapkey || '',
                fieldArea: field.properties.area || '',
                koatuu: field.properties.koatuu || '',
                note: field.properties.note || '',
                culture: field.properties.culture || '',
                sort: field.properties.sort || '',
                date: field.properties.date || '',
                crop: field.properties.crop || '',
                branch: field.properties.branch || '',
                region: field.properties.region || '',
                calculatedArea: field.properties.calculated_area || '',
                matchingPlots: field.matching_plots || [],
                notProcessed: field.not_processed || [],
            });
        }
    }, [field]);

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % TOTAL_SLIDES);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
    };

    const handleSave = async () => {
        const fieldData = {
            _id: fieldId,
            type: "Feature",
            properties: {
                name: fieldState.fieldName,
                branch: fieldState.branch,
                crop: fieldState.crop,
                date: fieldState.date,
                sort: fieldState.sort,
                mapkey: fieldState.mapKey,
                area: fieldState.fieldArea,
                koatuu: fieldState.koatuu,
                note: fieldState.note,
                culture: fieldState.culture,
                region: fieldState.region,
                calculated_area: fieldState.calculatedArea,
            },
            geometry: field?.geometry || { type: "Polygon", coordinates: [] },
            matching_plots: fieldState.matchingPlots,
            not_processed: fieldState.notProcessed,
        };

        try {
            await updateField.mutateAsync(fieldData);
            console.log('Поле оновлено');
            setIsEditable(false);
            queryClient.invalidateQueries(['fields']); // Інвалідуємо кеш
            dispatch(closeAddFieldsModal()); // Закриваємо модалку
        } catch (error) {
            console.error('Помилка збереження:', error.message);
            alert('Не вдалося зберегти поле. Спробуйте ще раз.');
        }
    };

    // Закриття модалки
    const handleClose = () => {
        dispatch(closeAddFieldsModal());
    };

    // Додаємо обробку Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const renderSlideContent = () => {
        if (!field) {
            return <p>Поле не знайдено</p>;
        }

        switch (currentSlide) {
            case 0:
                return (
                    <>
                        <Styles.label>
                            <Styles.subtitle>Назва поля</Styles.subtitle>
                            <Styles.input
                                value={fieldState.fieldName}
                                onChange={(e) => setFieldState({ ...fieldState, fieldName: e.target.value })}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Ключ карти</Styles.subtitle>
                            <Styles.input
                                value={fieldState.mapKey}
                                onChange={(e) => setFieldState({ ...fieldState, mapKey: e.target.value })}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Код КОАТУУ</Styles.subtitle>
                            <Styles.input
                                value={fieldState.koatuu}
                                onChange={(e) => setFieldState({ ...fieldState, koatuu: e.target.value })}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Філія</Styles.subtitle>
                            <Styles.input
                                value={fieldState.branch}
                                onChange={(e) => setFieldState({ ...fieldState, branch: e.target.value })}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Регіон</Styles.subtitle>
                            <Styles.input
                                value={fieldState.region}
                                onChange={(e) => setFieldState({ ...fieldState, region: e.target.value })}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.textarea
                                value={fieldState.note}
                                onChange={(e) => setFieldState({ ...fieldState, note: e.target.value })}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                    </>
                );
            case 1:
                return (
                    <>
                        <Styles.label>
                            <Styles.subtitle>Культура</Styles.subtitle>
                            <Styles.input
                                value={fieldState.culture}
                                onChange={(e) => setFieldState({ ...fieldState, culture: e.target.value })}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Сорт</Styles.subtitle>
                            <Styles.input
                                value={fieldState.sort}
                                onChange={(e) => setFieldState({ ...fieldState, sort: e.target.value })}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Дата</Styles.subtitle>
                            <Styles.input
                                value={fieldState.date}
                                onChange={(e) => setFieldState({ ...fieldState, date: e.target.value })}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Урожай</Styles.subtitle>
                            <Styles.input
                                value={fieldState.crop}
                                onChange={(e) => setFieldState({ ...fieldState, crop: e.target.value })}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                    </>
                );
            case 2:
                return (
                    <>
                        <Styles.label>
                            <Styles.subtitle>Площа поля (га)</Styles.subtitle>
                            <Styles.input
                                value={fieldState.fieldArea}
                                onChange={(e) => setFieldState({ ...fieldState, fieldArea: e.target.value })}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Розрахована площа поля (га)</Styles.subtitle>
                            <Styles.subtitle>{fieldState.calculatedArea}</Styles.subtitle>
                        </Styles.label>
                        <Styles.labelBlock>
                            <Styles.subtitle>Відповідні ділянки</Styles.subtitle>
                            {fieldState.matchingPlots.length > 0 ? (
                                fieldState.matchingPlots.map((plot, index) => (
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
                            {fieldState.notProcessed.length > 0 ? (
                                fieldState.notProcessed.map((plot, index) => (
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

    if (isLoading) return <p>Завантаження...</p>;
    if (error) return <p>Помилка завантаження даних: {error.message}</p>;

    return (
        <Styles.wrapper onClick={handleClose}>
            <Styles.modal onClick={(e) => e.stopPropagation()}>
                <Styles.arrowBlock>
                    <Styles.arrowBtn direction="left" onClick={handlePrevSlide} />
                    <Styles.arrowBtn direction="right" onClick={handleNextSlide} />

                </Styles.arrowBlock>
                <Styles.closeButton onClick={handleClose} />
                <Styles.title>Редагування поля</Styles.title>
                <Styles.labelBlock>{renderSlideContent()}</Styles.labelBlock>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Button text="Редагувати" onClick={() => setIsEditable(true)} />
                    <Button text="Зберегти" onClick={handleSave} />
                </div>
            </Styles.modal>
        </Styles.wrapper>
    );
}