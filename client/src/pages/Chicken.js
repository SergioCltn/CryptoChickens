import { useParams } from "react-router-dom";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { Button, useNotification } from "web3uikit";
import { getTimeDays } from "../utils/chickenUtils";
import "../styles/Chicken.css";
import Missing from "../components/Missing";

const Chicken = ({ abi, contractAddress, getTime }) => {
  const dispatch = useNotification();
  const { id } = useParams();
  const { account, isWeb3Enabled } = useMoralis();
  const [chicken, setChicken] = useState({});
  const [owner, setOwner] = useState("");
  const [nombre, setNombre] = useState("");
  const [address, setAddress] = useState("");
  const selectable = [1, 3, 5];

  const { runContractFunction: getChickenFromId } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getChickenFromId",
    params: { _id: id },
  });

  const { runContractFunction: getFeeLevelUpFee } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getFeeLevelUpFee",
    params: {},
  });

  const { runContractFunction: ownerOf } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "ownerOf",
    params: { _tokenId: id },
  });

  const { runContractFunction: levelUp } = useWeb3Contract({});

  const {
    runContractFunction: changeName,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "changeName",
    params: { _chickenId: id, _newName: nombre },
  });

  const {
    runContractFunction: transferFrom,
    isLoadingTransfer,
    isFetchingTransfer,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "transferFrom",
    params: { _from: owner, _to: address, _tokenId: id },
  });

  async function updateChickens() {
    const now = await getTime();
    const auxChicken = await getChickenFromId();
    setChicken(preFabchicken(auxChicken, now));
    const auxOwner = await ownerOf();
    setOwner(auxOwner.toLowerCase());
  }

  function preFabchicken(auxChicken, now) {
    if (auxChicken) {
      return {
        name: auxChicken.name,
        id: id,
        dna: parseInt(auxChicken.dna._hex, 16),
        level: parseInt(auxChicken.level._hex, 16),
        readyTime:
          now >= parseInt(auxChicken.readyTime._hex, 16)
            ? "Ready"
            : getTimeDays(parseInt(auxChicken.readyTime._hex, 16), now),
        winCount: parseInt(auxChicken.winCount._hex, 16),
        lossCount: parseInt(auxChicken.lossCount._hex, 16),
        gestationTime:
          now >= parseInt(auxChicken.gestationTime._hex, 16)
            ? "Not an egg"
            : getTimeDays(parseInt(auxChicken.breedingTime._hex, 16), now),
        breedingTime:
          now >= parseInt(auxChicken.breedingTime._hex, 16)
            ? "Ready"
            : getTimeDays(parseInt(auxChicken.breedingTime._hex, 16), now),
      };
    } else {
      return {};
    }
  }

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    setNombre("");
    updateChickens();
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
      message: "Transaction Failed!",
      title: "Error Notification",
      position: "topR",
      icon: "bell",
    });
  };
  const handleSelectedLevel = async (level) => {
    const getLevelFee = (await getFeeLevelUpFee()).toString();
    await levelUp({
      params: {
        abi: abi,
        contractAddress: contractAddress,
        functionName: "levelUp",
        params: { _chickenId: id },
        msgValue: getLevelFee * level,
      },
      onSuccess: handleSuccess,
      onError: handleNewNotificationError,
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateChickens();
    }
  }, [isWeb3Enabled, account, owner]);
  if (chicken.name) {
    return (
      <div>
        <div className="row">
          <div className="column">
            <div className="imagen">
              <img
                src={
                  chicken.gestationTime === "Not an egg"
                    ? require(`../images/chicken-${
                        Math.floor(chicken.dna / 100) % 10
                      }.svg`)
                    : require("../images/chicken-egg.svg").default
                }
                alt={chicken.name}
                style={{ height: "300px" }}
              />
              <h1>{chicken.name}</h1>
            </div>
            <h2 className="level">Level: {chicken.level}</h2>
            <h2 className="wins">Wins: {chicken.winCount}</h2>
            <h2 className="loses">Loses: {chicken.lossCount}</h2>
            <h2 className="dna">DNA: {chicken.dna}</h2>
            <h4 className="owner">{owner}</h4>
          </div>
          <div className="column">
            {owner === account && (
              <div className="row">
                <div className="column2">
                  <h2 className="fieldNames">Transfer ownership</h2>
                  <div className="transferFrom">
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address of the destinatary"
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "20%",
                      }}
                    >
                      <Button
                        color="black"
                        onClick={async function () {
                          await transferFrom({
                            onSuccess: handleSuccess,
                            onError: (error) =>
                              handleNewNotificationError(error),
                          });
                        }}
                        disabled={isLoadingTransfer || isFetchingTransfer}
                        text="Transfer owner"
                        theme="colored"
                        className="button"
                      />
                    </div>
                  </div>
                </div>
                {chicken.level >= 2 && (
                  <div className="column2">
                    <h2 className="fieldNames">Change name</h2>
                    <div className="changeName">
                      <input
                        name="Introduce el nombre del Chicken"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Name of the Chicken"
                      />
                      <Button
                        color="black"
                        onClick={async function () {
                          await changeName({
                            onSuccess: handleSuccess,
                            onError: (error) =>
                              handleNewNotificationError(error),
                          });
                        }}
                        disabled={isLoading || isFetching}
                        text="Change name"
                        theme="colored"
                        className="button"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <h2 className="breedingTime">Breedable: {chicken.breedingTime}</h2>
            <h2 className="readyTime">Attack ready: {chicken.readyTime}</h2>
            {chicken.gestationTime !== "Not an egg" ? (
              <h2 className="gestationTime">
                Gestation: {chicken.gestationTime}
              </h2>
            ) : (
              <div className="gusanos">
                {selectable.map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      handleSelectedLevel(item);
                    }}
                    className="gusano"
                  >
                    <div>
                      <img
                        src={require("../images/chicken-egg.svg").default}
                        alt={item}
                        style={{ height: "50px" }}
                      />
                      <h5>Level UP {item}</h5>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <Missing text="This chicken does not exist" />;
  }
};

export default Chicken;
