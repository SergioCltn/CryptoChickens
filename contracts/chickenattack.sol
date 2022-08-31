//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.6.0;

import "./chickenhelper.sol";

contract ChickenAttack is ChickenHelper {
    uint randNonce = 0;
    uint attackVictoryProbabilityEasy = 80;
    uint attackVictoryProbabilityNormal = 60;
    uint attackVictoryProbabilityDifficult = 40;

    function randMod(uint _modulus) internal returns (uint) {
        randNonce = randNonce.add(1);
        return
            uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) %
            _modulus;
    }

    // function attack(uint _chickenId, uint _targetId)
    //     external
    //     payable
    //     onlyOwnerOf(_chickenId)
    // {
    //     require(_chickenId != _targetId);
    //     Chicken storage myChicken = chickens[_chickenId];
    //     Chicken storage enemyChicken = chickens[_targetId];
    //     require(_isReady(myChicken));
    //     uint rand = randMod(100);
    //     if (rand <= attackVictoryProbability) {
    //         myChicken.winCount = myChicken.winCount.add(1);
    //         myChicken.level = myChicken.level.add(1);
    //         enemyChicken.lossCount = enemyChicken.lossCount.add(1);
    //         pendingWithdraws[msg.sender] += rewards;
    //         _triggerCooldown(myChicken);
    //         emit BattleResolve(true, ("Your chicken has won!"));
    //     } else {
    //         myChicken.lossCount = myChicken.lossCount.add(1);
    //         enemyChicken.winCount = enemyChicken.winCount.add(1);
    //         _triggerCooldown(myChicken);
    //         emit BattleResolve(false, "Your chicken has lost!");
    //     }
    // }

    function attack(uint _chickenId, uint _difficulty)
        external
        payable
        onlyOwnerOf(_chickenId)
    {
        Chicken storage myChicken = chickens[_chickenId];
        require(_isReady(myChicken));
        require(_difficulty <= 3 && _difficulty > 0);
        uint attackVictoryProbability;
        if (_difficulty == 1)
            attackVictoryProbability = attackVictoryProbabilityEasy;
        else if (_difficulty == 2)
            attackVictoryProbability = attackVictoryProbabilityNormal;
        else attackVictoryProbability = attackVictoryProbabilityDifficult;
        uint rand = randMod(100);
        if (rand <= attackVictoryProbability) {
            myChicken.winCount = myChicken.winCount.add(1);
            myChicken.level = myChicken.level.add(1);
            pendingWithdraws[msg.sender] += rewards.mul(_difficulty);
            _triggerCooldown(myChicken);
            emit BattleResolve(true, ("Your chicken has won!"));
        } else {
            myChicken.lossCount = myChicken.lossCount.add(1);
            _triggerCooldown(myChicken);
            emit BattleResolve(false, "Your chicken has lost!");
        }
    }

    function setWinningProbabilities(
        uint _easy,
        uint _normal,
        uint _difficult
    ) external onlyOwner {
        attackVictoryProbabilityEasy = _easy;
        attackVictoryProbabilityNormal = _normal;
        attackVictoryProbabilityDifficult = _difficult;
    }

    function getWinningProbabilities()
        external
        view
        returns (
            uint,
            uint,
            uint
        )
    {
        return (
            attackVictoryProbabilityEasy,
            attackVictoryProbabilityNormal,
            attackVictoryProbabilityDifficult
        );
    }
}
