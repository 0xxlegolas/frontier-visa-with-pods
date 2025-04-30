// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Specify a store so that you can use tables directly in PostDeploy
    StoreSwitch.setStoreAddress(worldAddress);

    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    // vm.startBroadcast(deployerPrivateKey);

    // Test the visa system with a sample address
    // address testPlayer = address(0x123);
    // (uint32 count, uint8 status) = IWorld(worldAddress).brumpcorp__submitKillmail(testPlayer);
    // console.log("Test Visa System:");
    // console.log("Killmail Count:", count);
    // console.log("Visa Status:", status);

    // vm.stopBroadcast();
  }
}
