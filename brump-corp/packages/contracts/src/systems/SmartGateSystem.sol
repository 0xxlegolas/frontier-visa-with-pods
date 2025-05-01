// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { console } from "forge-std/console.sol";
import { ResourceId } from "@latticexyz/world/src/WorldResourceId.sol";
import { WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";
import { IBaseWorld } from "@latticexyz/world/src/codegen/interfaces/IBaseWorld.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { RESOURCE_SYSTEM } from "@latticexyz/world/src/worldResourceTypes.sol";

import { Tenant, CharactersByAccount } from "@eveworld/world-v2/src/namespaces/evefrontier/codegen/index.sol";

import {  VisaByCharacter , VisaStatus} from "../codegen/index.sol";


/**
 * @dev This contract is an example for implementing logic to a smart gate
 */
contract SmartGateSystem is System {  

  function canJump(uint256 characterId, uint256 sourceGateId, uint256 destinationGateId) public view returns (bool) {
    address player = VisaByCharacter.get(characterId);
    uint8 status = VisaStatus.getStatus(player);

    if(status == 1|| status == 2 || status == 3){
      return true;
    }
    return false; 
  }
}