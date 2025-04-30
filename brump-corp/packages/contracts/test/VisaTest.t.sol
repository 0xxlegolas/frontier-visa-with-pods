// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { Counter, VisaStatus } from "../src/codegen/index.sol";

contract VisaTest is MudTest {
  // Constants matching VisaSystem.sol
  uint8 constant NONE = 0;
  uint8 constant BLUE = 1;
  uint8 constant GREEN = 2;
  uint8 constant GOLDEN = 3;

  uint32 constant BLUE_THRESHOLD = 2;
  uint32 constant GREEN_THRESHOLD = 5;
  uint32 constant GOLDEN_THRESHOLD = 10;

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function testSubmitKillmail() public {
    address player = address(0x123);

    // Initial state
    uint32 initialCount = Counter.get(player);
    uint8 initialStatus = VisaStatus.get(player);
    assertEq(initialCount, 0);
    assertEq(initialStatus, NONE);

    // Submit first killmail
    (uint32 count1, uint8 status1) = IWorld(worldAddress).brumpcorp__submitKillmail(player);
    assertEq(count1, 1);
    assertEq(status1, NONE);
    assertEq(Counter.get(player), 1);
    assertEq(VisaStatus.get(player), NONE);

    // Submit second killmail (reaches BLUE threshold)
    (uint32 count2, uint8 status2) = IWorld(worldAddress).brumpcorp__submitKillmail(player);
    assertEq(count2, 2);
    assertEq(status2, BLUE);
    assertEq(Counter.get(player), 2);
    assertEq(VisaStatus.get(player), BLUE);

    // Submit more killmails to reach GREEN threshold
    for (uint i = 0; i < 3; i++) {
      IWorld(worldAddress).brumpcorp__submitKillmail(player);
    }
    (uint32 count3, uint8 status3) = IWorld(worldAddress).brumpcorp__submitKillmail(player);
    assertEq(count3, 6);
    assertEq(status3, GREEN);
    assertEq(Counter.get(player), 6);
    assertEq(VisaStatus.get(player), GREEN);

    // Submit more killmails to reach GOLDEN threshold
    for (uint i = 0; i < 4; i++) {
      IWorld(worldAddress).brumpcorp__submitKillmail(player);
    }
    (uint32 count4, uint8 status4) = IWorld(worldAddress).brumpcorp__submitKillmail(player);
    assertEq(count4, 11);
    assertEq(status4, GOLDEN);
    assertEq(Counter.get(player), 11);
    assertEq(VisaStatus.get(player), GOLDEN);
  }

  function testMultiplePlayers() public {
    address player1 = address(0x123);
    address player2 = address(0x456);

    // Check initial state
    assertEq(Counter.get(player1), 0);
    assertEq(Counter.get(player2), 0);
    assertEq(VisaStatus.get(player1), NONE);
    assertEq(VisaStatus.get(player2), NONE);

    // Player 1 submits killmail
    (uint32 count1, uint8 status1) = IWorld(worldAddress).brumpcorp__submitKillmail(player1);
    assertEq(count1, 1);
    assertEq(status1, NONE);
    assertEq(Counter.get(player1), 1);
    assertEq(VisaStatus.get(player1), NONE);

    // Player 2 submits killmail
    (uint32 count2, uint8 status2) = IWorld(worldAddress).brumpcorp__submitKillmail(player2);
    assertEq(count2, 1);
    assertEq(status2, NONE);
    assertEq(Counter.get(player2), 1);
    assertEq(VisaStatus.get(player2), NONE);

    // Player 1 submits another killmail to reach BLUE
    (uint32 count3, uint8 status3) = IWorld(worldAddress).brumpcorp__submitKillmail(player1);
    assertEq(count3, 2);
    assertEq(status3, BLUE);
    assertEq(Counter.get(player1), 2);
    assertEq(VisaStatus.get(player1), BLUE);

    // Verify Player 2's state hasn't changed
    assertEq(Counter.get(player2), 1);
    assertEq(VisaStatus.get(player2), NONE);
  }
} 