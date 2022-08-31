//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.6.0;

import "./ownable.sol";
import "./safemath.sol";

contract ChickenFactory is Ownable {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    event NewChicken(uint chickenId, string name, uint dna);
    event BattleResolve(bool result, string resultString);

    uint dnaDigits = 16;
    uint dnaModulus = 10**dnaDigits;
    uint cooldownTime = 1 days;
    uint breedingCooldownTime = 3 days;
    uint gestationCooldownTime = 2 days;
    uint rewards = 0.001 ether;
    uint createChickenFee = 0.01 ether;

    struct Chicken {
        string name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        //cuando tiene un hijo y pilla cooldown
        uint32 breedingTime;
        //el hijo cuando nace y tiene que crecer
        uint32 gestationTime;
        uint16 winCount;
        uint16 lossCount;
    }

    Chicken[] public chickens;

    mapping(uint => address) public chickenToOwner;
    mapping(address => uint) ownerChickenCount;
    mapping(address => uint) pendingWithdraws;

    function _createChicken(string memory _name, uint _dna) internal {
        uint id = chickens.push(
            Chicken(_name, _dna, 1, uint32(now), uint32(now), uint32(now), 0, 0)
        ) - 1;
        chickenToOwner[id] = msg.sender;
        ownerChickenCount[msg.sender] = ownerChickenCount[msg.sender].add(1);
        emit NewChicken(id, _name, _dna);
    }

    function _createEgg(string memory _name, uint _dna) internal {
        uint id = chickens.push(
            Chicken(
                _name,
                _dna,
                1,
                uint32(now + gestationCooldownTime),
                uint32(now + gestationCooldownTime),
                uint32(now + gestationCooldownTime),
                0,
                0
            )
        ) - 1;
        chickenToOwner[id] = msg.sender;
        ownerChickenCount[msg.sender] = ownerChickenCount[msg.sender].add(1);
        emit NewChicken(id, _name, _dna);
    }

    function _generateRandomDna(string memory _str)
        private
        view
        returns (uint)
    {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }

    function createRandomChicken(string memory _name) public payable {
        require(msg.value == createChickenFee);
        require(ownerChickenCount[msg.sender] <= 2);
        uint randDna = _generateRandomDna(_name);
        randDna = randDna - (randDna % 100);
        _createChicken(_name, randDna);
    }

    function getChickenFromId(uint _id)
        public
        view
        returns (
            string memory name,
            uint dna,
            uint level,
            uint readyTime,
            uint winCount,
            uint lossCount,
            uint breedingTime,
            uint gestationTime
        )
    {
        require(_id < chickens.length);
        Chicken memory _chicken = chickens[_id];
        return (
            _chicken.name,
            _chicken.dna,
            _chicken.level,
            _chicken.readyTime,
            _chicken.winCount,
            _chicken.lossCount,
            _chicken.breedingTime,
            _chicken.gestationTime
        );
    }

    function getChickenLength() public view returns (uint) {
        return chickens.length;
    }

    function getRewards() public view returns (uint) {
        return rewards;
    }

    function setCreateChickenFee(uint _fee) external onlyOwner {
        createChickenFee = _fee;
    }

    function getCreateChickenFee() public view returns (uint) {
        return createChickenFee;
    }

    function setRewards(uint _rewards) external onlyOwner {
        rewards = _rewards;
    }

    function getTime() public view returns (uint) {
        return now;
    }
}
