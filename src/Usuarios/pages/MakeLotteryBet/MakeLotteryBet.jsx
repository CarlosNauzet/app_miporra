import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../../../api/config/client";
import FormInput from "../../../components/FormInput";
import Button from "../../../components/Button";
import { v4 as uuidV4 } from "uuid";
import { generateRandomCode } from "../../../utils/generateRnmNumber";

export const MakeLotteryBet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lottery, setLottery] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [createdLotteryId, setCreatedLotteryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const params = useParams();
  const lotteryArray = Array.from({ length: 100 }, (_, index) => index);

  useEffect(() => {
    const fetchLottery = async () => {
      try {
        setIsLoading(true);
        const { data } = await client.get(
          `/lotteryBets?LotteryId=${params.id}`
        );
        setIsLoading(false);
        setLottery(data.results);
        const numbers = data.results.map((number) => +number.selectedNumber);
        console.log(numbers);
        setSelectedNumbers(numbers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLottery();
  }, []);

  const handleSelectNumber = (number) => {
    setSelectedNumber(number);
    setError(null);
    setCreatedLotteryId(null);
  };

  const handleSubmitLotteryBet = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const lotteryData = Object.fromEntries(formData);
    lotteryData.betDate = new Date().toLocaleDateString();
    lotteryData.selectedNumber = selectedNumber;
    lotteryData.betPrice = lottery && lottery[0] ? lottery[0].betPrice : undefined;
    lotteryData.lotteryId = params.id;
    console.log(lotteryData);
    const lotteryId = generateRandomCode();
    const finalData = {
      number: lotteryId,
      clientId: lottery[0].lottery.clientId,
      type: "lottery",
      bet: { ...lotteryData },
    };
    try {
      setIsSubmitting(true);

      const { data } = await client.post("/newValidation", finalData);

      if (data.results.response) {
        return setError(
          `El número ${selectedNumber} ya ha sido seleccionado. Por favor, recarga la página para actualizar los números cogidos`
        );
      }
      await client.post("/newLotteryBet", lotteryData);

      setCreatedLotteryId(lotteryId);

      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="make-lottery-container center-items">
      <h1>Apostar Rifas</h1>
      <div className="make-lottery-card center-items">
        {lotteryArray.map((number) => (
          <Button
            variant={`lottery-button ${
              number === selectedNumber
                ? "lottery-number-selected"
                : "primary-cta"
            }`}
            key={number}
            disabled={selectedNumbers.includes(+number)}
            onClick={() => handleSelectNumber(number)}
          >
            {number}
          </Button>
        ))}
      </div>
      {selectedNumber && !createdLotteryId ? (
        <div>
          <form
            method="POST"
            className="lottery-bet"
            onSubmit={handleSubmitLotteryBet}
          >
            <h2>HAZ TU APUESTA</h2>
            <div className="lottery-user-data">
              <FormInput
                disabled={isLoading}
                type="text"
                name="userName"
                label="Tu nombre"
              />
              <FormInput
                disabled={isLoading}
                type="email"
                name="userEmail"
                label="Tu mail"
              />
              <p>Número seleccionado: {selectedNumber}</p>
              lottery && lottery[0] ? lottery[0].betPrice : undefined;
              <p>Precio de la apuesta: {lottery && lottery[0] ? lottery[0].betPrice : undefined}€</p>
            </div>
            {error && <p className="lottery-error">{error}</p>}
            <div className="submit-bet center-items">
              <Button type="submit" variant="primary-cta">
                {isSubmitting ? "Haciendo apuesta..." : "Apostar"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        createdLotteryId && (
          <div className={`${createdLotteryId} ? "lottery-bet" : ""`}>
            <h2>Este es tu código de identificación de la apuesta:</h2>
            <p>{createdLotteryId}</p>
          </div>
        )
      )}
    </main>
  );
};
