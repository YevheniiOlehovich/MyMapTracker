import React, { useState, useEffect } from 'react';
import Styles from './styles';
import Button from '../Button';
import { useDispatch } from 'react-redux';
import { closeAddFieldsModal } from '../../store/modalSlice';
import { fetchFields } from '../../store/fieldsSlice';
import apiRoutes from '../../helpres/ApiRoutes';

export default function AddFieldsModal({ field }) {
    console.log(field)
    const dispatch = useDispatch();
    const [currentSlide, setCurrentSlide] = useState(0); // Стан для відстеження поточного слайда
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
    const [isEditable, setIsEditable] = useState(false);
    const [matchingPlots, setMatchingPlots] = useState([]);
    const [notProcessed, setNotProcessed] = useState([]);

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
            setCalculatedArea(field.properties.calculated_area);
            setMatchingPlots(field.matching_plots);
            setNotProcessed(field.not_processed);

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
            setMatchingPlots([]);
            setNotProcessed([]);
        }
    }, [field]);

    console.log('matchingPlots:', matchingPlots);
    console.log('notProcessed:', notProcessed);

    const onClose = () => {
        dispatch(closeAddFieldsModal());
    };

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % 3); // Перемикаємо на наступний слайд
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + 3) % 3); // Перемикаємо на попередній слайд
    };

    const renderSlideContent = () => {
        switch (currentSlide) {
            case 0:
                return (
                    <>
                        <Styles.label>
                            <Styles.subtitle>Назва поля</Styles.subtitle>
                            <Styles.input
                                value={fieldName}
                                onChange={(e) => setFieldName(e.target.value)}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Ключ карти</Styles.subtitle>
                            <Styles.input
                                value={mapKey}
                                onChange={(e) => setMapKey(e.target.value)}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Код КОАТУУ</Styles.subtitle>
                            <Styles.input
                                value={koatuu}
                                onChange={(e) => setKoatuu(e.target.value)}
                                disabled={!isEditable}
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
                    </>
                );
            case 1:
                return (
                    <>
                        <Styles.label>
                            <Styles.subtitle>Культура</Styles.subtitle>
                            <Styles.input
                                value={culture}
                                onChange={(e) => setCulture(e.target.value)}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Сорт</Styles.subtitle>
                            <Styles.input
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Дата</Styles.subtitle>
                            <Styles.input
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Урожай</Styles.subtitle>
                            <Styles.input
                                value={crop}
                                onChange={(e) => setCrop(e.target.value)}
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
                                value={fieldArea}
                                onChange={(e) => setFieldArea(e.target.value)}
                                disabled={!isEditable}
                            />
                        </Styles.label>
                        <Styles.label>
                            <Styles.subtitle>Розрахована площа поля (га)</Styles.subtitle>
                            <Styles.subtitle>{calculatedArea}</Styles.subtitle>    
                        </Styles.label>

                        {/* Відображення matchingPlots */}
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

                        {/* Відображення notProcessed */}
                        <Styles.labelBlock>
                            <Styles.subtitle>Неопрацьовані ділянки</Styles.subtitle>
                            {Array.isArray(notProcessed) && notProcessed.length > 0 ? (
                                notProcessed.map((plot, index) => (
                                    <Styles.rowBlock key={plot.id || index}>
                                        <Styles.text>UID: {plot?.properties?.uid}</Styles.text>
                                        <Styles.text>Площа: {plot?.properties?.area} га</Styles.text>
                                    </Styles.rowBlock>
                                ))
                            ) : (
                                <Styles.subtitle>Немає неопрацьованих ділянок</Styles.subtitle>
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
                    <Styles.arrowBtn direction="right" onClick={handleNextSlide} />
                    <Styles.arrowBtn direction="left" onClick={handlePrevSlide} />
                </Styles.arrowBlock>
                <Styles.closeButton onClick={onClose} />
                <Styles.title>{field ? 'Редагування поля' : 'Створення нового поля'}</Styles.title>
                <Styles.labelBlock>{renderSlideContent()}</Styles.labelBlock>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', width: `100%` }}>
                    <Button text={'Редагувати'} onClick={() => setIsEditable(true)} />
                    <Button text={'Зберегти'} onClick={() => {}} />
                </div>
            </Styles.modal>
        </Styles.wrapper>
    );
}



