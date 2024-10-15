import { StyledAside } from './styled'
import MapsContainer from '../MapsContainer'
import PersonalContainer from '../PersonalContainer'

export default function Aside(){
    return(
        <StyledAside>
            <PersonalContainer />
            {/* <MapsContainer /> */}
        </StyledAside>
    )
}