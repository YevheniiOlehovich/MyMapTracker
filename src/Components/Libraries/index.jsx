import { useState } from "react";
import Header from "../Header";
import Styles from "./styled";
import Button from "../Button";
import UnitTab from "../UnitTab";
import PersonnelTab from "../PersonnellTab";
import VehicleTab from "../VehicleTab";
import TechniqeTab from "../TechniqueTab";
import FieldsTab from "../FieldsTab";
import OperationsTab from "../OperationsTab";
import CropsTab from "../CropsTab";
import VarietiesTab from "../VarietiesTab";
import RentTab from "../RentTab";
import PropertiesTab from "../PropertiesTab";
import Modals from "../Modals";

const tabs = [
  { key: "groups", label: "Підрозділи", component: <UnitTab /> },
  { key: "personnel", label: "Співробтники", component: <PersonnelTab /> },
  { key: "vehicles", label: "Транспорт", component: <VehicleTab /> },
  { key: "trailers", label: "Причепи", component: <TechniqeTab /> },
  { key: "fields", label: "Поля", component: <FieldsTab /> },
  { key: "rent", label: "Оренда", component: <RentTab /> },
  { key: "properties", label: "Власність", component: <PropertiesTab /> },
  { key: "operations", label: "Операції", component: <OperationsTab />},
  { key: "crops", label: "Культури", component: <CropsTab /> },
  { key: "sorts", label: "Сорти", component: <VarietiesTab /> },
];

export default function Libraries() {
  const [activeTab, setActiveTab] = useState(tabs[0].key);

  return (
    <>
      <Header />
      <Styles.wrapper>
        <Styles.menu>
          {tabs.map(tab => (
            <Button
              key={tab.key}
              text={tab.label}
              onClick={() => setActiveTab(tab.key)}
              active={activeTab === tab.key}
            />
          ))}
        </Styles.menu>
        <Styles.block>
          {tabs.find(tab => tab.key === activeTab)?.component}
        </Styles.block>
      </Styles.wrapper>
      <Modals />
    </>
  );
}