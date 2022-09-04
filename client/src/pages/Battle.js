import { useMoralis, useWeb3Contract } from "react-moralis";
import { useState, useEffect } from "react";
import { useNotification, Button, Card } from "web3uikit";
import { preFabchicken } from "../utils/chickenUtils";
import DisplaySelect from "../components/DisplaySelect";
import "../styles/Battle.css";
import Missing from "../components/Missing";

const Battle = ({ abi, contractAddress, getTime }) => {
  const dispatch = useNotification();
  const { account, isWeb3Enabled } = useMoralis();
  const [chicken, setChicken] = useState([]);
  const [selectedChicken, setSelectedChicken] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [probabilities, setProbabilities] = useState([]);
  const [rewards, setRewards] = useState([]);
  const difficulties = [1, 2, 3];

  const {
    runContractFunction: attack,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "attack",
    params: { _chickenId: selectedChicken, _difficulty: selectedDifficulty },
  });

  const { runContractFunction: getChickensByOwner } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getChickensByOwner",
    params: { _owner: account },
  });

  const { runContractFunction: getWinningProbabilities } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getWinningProbabilities",
    params: {},
  });

  const { runContractFunction: getRewards } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getRewards",
    params: {},
  });

  const { runContractFunction: getChickenFromId } = useWeb3Contract();

  async function updateUIValues() {
    const now = await getTime();
    const auxChickens = [];
    const chickenIds = (await getChickensByOwner()).toString().split(",");
    chickenIds.forEach(async (id) => {
      const auxChicken = await getChickenFromId({
        params: {
          abi: abi,
          contractAddress: contractAddress,
          functionName: "getChickenFromId",
          params: { _id: id },
        },
      });
      const aux = preFabchicken(auxChicken, id, now);
      if (aux.readyTime === "Ready") auxChickens.push(aux);
    });
    setChicken(auxChickens);
    updateProbabilities();
  }

  async function updateProbabilities() {
    const probs = (await getWinningProbabilities()).toString().split(",");
    const rew = (await getRewards()).toString();
    setRewards(rew / 10 ** 18);
    setProbabilities(probs);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled, account]);

  const handleNewNotification = (result, typeString) => {
    dispatch({
      type: typeString,
      message: "Transaction Complete!",
      title: result,
      position: "topR",
      icon: "bell",
    });
  };

  const handleNewNotificationError = (tx) => {
    dispatch({
      type: "error",
      message: "Chicken in Cooldown",
      title: "Fight Failed",
      position: "topR",
      icon: "bell",
    });
  };

  const handleSuccess = async (tx) => {
    const tax = await tx.wait(1);
    updateUIValues();
    handleNewNotification(tax.events[0].args.resultString, "info");
    setSelectedDifficulty("");
    setSelectedChicken("");
  };

  if (chicken.length !== 0) {
    return (
      <div>
        <h1>Your chickens</h1>
        <div className="battle-container">
          <div className="chickenAllies">
            <DisplaySelect
              chicken={chicken}
              selectedChicken={selectedChicken}
              setSelectedChicken={setSelectedChicken}
            />
          </div>
        </div>
        <div className="buttonBattle">
          <Button
            color="red"
            onClick={async function () {
              await attack({
                onSuccess: handleSuccess,
                onError: (error) => handleNewNotificationError(error),
              });
            }}
            disabled={
              isLoading ||
              isFetching ||
              selectedChicken === "" ||
              selectedDifficulty === ""
            }
            text="Fight"
            theme="colored"
          />
        </div>
        <div className="battle-container">
          <div className="chickenEnemies">
            <div className="chickens">
              {difficulties.map((difficulty) => (
                <div
                  key={difficulty}
                  className="chicken"
                  onClick={() => {
                    setSelectedDifficulty(difficulty);
                  }}
                >
                  <Card
                    description={`Rewards : ${rewards * difficulty} ETH`}
                    isSelected={selectedDifficulty === difficulty}
                    title={probabilities[difficulty - 1] + "% Victory"}
                  >
                    <div>
                      <img
                        src={require("../images/evilchicken.png")}
                        alt={difficulty}
                        style={{ height: "150px" }}
                      />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
        <h1>Enemies</h1>
      </div>
    );
  }
  return <Missing text={"No available chickens for attacking"} />;
};

export default Battle;
