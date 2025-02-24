import Map from "../Map"
import Header from "../Header"
import Aside from '../Aside'
import LayersList from "../LayersList"

export default function Main(){
    return(
        <>
            <Header />
            <Aside />
            <Map />
            <LayersList />
        </>
    )
}