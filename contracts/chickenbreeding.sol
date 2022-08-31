//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.6.0;

import "./chickenfactory.sol";

contract ChickenBreeding is ChickenFactory {
    modifier onlyOwnerOf(uint _chickenId) {
        require(msg.sender == chickenToOwner[_chickenId]);
        _;
    }

    function _triggerCooldown(Chicken storage _chicken) internal {
        _chicken.readyTime = uint32(now + cooldownTime);
    }

    function _triggerCooldownBreeding(
        Chicken storage _firstChicken,
        Chicken storage _secondChicken
    ) internal {
        _firstChicken.breedingTime = uint32(now + breedingCooldownTime);
        _secondChicken.breedingTime = uint32(now + breedingCooldownTime);
    }

    function _isReady(Chicken storage _chicken) internal view returns (bool) {
        return (_chicken.readyTime <= now);
    }

    function _isGestating(Chicken storage _chicken)
        internal
        view
        returns (bool)
    {
        return (_chicken.gestationTime <= now);
    }

    function _isBreedable(Chicken storage _chicken)
        internal
        view
        returns (bool)
    {
        return ((_chicken.breedingTime <= now) &&
            (_chicken.gestationTime <= now));
    }

    function breeding(uint _firstChickenId, uint _secondChickenId)
        external
        onlyOwnerOf(_firstChickenId)
        onlyOwnerOf(_secondChickenId)
    {
        require(_firstChickenId != _secondChickenId);
        Chicken storage firstChicken = chickens[_firstChickenId];
        Chicken storage secondChicken = chickens[_secondChickenId];
        require(_isBreedable(firstChicken) && _isBreedable(secondChicken));
        uint _targetDna = secondChicken.dna % dnaModulus;
        uint newDna = (firstChicken.dna + _targetDna) / 2;
        _createEgg("NewChicken", newDna);
        _triggerCooldownBreeding(firstChicken, secondChicken);
    }
}
