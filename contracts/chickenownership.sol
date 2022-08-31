//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.6.0;

import "./chickenattack.sol";
import "./erc721.sol";
import "./safemath.sol";

contract ChickenOwnership is ChickenAttack, ERC721 {
    using SafeMath for uint256;

    mapping(uint => address) chickenApprovals;

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerChickenCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return chickenToOwner[_tokenId];
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) private {
        ownerChickenCount[_to] = ownerChickenCount[_to].add(1);
        ownerChickenCount[msg.sender] = ownerChickenCount[msg.sender].sub(1);
        chickenToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {
        require(
            chickenToOwner[_tokenId] == msg.sender ||
                chickenApprovals[_tokenId] == msg.sender
        );
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId)
        external
        payable
        onlyOwnerOf(_tokenId)
    {
        chickenApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        return chickenApprovals[_tokenId];
    }
}
