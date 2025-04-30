import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "brumpcorp",
  tables: {
    Counter: {
      schema: {
        player: "address",
        value: "uint32",
      },
      key: ["player"],
    },
    VisaStatus: {
      schema: {
        player: "address",
        status: "uint8", // 0: none, 1: blue, 2: green, 3: golden
      },
      key: ["player"],
    },
  },
});
