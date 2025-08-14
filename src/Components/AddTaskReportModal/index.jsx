import closeModal from '../../helpres/closeModal';
import Button from '../Button';
import Styles from './styled';
import MapBlock from '../MapBlock';
import { useSelector } from 'react-redux';
import { useFieldsData } from '../../hooks/useFieldsData';

export default function AddTaskReportModal({ onClose}) {
    const handleWrapperClick = closeModal(onClose);

    const taskReportData = useSelector(state => state.modals.editTaskReportData);
    const { data: fieldsData = [] } = useFieldsData();

    console.log(taskReportData)
    console.log(fieldsData);

    return (
        <Styles.StyledWrapper onClick={handleWrapperClick}>
            <Styles.StyledModal onClick={e => e.stopPropagation()}>
                <Styles.StyledCloseButton onClick={handleWrapperClick} />
                    <Styles.StyledTitle>Звіт по виконанню завдання {taskReportData?.order|| ''}</Styles.StyledTitle>
                    <Styles.StyledColumn>
                        <Styles.StyledSubtitle>
                            Поле: {taskReportData?.fieldId?.properties?.name || ''}
                        </Styles.StyledSubtitle>
                        <Styles.StyledSubtitle>
                            Виконавець: {taskReportData?.personnelId ? `${taskReportData.personnelId.lastName} ${taskReportData.personnelId.firstName}` : ''}
                        </Styles.StyledSubtitle>
                        <Styles.StyledSubtitle>
                            Транспорт: {taskReportData?.vehicleId 
                                ? `${taskReportData.vehicleId.mark || taskReportData.vehicleId.vehicleType || ''} ${taskReportData.vehicleId.regNumber ? `(${taskReportData.vehicleId.regNumber})` : ''}`
                                : ''}
                        </Styles.StyledSubtitle>

                        <Styles.StyledSubtitle>
                            Техніка: {taskReportData?.techniqueId?.name || ''}
                        </Styles.StyledSubtitle>
                        
                        <Styles.StyledSubtitle>
                        Створено: {taskReportData?.createdAt 
                            ? new Date(taskReportData.createdAt).toLocaleDateString('uk-UA', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            }) + ' ' + new Date(taskReportData.createdAt).toLocaleTimeString('uk-UA', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                            : ''}
                        </Styles.StyledSubtitle>
                    </Styles.StyledColumn>
                    
                    <Styles.StyledColumn>
                        <Styles.StyledMapBlock>
                            {taskReportData?.fieldId && (
                                <MapBlock
                                field={{ value: taskReportData.fieldId._id }}  
                                fieldsList={fieldsData}                        
                                height="100%"
                                />
                            )}
                            </Styles.StyledMapBlock>
                    </Styles.StyledColumn>
                    
                    {/* <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                        <Button text={'Зберегти'} onClick={handleSave}/>
                        <Button text={'Зберегти'}/>
                    </div> */}
            </Styles.StyledModal>
        </Styles.StyledWrapper>
    );
}