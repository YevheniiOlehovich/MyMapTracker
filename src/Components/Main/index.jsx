import Map from "../Map"
import Header from "../Header"
import Aside from '../Aside'
import LayersList from "../LayersList"
import Modals from "../Modals"

export default function Main(){
    return(
        <>
            <Header />
            <Aside />
            <Map />
            <LayersList />
            <Modals />
        </>
    )
}