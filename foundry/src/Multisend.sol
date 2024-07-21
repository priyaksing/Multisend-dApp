// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

contract Multisend {
    // calldata: location where external values from outside a function are stored into a function

    function send(
        address payable[] calldata recipients,
        uint[] calldata amounts
    ) external payable {
        require(
            recipients.length == amounts.length,
            "Recipients and Amounts are notequal in length"
        );
        for (uint i = 0; i < recipients.length; i++) {
            recipients[i].call{value: amounts[i]}(""); // Sends amounts[i] to recipient address
        }
    }
}
