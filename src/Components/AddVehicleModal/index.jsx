import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Styles } from './styles';
import closeModal from '../../helpres/closeModal';
import Button from '../Button';
import QuestionIco from '../../assets/ico/10965421.webp';
import SelectComponent from '../Select';
import { vehicleTypes } from '../../helpres';
import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';
import { useGroupsData } from '../../hooks/useGroupsData';
import { useVehiclesData, useSaveVehicle, useUpdateVehicle, useDeleteVehicle } from '../../hooks/useVehiclesData';

export default function AddVehicleModal({ onClose }) {
    const { editGroupId, editVehicleId } = useSelector((state) => state.modals);
    const handleWrapperClick = closeModal(onClose);

    const { data: vehicles = [] } = useVehiclesData();
    const { data: groups = [] } = useGroupsData();

    const saveVehicle = useSaveVehicle();
    const updateVehicle = useUpdateVehicle();
    const deleteVehicle = useDeleteVehicle();

    const editVehicle = vehicles.find(vehicle => vehicle._id === editVehicleId);

    const [selectedGroup, setSelectedGroup] = useState(editVehicle ? editVehicle.groupId : null);
    const [selectedGroupName, setSelectedGroupName] = useState(editVehicle ? groups.find(group => group._id === editVehicle.groupId)?.name : '');

    const [regNumber, setRegNumber] = useState(editVehicle?.regNumber || '');
    const [imei, setImei] = useState(editVehicle?.imei || '');
    const [sim, setSim] = useState(editVehicle?.sim || '');
    const [mark, setMark] = useState(editVehicle?.mark || '');
    const [note, setNote] = useState(editVehicle?.note || '');
    const [vehicleType, setVehicleType] = useState(editVehicle?.vehicleType || '');

    const [employeePhoto, setEmployeePhoto] = useState(
        editVehicle?.photoPath
            ? '/src/' + editVehicle.photoPath.substring(3).replace(/\\/g, '/')
            : QuestionIco
    );

    const handleGroupChange = (option) => {
        setSelectedGroup(option.value);
        setSelectedGroupName(option.label);
    };

    const handleVehicleTypeChange = (option) => {
        setVehicleType(option?.value || '');
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const webpBlob = file.type === 'image/webp' ? file : await convertImageToWebP(file);
            setEmployeePhoto(webpBlob);
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('groupId', selectedGroup || editGroupId);
            formData.append('vehicleType', vehicleType);
            formData.append('regNumber', regNumber);
            formData.append('mark', mark);
            formData.append('note', note);
            formData.append('imei', imei);
            formData.append('sim', sim);

            if (employeePhoto instanceof Blob) {
                formData.append('photo', employeePhoto, 'vehicle.webp');
            } else if (typeof employeePhoto === 'string' && employeePhoto !== QuestionIco) {
                const blob = await createBlobFromImagePath(employeePhoto);
                formData.append('photo', blob, 'vehicle.webp');
            }

            if (editVehicleId) {
                await updateVehicle.mutateAsync({ id: editVehicleId, vehicleData: formData });
            } else {
                await saveVehicle.mutateAsync(formData);
            }

            onClose();
        } catch (error) {
            console.error('[ERROR] Помилка при збереженні техніки:', error);
        }
    };

    return (
        <Styles.wrapper onClick={handleWrapperClick}>
            <Styles.modal>
                <Styles.closeButton onClick={onClose} />
                <Styles.title>{editVehicleId ? 'Редагування техніки' : 'Додавання нової техніки'}</Styles.title>

                <Styles.styledPhotoBlock>
                    <Styles.blockColumn>
                        <Styles.subtitle>Фото техніки</Styles.subtitle>
                        <Styles.styledButtonLabel>
                            <Styles.styledText>{editVehicleId ? 'Змінити фото' : 'Додати фото'}</Styles.styledText>
                            <Styles.styledInputFile type="file" accept="image/*" onChange={handlePhotoChange} />
                        </Styles.styledButtonLabel>
                    </Styles.blockColumn>
                    <Styles.photoBlock>
                        <Styles.photoPic src={employeePhoto instanceof Blob ? URL.createObjectURL(employeePhoto) : employeePhoto} />
                    </Styles.photoBlock>
                </Styles.styledPhotoBlock>

                <Styles.lable>
                    <Styles.subtitle>Виберіть групу</Styles.subtitle>
                    <SelectComponent
                        options={groups}
                        value={selectedGroup ? { value: selectedGroup, label: selectedGroupName } : null}
                        onChange={handleGroupChange}
                        placeholder="Оберіть групу"
                    />
                </Styles.lable>

                <Styles.lable>
                    <Styles.subtitle>Виберіть тип техніки</Styles.subtitle>
                    <SelectComponent
                        options={vehicleTypes}
                        value={
                            vehicleType
                                ? {
                                    value: vehicleType,
                                    label: vehicleTypes.find(v => v._id === vehicleType)?.name || vehicleType,
                                }
                                : null
                        }
                        onChange={handleVehicleTypeChange}
                        placeholder="Оберіть тип техніки"
                    />
                </Styles.lable>

                <Styles.lable>
                    <Styles.subtitle>Марка засобу</Styles.subtitle>
                    <Styles.input value={mark} onChange={(e) => setMark(e.target.value)} />
                </Styles.lable>

                <Styles.lable>
                    <Styles.subtitle>Номер реєстрації</Styles.subtitle>
                    <Styles.input value={regNumber} onChange={(e) => setRegNumber(e.target.value)} />
                </Styles.lable>

                <Styles.lable>
                    <Styles.subtitle>IMEI трекера</Styles.subtitle>
                    <Styles.input value={imei} onChange={(e) => setImei(e.target.value)} />
                </Styles.lable>

                <Styles.lable>
                    <Styles.subtitle>Номер Sim-карти</Styles.subtitle>
                    <Styles.input value={sim} onChange={(e) => setSim(e.target.value)} />
                </Styles.lable>

                <Styles.lable>
                    <Styles.textarea maxLength={250} value={note} onChange={(e) => setNote(e.target.value)} />
                </Styles.lable>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button text="Зберегти" onClick={handleSave} />
                </div>
            </Styles.modal>
        </Styles.wrapper>
    );
}