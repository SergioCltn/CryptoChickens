import { Link } from "react-router-dom";
import { Card } from "web3uikit";

const DisplayLink = ({ chicken }) => {
  return (
    <div className="chickens">
      {chicken.map((auxChicken) => (
        <div key={auxChicken.id} className="chicken">
          <Link to={`/chicken/${auxChicken.id}`}>
            <Card
              className="mainCard"
              description={`Level: ${auxChicken.level}`}
              title={auxChicken.name}
              tooltipText={`DNA: ${auxChicken.dna}`}
            >
              <div>
                <img
                  src={
                    auxChicken.gestationTime === "Not an egg"
                      ? require(`../images/chicken-${
                          Math.floor(auxChicken.dna / 100) % 10
                        }.png`)
                      : require("../images/chicken-egg.png")
                  }
                  alt={auxChicken.name}
                  style={{ height: "150px" }}
                />
              </div>
              <div className="card">
                <span style={{ color: "lightgreen" }}>
                  {`Win Count: ${auxChicken.winCount} \n`}
                </span>
                <span style={{ color: "red" }}>
                  {`Loss Count: ${auxChicken.lossCount}`}
                </span>
              </div>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DisplayLink;
