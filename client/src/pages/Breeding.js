import { useMoralis, useWeb3Contract } from "react-moralis";
import { useState, useEffect } from "react";
import { useNotification, Button, Card } from "web3uikit";
import "../styles/Breeding.css";
import { preFabchicken } from "../utils/chickenUtils";
import Missing from "../components/Missing";

const Breeding = ({ abi, contractAddress, getTime }) => {
  const dispatch = useNotification();
  const { account, isWeb3Enabled } = useMoralis();
  const [firstChickens, setFirstChickens] = useState([]);
  const [firstSelectedChicken, setFirstSelectedChicken] = useState("");
  const [secondChickens, setSecondChickens] = useState([]);
  const [secondSelectedChicken, setsecondSelectedChicken] = useState("");

  const {
    runContractFunction: breeding,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "breeding",
    params: {
      _firstChickenId: firstSelectedChicken,
      _secondChickenId: secondSelectedChicken,
    },
  });

  const { runContractFunction: getChickensByOwner } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getChickensByOwner",
    params: { _owner: account },
  });

  const { runContractFunction: getChickenFromId } = useWeb3Contract();

  async function updateFirstChicken() {
    const now = await getTime();
    const auxChickens = [];
    const chickenIds = await getChickensByOwner();
    chickenIds.forEach(async (id) => {
      const auxId = parseInt(id._hex, 16);
      const auxChicken = await getChickenFromId({
        params: {
          abi: abi,
          contractAddress: contractAddress,
          functionName: "getChickenFromId",
          params: { _id: auxId },
        },
      });
      const aux = preFabchicken(auxChicken, id, now);
      if (aux.breedingTime === "Ready") auxChickens.push(aux);
    });
    setFirstChickens(auxChickens);
  }

  async function updateSecondChicken(selectedId) {
    const now = await getTime();
    const auxChickens = [];
    const chickenIds = await getChickensByOwner();
    chickenIds.forEach(async (id) => {
      const auxId = parseInt(id._hex, 16);
      if (auxId !== selectedId) {
        const auxChicken = await getChickenFromId({
          params: {
            abi: abi,
            contractAddress: contractAddress,
            functionName: "getChickenFromId",
            params: { _id: auxId },
          },
        });
        auxChickens.push(preFabchicken(auxChicken, id, now));
      }
    });
    setSecondChickens(auxChickens);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateFirstChicken();
    }
    if (firstSelectedChicken !== "") {
      updateSecondChicken(firstSelectedChicken);
    }
  }, [isWeb3Enabled, account]);

  function handleFirstSelected(e, id) {
    setFirstSelectedChicken(id);
    updateSecondChicken(id);
  }

  function handleSecondSelected(e, id) {
    setsecondSelectedChicken(id);
  }

  const handleNewNotification = () => {
    dispatch({
      type: "success",
      message: "New breed completed",
      title: "Enjoy your new chicken",
      position: "topR",
      icon: "bell",
    });
  };

  const handleNewNotificationError = (tx) => {
    dispatch({
      type: "error",
      message: "Chicken in Cooldown",
      title: "Can't breed",
      position: "topR",
      icon: "bell",
    });
  };

  const handleSuccess = async (tx) => {
    const tax = await tx.wait(1);
    handleNewNotification();
    setFirstSelectedChicken("");
    setsecondSelectedChicken("");
    updateFirstChicken();
  };

  if (firstChickens.length > 1) {
    return (
      <div className="todo">
        <div className="leftbox">
          <div className="around2">
            {firstChickens.map((auxChicken) => (
              <div
                key={auxChicken.id}
                className="breed"
                onClick={(e) => {
                  handleFirstSelected(e, parseInt(auxChicken.id._hex, 16));
                }}
              >
                <Card
                  description={`Level: ${auxChicken.level}`}
                  isSelected={
                    firstSelectedChicken === parseInt(auxChicken.id._hex, 16)
                  }
                  title={auxChicken.name}
                  tooltipText={`DNA: ${auxChicken.dna} \n `}
                >
                  <div>
                    <img
                      src={
                        auxChicken.gestationTime === "Not an egg"
                          ? require(`../images/chicken-${
                              Math.floor(auxChicken.dna / 100) % 10
                            }.svg`)
                          : require("../images/chicken-egg.svg").default
                      }
                      alt={auxChicken.name}
                      style={{ height: "150px" }}
                    />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
        <div className="middlebox">
          <h1>Select the parents</h1>
          <div className="breedDiv">
            <Button
              className="breedButton"
              color="yellow"
              onClick={async function () {
                await breeding({
                  onSuccess: handleSuccess,
                  onError: (error) => handleNewNotificationError(error),
                });
              }}
              disabled={
                isLoading ||
                isFetching ||
                firstSelectedChicken === "" ||
                secondSelectedChicken === ""
              }
              text="Breed"
              theme="colored"
            />
          </div>
        </div>
        <div className="rightbox">
          <div className="around">
            {secondChickens.map((secondChicken) => (
              <div
                key={secondChicken.id}
                className="breed"
                onClick={(e) => {
                  handleSecondSelected(e, secondChicken.id);
                }}
              >
                <Card
                  description={`Level: ${secondChicken.level}`}
                  isSelected={secondSelectedChicken === secondChicken.id}
                  title={secondChicken.name}
                  tooltipText={`DNA: ${secondChicken.dna} \n `}
                  disabled={secondChicken.breedingTime !== "Ready"}
                >
                  <div>
                    <img
                      src={
                        secondChicken.gestationTime === "Not an egg"
                          ? require(`../images/chicken-${
                              Math.floor(secondChicken.dna / 100) % 10
                            }.svg`)
                          : require("../images/chicken-egg.svg").default
                      }
                      alt={secondChicken.name}
                      style={{ height: "150px" }}
                    />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return <Missing text={"No available chickens for breeding"} />;
};

export default Breeding;
