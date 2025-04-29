import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { PodVerifier } from "./pod/PodVerifier";

export const App = () => {
  const {
    components: { Counter },
    systemCalls: { increment },
  } = useMUD();

  const counter = useComponentValue(Counter, singletonEntity);

  const handleValidPod = async () => {
    await increment();
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Frontier Visa with PODs</h1>
      
      <div style={{ marginBottom: "2rem" }}>
        <h2>Counter Example</h2>
        <div>
          Counter: <span>{counter?.value ?? "??"}</span>
        </div>
        <button
          type="button"
          onClick={async (event) => {
            event.preventDefault();
            console.log("new counter value:", await increment());
          }}
        >
          Increment
        </button>
      </div>

      <PodVerifier onValidPod={handleValidPod} />
    </div>
  );
};
