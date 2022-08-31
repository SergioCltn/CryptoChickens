import { useMoralis, useWeb3Contract } from "react-moralis";
import { useState, useEffect } from "react";
import { useNotification, Button, Illustration } from "web3uikit";
import "../styles/Minting.css";
import { preFabchicken } from "../utils/chickenUtils";
import DisplayLink from "../components/DisplayLink";

const Minting = ({ abi, contractAddress, getTime }) => {
  const { account, isWeb3Enabled } = useMoralis();
  const dispatch = useNotification();

  const [nombre, setNombre] = useState("");
  const [createChickenFee, setcreateChickenFee] = useState("");
  const [chicken, setChicken] = useState([]);

  const {
    runContractFunction: createRandomChicken,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "createRandomChicken",
    msgValue: createChickenFee,
    params: { _name: nombre },
  });
  const { runContractFunction: getChickenLength } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getChickenLength",
    params: {},
  });

  const { runContractFunction: getCreateChickenFee } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getCreateChickenFee",
    params: {},
  });

  const { runContractFunction: getChickenFromId } = useWeb3Contract();

  async function updateUIValues() {
    updateChickens();
    updateCreateChickenFee();
  }

  async function updateChickens() {
    const now = await getTime();
    const auxChickens = [];
    const auxChickenIds = [];
    let chickenLength = (await getChickenLength()).toString() - 1;
    let finished = false;
    if (chickenLength >= 0) {
      while (!finished) {
        const auxId = chickenLength;
        auxChickenIds.push(auxId);
        if (auxChickenIds.length === 5 || 0 === chickenLength) {
          finished = true;
        }
        chickenLength -= 1;
      }
    }
    auxChickenIds.forEach(async (id) => {
      const auxChicken = await getChickenFromId({
        params: {
          abi: abi,
          contractAddress: contractAddress,
          functionName: "getChickenFromId",
          params: { _id: id },
        },
      });
      auxChickens.push(preFabchicken(auxChicken, id, now));
    });
    setChicken(auxChickens);
  }

  async function updateCreateChickenFee() {
    const auxFee = (await getCreateChickenFee()).toString();
    setcreateChickenFee(auxFee);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled, account]);

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    setNombre("");
    updateUIValues();
    handleNewNotification(tx);
  };

  const handleNewNotification = (tx) => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };
  const handleNewNotificationError = (tx) => {
    dispatch({
      type: "error",
      message: "Breed em!",
      title: "You can't mint more chickens!",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div className="all">
      <div className="minting">
        <div>
          <Illustration height="180px" logo="pack" width="100%" />
        </div>
        <div>
          <input
            name="Introduce el nombre del Chicken"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Name of the Chicken"
          />
        </div>
        <Button
          color="black"
          onClick={async function () {
            await createRandomChicken({
              onSuccess: handleSuccess,
              onError: (error) => handleNewNotificationError(error),
            });
          }}
          disabled={isLoading || isFetching}
          text="Create Random Chicken"
          theme="colored"
          className="mintingButton"
        />
      </div>
      <div style={{ marginTop: "5vh" }}>
        <h1>Latest minted chickens</h1>
        {chicken ? (
          <DisplayLink chicken={chicken} />
        ) : (
          <h2 style={{ paddingTop: "100px" }}>
            No chicken has been minted yet
          </h2>
        )}
      </div>
    </div>
  );
};

export default Minting;
