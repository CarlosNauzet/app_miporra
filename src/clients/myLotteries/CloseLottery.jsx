import { useEffect, useState } from "react"
import { getInProgressLotteries } from "./service"
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LotteryCard from "../../components/LotteryCard"
import ErrorComponent from "../../components/ErrorComponent"
import adelante from '../../images/adelante.svg'
import './CloseLottery.css'

const CloseLottery = () => {

    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState(null)
    const [lotteries, setLotteries] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const fetchLotteries = async () => {
            try {
                setIsFetching(true)
                const lotteriesList = await getInProgressLotteries()
                const sortedLotteries = lotteriesList.results.sort((a, b) => new Date(b.dateLimitOfBets) - new Date(a.dateLimitOfBets));
                setLotteries(sortedLotteries)
                setIsFetching(false)
            } catch (error) {
                setIsFetching(false)
                setError(error)
                console.log(error) 
            }
        }
        fetchLotteries()
    }, [])

    useEffect(() => {
        if (error) {
          const timer = setTimeout(() => {
            setError(null);
          }, 5000);
          return () => {
            clearTimeout(timer);
          };
        }
    }, [error]);

    const handleClick = (lottery) => {
        navigate('/myLotteryDetail', {state: { lottery } })
    }

    // Al seleccionar una porra, voy al detail a cerrarla
    if (isFetching) return (
        <div>Cargando rifas ...</div>
    )

    return (
        <div>
            <button className='back-image-button' onClick={ () => navigate('/client')}>
                <img className="back-image" src={adelante} alt="Atras" />
            </button>
            {
                lotteries.length === 0 ?
                    <h2 className='closeLottery-title'>No tiene ninguna rifa creada</h2>
                :
                    <h2 className='closeLottery-title'>Mis rifas</h2>
            }
            <div>
                {
                    lotteries ?
                        lotteries.map( lottery => {
                            return(
                                <Button key={lottery.id} onClick={() => handleClick(lottery)}>
                                    <LotteryCard lottery={ lottery } />
                                </Button>
                            )
                        })
                        :
                        <p>No hay ninguna rufa creada</p>
                }
                {error && (
                    <div>
                        <ErrorComponent errorText={error} />
                    </div>
                )}
            </div>

        </div>
    )
}

export default CloseLottery