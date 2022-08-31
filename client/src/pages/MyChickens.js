import { useMoralis, useWeb3Contract } from "react-moralis";
import { useState, useEffect } from "react";
import "../styles/MyChickens.css";
import { preFabchicken } from "../utils/chickenUtils";
import DisplayLink from "../components/DisplayLink";
import { Button, useNotification } from "web3uikit";
import Missing from "../components/Missing";

const MyChickens = ({ abi, contractAddress, getTime }) => {
  const { account, isWeb3Enabled } = useMoralis();
  const [chicken, setChicken] = useState([]);
  const [balance, setBalance] = useState("");
  const dispatch = useNotification();
  const { runContractFunction: getChickensByOwner } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getChickensByOwner",
    params: { _owner: account },
  });
  const { runContractFunction: getWithdrawalBalance } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getWithdrawalBalance",
    params: { _owner: account },
  });

  const {
    runContractFunction: withdrawUser,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "withdrawUser",
    params: { user: account },
  });

  const updateBalance = async () => {
    const auxBalance = (await getWithdrawalBalance()).toString();
    setBalance(auxBalance / 10 ** 18);
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

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    updateBalance();
    console.log(tx);
    handleNewNotification(tx);
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateBalance();
    }
  }, [isWeb3Enabled, account]);

  const { runContractFunction: getChickenFromId } = useWeb3Contract();
  async function updateChickens() {
    const now = (await getTime()).toString();
    const auxChickens = [];
    const chickenIds = await getChickensByOwner();
    chickenIds.forEach(async (id) => {
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

  useEffect(() => {
    if (isWeb3Enabled) {
      updateChickens();
    }
  }, [isWeb3Enabled, account]);

  return (
    <div>
      <div className="withdraw-father">
        <div className="withdraw">
          <h4>Balance: {balance + " ETH"}</h4>
          <Button
            color="yellow"
            onClick={async function () {
              await withdrawUser({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            disabled={isLoading || isFetching || balance === 0}
            text={balance === 0 ? "No ETH to withdraw" : "Withdraw ETH"}
            theme="colored"
          />
        </div>
      </div>
      <div>
        <h1>Your chickens</h1>
        {chicken.length > 0 ? (
          <DisplayLink chicken={chicken} />
        ) : (
          <Missing text={"You don't have any chickens yet!"} />
        )}
      </div>
    </div>
  );
};
export default MyChickens;
