require("chai").use(require("chai-as-promised")).should();
const CryptoChickens = artifacts.require("CryptoChickens");

contract("CryptoChickens", ([deployer, user1, user2]) => {
  describe("Deployment testing", async () => {
    it("Deployment successful", async () => {
      const chickenContract = await CryptoChickens.deployed();
      const address = await chickenContract.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe("Chicken Factory testing", async () => {
    it("should create a chicken", async () => {
      const cryptoChickens = await CryptoChickens.deployed();
      await cryptoChickens.createRandomChicken("Chicken 1", {
        from: deployer,
        value: web3.utils.toWei("0.01", "ether"),
      });

      //can't create a chicken if it isn't enough ether
      await await cryptoChickens.createRandomChicken("Chicken 2", {
        value: web3.utils.toWei("0.001", "ether"),
        from: user1,
      }).should.be.rejected;

      const totalChickens = await cryptoChickens.getChickenLength();
      assert.equal(totalChickens, 1);
    });

    it("get chicken by id", async () => {
      const cryptoChickens = await CryptoChickens.deployed();
      const chicken = await cryptoChickens.getChickenFromId(0);
      assert.equal(chicken.name, "Chicken 1");
    });

    it("set and get reward chicken", async () => {
      const cryptoChickens = await CryptoChickens.deployed();
      await cryptoChickens.setRewards(web3.utils.toWei("0.01", "ether"));

      //only the deployer can set rewards
      await await cryptoChickens.setRewards(web3.utils.toWei("0.01", "ether"), {
        from: user1,
      }).should.be.rejected;
      const rewards = await cryptoChickens.getRewards();
      assert.equal(rewards, web3.utils.toWei("0.01", "ether"));
    });

    it("set and get chicken fee", async () => {
      const cryptoChickens = await CryptoChickens.deployed();
      await cryptoChickens.setCreateChickenFee(
        web3.utils.toWei("0.01", "ether")
      );
      //only the deployer can set the fee
      await await cryptoChickens.setCreateChickenFee(
        web3.utils.toWei("0.01", "ether"),
        {
          from: user1,
        }
      ).should.be.rejected;
      const chickenFee = await cryptoChickens.getCreateChickenFee();
      assert.equal(chickenFee, web3.utils.toWei("0.01", "ether"));
    });
  });

  describe("Chicken Breeding testing", async () => {
    it("breed two chickens", async () => {
      const cryptoChickens = await CryptoChickens.deployed();
      await cryptoChickens.createRandomChicken("Chicken 2", {
        from: deployer,
        value: web3.utils.toWei("0.01", "ether"),
      });

      //only the owner can breed the chickens
      await await cryptoChickens.breeding(0, 1, {
        from: user1,
      }).should.be.rejected;

      // a chicken can't breed with itself
      await await cryptoChickens.breeding(0, 0).should.be.rejected;

      await cryptoChickens.breeding(0, 1);

      //chickens can only breed once every 3 days
      await await cryptoChickens.breeding(0, 0).should.be.rejected;

      //an egg can't be used as a breed
      await await cryptoChickens.breeding(0, 2).should.be.rejected;

      const totalChickens = await cryptoChickens.getChickenLength();
      assert.equal(totalChickens, 3);
      assert.equal(
        (await cryptoChickens.getChickenFromId(2)).name,
        "NewChicken"
      );
    });
    it("breeding cooldown", async () => {
      const cryptoChickens = await CryptoChickens.deployed();
      const chicken = await cryptoChickens.getChickenFromId(0);
      const chicken2 = await cryptoChickens.getChickenFromId(1);
      const now = await cryptoChickens.getTime();

      assert.equal(
        chicken.breedingTime > now && chicken2.breedingTime > now,
        true
      );
    });

    it("gestation time", async () => {
      const cryptoChickens = await CryptoChickens.deployed();
      const chicken = await cryptoChickens.getChickenFromId(2);
      const now = await cryptoChickens.getTime();
      assert.equal(chicken.gestationTime > now, true);
    });
  });

  describe("chicken helper testing", async () => {
    it("get chicken by owner", async () => {
      const cryptoChickens = await CryptoChickens.deployed();
      const chicken = await cryptoChickens.getChickensByOwner(deployer);
      assert.equal(chicken.length, 3);
      assert.equal(chicken[0], 0);
      assert.equal(chicken[1], 1);
      assert.equal(chicken[2], 2);
    });

    it("set and get levelup fee", async () => {
      const cryptoChickens = await CryptoChickens.deployed();

      //only the deployer can change the fee
      await await cryptoChickens.setLevelUpFee(
        web3.utils.toWei("0.01", "ether"),
        {
          from: user1,
        }
      ).should.be.rejected;

      await cryptoChickens.setLevelUpFee(web3.utils.toWei("0.01", "ether"));
      const fee = await cryptoChickens.getFeeLevelUpFee();
      assert.equal(fee, web3.utils.toWei("0.01", "ether"));
    });

    it("level up chicken", async () => {
      const cryptoChickens = await CryptoChickens.deployed();

      //can't level up if the chicken hasn't born
      await await cryptoChickens.levelUp(2, {
        from: deployer,
        value: web3.utils.toWei("0.01", "ether"),
      }).should.be.rejected;

      //can't level up chicken if not enough money
      await await cryptoChickens.levelUp(0, {
        from: deployer,
        value: web3.utils.toWei("0.001", "ether"),
      }).should.be.rejected;

      await cryptoChickens.levelUp(0, {
        from: deployer,
        value: web3.utils.toWei("0.01", "ether"),
      });
      const chicken = await cryptoChickens.getChickenFromId(0);
      assert.equal(chicken.level, 2);
    });

    it("change chicken name", async () => {
      const cryptoChickens = await CryptoChickens.deployed();

      //can't change name of chicken if it's not yours
      await await cryptoChickens.changeName(0, "Chicken 3", {
        from: user2,
      }).should.be.rejected;

      //can't change name of chicken if it's not above level 2
      await await cryptoChickens.changeName(1, "Chicken 3", {
        from: deployer,
      }).should.be.rejected;

      await cryptoChickens.changeName(0, "Chicken 3", {
        from: deployer,
      });
      const chicken = await cryptoChickens.getChickenFromId(0);
      assert.equal(chicken.name, "Chicken 3");
    });

    it("withdraw to user", async () => {
      const cryptoChickens = await CryptoChickens.deployed();

      //can't withdraw if it's not your withdrawal
      await await cryptoChickens.withdrawUser(user1, {
        from: deployer,
      }).should.be.rejected;

      await cryptoChickens.withdrawUser(user1, { from: user1 });
      const balance = await cryptoChickens.getWithdrawalBalance(user1);
      assert.equal(balance, 0);
    });

    it("withdraw to deployer", async () => {
      const cryptoChickens = await CryptoChickens.deployed();

      //only the deployer can withdraw the contract balance
      await await cryptoChickens.withdraw({
        from: user1,
      }).should.be.rejected;

      await cryptoChickens.withdraw({ from: deployer });
      const balance = await web3.eth.getBalance(cryptoChickens.address);
      assert.equal(balance, 0);
    });
  });

  describe("chicken ownership testing", async () => {
    it("transfer chicken", async () => {
      const cryptoChickens = await CryptoChickens.deployed();

      //can't transfer chicken if not owner
      await await cryptoChickens.transferFrom(deployer, user1, 0, {
        from: user1,
      }).should.be.rejected;

      await cryptoChickens.transferFrom(deployer, user1, 0, { from: deployer });
      const owner = await cryptoChickens.ownerOf(0);
      assert.equal(owner, user1);
    });

    it("chicken approval", async () => {
      const cryptoChickens = await CryptoChickens.deployed();

      //can't approve if not owner
      await await cryptoChickens.approve(user1, deployer, 0, {
        from: deployer,
      }).should.be.rejected;

      await cryptoChickens.approve(deployer, 0, { from: user1 });
      const approved = await cryptoChickens.getApproved(0);
      assert.equal(approved, deployer);
    });
  });

  describe("Chicken attack testing", async () => {
    it("fight two chickens", async () => {
      const cryptoChickens = await CryptoChickens.deployed();
      await cryptoChickens.createRandomChicken("Chicken 3", {
        from: user1,
        value: web3.utils.toWei("0.01", "ether"),
        gas: 9000000,
      });

      //only the owner of the chicken can attack
      await await cryptoChickens.attack(3, 1, {
        from: deployer,
      }).should.be.rejected;

      await cryptoChickens.attack(3, 1, {
        from: user1,
      });

      //a chicken can only attack once per day
      await await cryptoChickens.attack(3, 1, {
        from: user1,
      }).should.be.rejected;

      const chicken = await cryptoChickens.getChickenFromId(3);
      if (chicken.lossCount > 0) {
        assert.equal(chicken.lossCount, 1);
      } else {
        assert.equal(chicken.winCount, 1);
      }
    });

    it("set and get probabilities", async () => {
      const cryptoChickens = await CryptoChickens.deployed();
      await cryptoChickens.setWinningProbabilities(10, 20, 30, {
        from: deployer,
      });
      //only the deployer can change the probabilities
      await await cryptoChickens.setWinningProbabilities(10, 20, 30, {
        from: user1,
      }).should.be.rejected;

      const probabilities = await cryptoChickens.getWinningProbabilities();
      assert.equal(probabilities[0].toNumber(), 10);
      assert.equal(probabilities[1].toNumber(), 20);
      assert.equal(probabilities[2].toNumber(), 30);
    });
  });
});
