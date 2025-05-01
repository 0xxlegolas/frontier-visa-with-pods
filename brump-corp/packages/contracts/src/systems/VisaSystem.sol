// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Counter, VisaStatus , VisaByCharacter} from "../codegen/index.sol";
import { Tenant, CharactersByAccount } from "@eveworld/world-v2/src/namespaces/evefrontier/codegen/index.sol";


contract VisaSystem is System {

  enum Status {
    NONE,
    BLUE,
    GREEN,
    GOLDEN
  }

  // Killmail thresholds for visa status
  uint32 public BLUE_THRESHOLD = 2;
  uint32 public GREEN_THRESHOLD = 5;
  uint32 public GOLDEN_THRESHOLD = 10;

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
      newStatus = uint8(Status.GOLDEN);
    } else if (newCount >= GREEN_THRESHOLD) {
      newStatus = uint8(Status.GREEN);
    } else if (newCount >= BLUE_THRESHOLD) {
      newStatus = uint8(Status.BLUE);
    } else {
      newStatus = uint8(Status.NONE);
    }

    uint256 characterId = CharactersByAccount.getSmartObjectId(player);
    

    // Update visa status
    VisaStatus.setStatus(player, newStatus);
    VisaByCharacter.set(characterId, player);
  }

  function setThreshold(uint32 blue, uint32 green, uint32 golden) public {
    BLUE_THRESHOLD = blue;
    GREEN_THRESHOLD = green;
    GOLDEN_THRESHOLD = golden;
  }
} 