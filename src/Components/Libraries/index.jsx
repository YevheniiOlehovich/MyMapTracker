import Header from "../Header";
import Styles from "./styled";
import Button from "../Button";

export default function Libraries() {
  return (
    <>
        <Header/>
        <Styles.wrapper>
            <Styles.menu>
                <Button text={'Підрозділи'}/>
                <Button text={'Співробтники'}/>
                <Button text={'Транспорт'}/>
                <Button text={'Причепи'}/>
                <Button text={'Поля'}/>
                <Button text={'Операції'}/>
                <Button text={'Культури'}/>
                <Button text={'Сорти'}/>
            </Styles.menu>
            <Styles.block></Styles.block>
        </Styles.wrapper>
    </>
  );
}