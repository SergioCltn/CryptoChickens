import { Card } from "web3uikit";

const DisplaySelect = ({ chicken, selectedChicken, setSelectedChicken }) => {
  return (
    <div className="chickens">
      {chicken.map((auxChicken) => (
        <div
          key={auxChicken.id}
          className="chicken"
          onClick={() => {
            setSelectedChicken(auxChicken.id);
          }}
        >
          <Card
            description={`Level: ${auxChicken.level}`}
            isSelected={selectedChicken === auxChicken.id}
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
  );
};

export default DisplaySelect;
