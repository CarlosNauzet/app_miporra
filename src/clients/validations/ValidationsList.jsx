/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import './ValidationsList.css'
import { createClubBet, createLotteryBet, deleteValidation, getValidations } from './service'
import validar from '../../images/validar.svg'
import deleteBet from '../../images/delete.svg'
import ErrorComponent from '../../components/ErrorComponent'


const ValidationsList = () => {

    const [validations, setValidations] = useState([])
    const [error, setError] = useState(null)
    const [isChanged, setIsChanged] = useState(true)

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
    
    useEffect(() => {
        if (isChanged) {
            const fetchValidations = async () => {
                try {
                    const validationsList = await getValidations()
                    setValidations(validationsList.results)
                    setIsChanged(false)
                } catch (error) {
                    setError(error)
                    setIsChanged(false) 
                }
            }
            fetchValidations()
        }
    }, [isChanged])

    const handleValidate = async (bet) => {
        console.log('Validate: ', bet)
        // Create club or Lottery bet
        try {
            if (bet.type === 'club') {
                // Create club bet
                await createClubBet(bet.bet)
            } else {
                // Create lottery bet
                await createLotteryBet(bet.bet)
            }
            // Delete validation
            await deleteValidation(bet.id)
            setIsChanged(true)
        } catch (error) {
            setError(error)
        }
    }

    const handleDelete = async (bet) => {
        // Delete validation
        await deleteValidation(bet.id)
        setIsChanged(true)
    }

    return (
        <div className='validationsList-container'>
            
            {
                !validations ? 
                    <h2 className='validationsList-title'>Apuestas pendientes de validar</h2> 
                : 
                    <h2 className='validationsList-title'>No hay validaciones pendientes</h2>
            }
            {
                validations?.map((bet) => (
                    <div className='validationsList-validation' key={bet.id}>
                        <span className='validationsList-number'>{bet.number}</span>
                        <span className='validationsList-name'>{bet.bet.userName}</span>
                        <div className='validationsList-icons-container'>
                            <img className='validationsList-icon' src={validar} alt='Validar apuesta' onClick={() => handleValidate(bet)}/>
                            <img className='validationsList-icon' src={deleteBet} alt='Borrar apuesta' onClick={() => handleDelete(bet)}/>
                        </div>
                    </div>
                ))
            }
            {error && (
          <div style={{ marginTop: '20px' }}>
            <ErrorComponent errorText={error} />
          </div>
        )}
        </div>
    )
}

export default ValidationsList