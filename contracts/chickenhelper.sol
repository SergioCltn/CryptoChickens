//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.6.0;

import "./chickenbreeding.sol";

contract ChickenHelper is ChickenBreeding {
    uint levelUpFee = 0.001 ether;

    modifier aboveLevel(uint _level, uint _chickenId) {
        require(chickens[_chickenId].level >= _level);
        _;
    }

    function withdraw() external onlyOwner {
        address payable _owner = owner();
        _owner.transfer(address(this).balance);
    }

    
    function getWithdrawalBalance(address _owner)
        external
        view
        returns (uint256)
    {
        return pendingWithdraws[_owner];
    }

    function withdrawUser(address user) external {
        require(msg.sender == user);
        address payable _user = msg.sender;
        uint amount = pendingWithdraws[msg.sender];
        pendingWithdraws[msg.sender] = 0;
        if (!_user.send(amount)) {
            pendingWithdraws[msg.sender] = 0;
        }
    }

    function setLevelUpFee(uint _fee) external onlyOwner {
        levelUpFee = _fee;
    }

    function levelUp(uint _chickenId) external payable {
        Chicken storage chicken = chickens[_chickenId];
        require(chicken.gestationTime <= now);
        require(msg.value >= levelUpFee);
        uint fee3 = levelUpFee.mul(3);
        uint fee5 = levelUpFee.mul(5);
        if (msg.value < fee3) chicken.level = chicken.level.add(1);
        else if (msg.value >= fee3 && msg.value < fee5)
            chicken.level = chicken.level.add(3);
        else if (msg.value >= fee5) chicken.level = chicken.level.add(5);
    }

    function changeName(uint _chickenId, string calldata _newName)
        external
        aboveLevel(2, _chickenId)
        onlyOwnerOf(_chickenId)
    {
        chickens[_chickenId].name = _newName;
    }

    function changeDna(uint _chickenId, uint _newDna)
        external
        aboveLevel(20, _chickenId)
        onlyOwnerOf(_chickenId)
    {
        chickens[_chickenId].dna = _newDna;
    }

    function getChickensByOwner(address _owner)
        external
        view
        returns (uint[] memory)
    {
        uint[] memory result = new uint[](ownerChickenCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < chickens.length; i++) {
            if (chickenToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getFeeLevelUpFee() public view returns (uint) {
        return levelUpFee;
    }
}
