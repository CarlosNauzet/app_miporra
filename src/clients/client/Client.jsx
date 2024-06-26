import './Client.css'
import add from '../../images/addElement.svg'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Client = () => {

    const clientLogged = useSelector((state) => state.origin.clientLogged);
    const clientLogo = clientLogged.logo

    const navigate = useNavigate()

    const handleClubClick = () => {
        navigate('/createClub')
    }

    const handleLotteryClick = () => {
        navigate('/createLottery')
    }

    const handleCloseClub = () => {
        navigate('/closeClub')
    }

    const handleCloseLottery = () => {
        navigate('/closeLottery')
    }

    const handleClubList = () => {
        navigate('/myClubsList')
    }

    const handleLotteryList = () => {
        navigate('/myLotteriesList')
    }

    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    };

    if (isEmpty(clientLogged)) navigate('/porras')
    
    return(
        <div className="client-container">
            <div className='client-container-img'>
                <img className='client-logo' src={clientLogo} alt="Logo del cliente" />
            </div>
            <div className='client-total-container'>
                <div className='client-club-container'>
                    <div className='client-club-container-back'>
                        <div className='client-club'>
                            <p className='container-title'>PORRAS</p>
                        </div>
                        <button  className="client-button-add-club" onClick={handleClubClick}>
                            <img className='client-add' src={add} alt='Añadir porra' onClick={handleClubClick}/>
                        </button>                     
                        <button className='client-club' onClick={handleCloseClub}>
                            <p className='container-title container-title-margin'>CERRAR</p>
                            <p className='container-title'>PORRA</p>
                        </button>
                    </div>
                    <div className='client-button'>
                        <Button variant="primary-cta" onClick={handleClubList}>
                            Historial porras
                        </Button>
                    </div>
                </div>
                <div className='client-lottery-container'>
                    <div className='client-lottery-container-back'>
                        <div className='client-lottery'>
                            <p className='container-title'>RIFAS</p>
                        </div>
                        <button  className="client-button-add-lottery" onClick={handleLotteryClick}>
                            <img className='client-add' src={add} alt='Añadir rifa'/>
                        </button>
                        <button className='client-lottery' onClick={handleCloseLottery}>
                            <p className='container-title container-title-margin'>CERRAR</p>
                            <p className='container-title'>RIFA</p>
                        </button>
                    </div>
                    <div className='client-button' >
                        <Button  variant="secondary-cta" onClick={handleLotteryList}>
                            Historial rifas
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Client