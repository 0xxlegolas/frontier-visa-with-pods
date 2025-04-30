// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Counter, VisaStatus } from "../codegen/index.sol";

contract VisaSystem is System {
  // Visa status constants
  uint8 constant NONE = 0;
  uint8 constant BLUE = 1;
  uint8 constant GREEN = 2;
  uint8 constant GOLDEN = 3;

  // Killmail thresholds for visa status
  uint32 constant BLUE_THRESHOLD = 2;
  uint32 constant GREEN_THRESHOLD = 5;
  uint32 constant GOLDEN_THRESHOLD = 10;

  /**
   * @notice Processes a killmail submission and updates the player's visa status
   * @param player The address of the player submitting the killmail
   * @return newCount The new killmail count
   * @return newStatus The new visa status
   */
  function submitKillmail(address player) public returns (uint32 newCount, uint8 newStatus) {
    // Get current count and increment
    uint32 currentCount = Counter.getValue(player);
    newCount = currentCount + 1;
    Counter.setValue(player, newCount);

    // Determine and set new visa status
    if (newCount >= GOLDEN_THRESHOLD) {
      newStatus = GOLDEN;
    } else if (newCount >= GREEN_THRESHOLD) {
      newStatus = GREEN;
    } else if (newCount >= BLUE_THRESHOLD) {
      newStatus = BLUE;
    } else {
      newStatus = NONE;
    }

    // Update visa status
    VisaStatus.setStatus(player, newStatus);
  }
} 