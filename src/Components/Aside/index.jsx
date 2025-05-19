import { StyledAside } from './styled'
import GroupsContainer from '../GroupsContainer'
import DatePickerComponent from '../DatePicker';

export default function Aside(){
    return(
        <StyledAside>
            <GroupsContainer />
            <DatePickerComponent />
        </StyledAside>
    )
}