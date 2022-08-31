const AboutUs = () => {
  return (
    <div className="aboutus" style={{ paddingTop: "100px" }}>
      <h1>About Us</h1>
      <p style={{ paddingTop: "20px" }}>
        This is a simple ethereum blockchain application that allows you to
        create, breed, and battle chickens.
      </p>
      <p>
        The application is built using the{" "}
        <a href="https://reactjs.org/">React</a> framework and the{" "}
        <a href="https://www.ethereum.org/">Ethereum</a> blockchain.
      </p>
      <p>
        The application is deployed on the{" "}
        <a href="https://rinkeby.infura.io/">Rinkeby Testnet</a> using the{" "}
        <a href="http://www.metamask.io/">MetaMask</a> browser extension.
      </p>
      <p>
        This application was made to demonstrate the use of the{" "}
        <a href="https://solidity.readthedocs.io/en/v0.5.17/">Solidity</a>{" "}
        language and the <a href="https://reactjs.org/">React</a> framework to
        create a web game.
      </p>

      <h1 style={{ paddingTop: "100px" }}>Contributors</h1>
      <h2>Sergio González Sicilia</h2>
    </div>
  );
};
export default AboutUs;
