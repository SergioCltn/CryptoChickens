import { ConnectButton } from "web3uikit";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <nav>
      <div className="logo">CryptoChickens</div>
      <input type="checkbox" id="click"></input>
      <label htmlFor="click" className="menu-btn">
        <img src={require("../images/fas-fa-bars.svg").default} alt="menu" />
      </label>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/chickens">Chickens</Link>
        </li>
        <li>
          <Link to="/chickenbattle">Battle</Link>
        </li>
        <li>
          <Link to="/breeding">Breeding</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li className="connectButton">
          <ConnectButton />
        </li>
      </ul>
    </nav>
  );
};

export default Header;
