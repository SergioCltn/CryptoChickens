import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useWeb3Contract } from "react-moralis";
import Minting from "./pages/Minting";
import Battle from "./pages/Battle";
import MyChickens from "./pages/MyChickens";
import Chicken from "./pages/Chicken";
import Breeding from "./pages/Breeding";
import Header from "./components/Header";
import AboutUs from "./pages/AboutUs";
import NotPage from "./pages/NotPage";
import contract from "./contracts/CryptoChickens.json";

function App() {
  const abi = contract.abi;
  const contractAddress = contract.networks[5777].address;
  const { runContractFunction: getTime } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getTime",
    params: {},
  });

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Minting
              abi={abi}
              contractAddress={contractAddress}
              getTime={getTime}
            />
          }
        />
        <Route
          path="/chickenbattle"
          element={
            <Battle
              abi={abi}
              contractAddress={contractAddress}
              getTime={getTime}
            />
          }
        />
        <Route
          path="/chicken/:id"
          element={
            <Chicken
              abi={abi}
              contractAddress={contractAddress}
              getTime={getTime}
            />
          }
        />
        <Route
          path="/chickens"
          element={
            <MyChickens
              abi={abi}
              contractAddress={contractAddress}
              getTime={getTime}
            />
          }
        />
        <Route
          path="/breeding"
          element={
            <Breeding
              abi={abi}
              contractAddress={contractAddress}
              getTime={getTime}
            />
          }
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="*" element={<NotPage />} />
      </Routes>
    </div>
  );
}

export default App;
