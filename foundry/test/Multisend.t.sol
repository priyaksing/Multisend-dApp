// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Multisend} from "../src/Multisend.sol";

contract MultisendTest is Test {
    Multisend public multisend;

    function setUp() public {
        multisend = new Multisend();
    }

    function test_send() public {
        address payable[] memory recipients = new address payable[](2);
        uint[] memory amounts = new uint[](2);

        // Address generated on vanity.eth
        recipients[0] = payable(0x17e82A9D279539F13035f86D3F2f4ba17C4Ee756);
        recipients[1] = payable(0x0E1FD62D30B546b6647eFffE6CE655C41C01a262);
        amounts[0] = 50; //wei
        amounts[1] = 100;
        multisend.send{value: 150}(recipients, amounts);
        assertEq(address(recipients[0]).balance, amounts[0]);
        assertEq(address(recipients[1]).balance, amounts[1]);
    }
}
