import { useState } from "react";
import Header from "../Header";
import Styles from "./styled";
import Button from "../Button";
import UnitTab from "../UnitTab";
// Імпортуйте компоненти таблиць для кожного табу
// import PersonnelTable from "../PersonnelTable";
// import VehiclesTable from "../VehiclesTable";
// ...інші таблиці

const tabs = [
  { key: "groups", label: "Підрозділи", component: <UnitTab /> },
  { key: "personnel", label: "Співробтники", component: <div>Тут буде таблиця співробітників</div> },
  { key: "vehicles", label: "Транспорт", component: <div>Тут буде таблиця транспорту</div> },
  { key: "trailers", label: "Причепи", component: <div>Тут буде таблиця причепів</div> },
  { key: "fields", label: "Поля", component: <div>Тут буде таблиця полів</div> },
  { key: "operations", label: "Операції", component: <div>Тут буде таблиця операцій</div> },
  { key: "crops", label: "Культури", component: <div>Тут буде таблиця культур</div> },
  { key: "sorts", label: "Сорти", component: <div>Тут буде таблиця сортів</div> },
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
    </>
  );
}