// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
//deployed at-0x2f64c4fc49d61fca17c9c9c35501624d506dc4bd

contract message{
    mapping(address=>string) private messages;

    function store(string memory _message) public {
       messages[msg.sender]=_message;
    }

    function retrieve(address sender) public view returns(string memory ){
        return messages[sender];

    }
}