import { StyledAside } from './styled'
import MapsContainer from '../MapsContainer'
import PersonalContainer from '../PersonalContainer'
import Vehicles from '../Vehicles'

export default function Aside(){
    return(
        <StyledAside>
            <PersonalContainer />
            <Vehicles />
            {/* <MapsContainer /> */}
        </StyledAside>
    )
}