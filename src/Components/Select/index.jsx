import React from 'react';
import Select from 'react-select';

export default function SelectComponent({ options, value, onChange, placeholder }) {
    return (
        <div style={{ width: '300px', margin: '0 auto' }}>
            <Select 
                value={value} // Передача обраного значення
                onChange={onChange} // Обробка зміни
                options={options} // Передаємо опції через пропси
                placeholder={placeholder} // Передаємо плейсхолдер через пропси
                isLoading={options.length === 0} // Показуємо індикатор завантаження, якщо опцій ще немає
            />
        </div>
    );
}
