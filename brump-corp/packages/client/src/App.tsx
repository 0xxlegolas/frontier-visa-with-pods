import "./styles/globals.css";
import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { Button } from "../../../components/ui/button";
import { PodVerifier } from "./pod/PodVerifier";
import {
  Entity,
  getComponentValue,
  getComponentValueStrict,
  ComponentUpdate,
} from "@latticexyz/recs";
import { useEffect, useState } from "react";

export const App = () => {
  const {
    components: { Counter, VisaStatus },
    systemCalls: { submitKillmail },
    network: { world },
  } = useMUD();

  const [playerEntity, setPlayerEntity] = useState<Entity | undefined>();
  const [counterValue, setCounterValue] = useState<number>(0);
  const [visaStatusValue, setVisaStatusValue] = useState<number>(0);
  const [playerAddress, setPlayerAddress] = useState<string | undefined>();

  const handleValidPod = async (player: string) => {
    console.log("Handling valid POD for player:", player);
    setPlayerAddress(player);
    try {
      console.log("Submitting killmail...");
      const result = await submitKillmail(player);
      console.log("Killmail submission result:", result);
    } catch (error) {
      console.error("Error submitting killmail:", error);
    }
  };

  useEffect(() => {
    if (!playerAddress) return;

    console.log("Setting up player entity...");
    const entity = world.registerEntity({ id: playerAddress });
    console.log("Registered entity:", entity);
    setPlayerEntity(entity);

    // Subscribe to component updates
    const counterSubscription = Counter.update$.subscribe(
      (update: ComponentUpdate) => {
        console.log("Counter update:", update);
        const entity = update.entity;
        const value = getComponentValue(Counter, entity)?.value;
        console.log("New counter value:", value);
        if (value !== undefined) {
          setCounterValue(value as number);
        }
      }
    );

    const visaStatusSubscription = VisaStatus.update$.subscribe(
      (update: ComponentUpdate) => {
        const entity = update.entity;
        const visaData = getComponentValue(VisaStatus, entity);
        const hexValue = visaData?.__staticData as string;
        const value = hexValue ? parseInt(hexValue, 16) : undefined;
        console.log("New visa status value:", value);
        if (value !== undefined) {
          setVisaStatusValue(value);
        }
      }
    );

    // Get initial values
    const initialCounter = getComponentValue(Counter, entity);
    const initialVisaStatus = getComponentValue(VisaStatus, entity);
    console.log("Initial counter:", initialCounter);
    console.log("Initial visa status:", initialVisaStatus);

    if (initialCounter?.value !== undefined) {
      setCounterValue(initialCounter.value as number);
    }
    if (initialVisaStatus?.value !== undefined) {
      setVisaStatusValue(initialVisaStatus.value as number);
    }

    return () => {
      counterSubscription.unsubscribe();
      visaStatusSubscription.unsubscribe();
    };
  }, [world, Counter, VisaStatus, playerAddress]);

  const getVisaStatusInfo = (status: number) => {
    console.log("Getting visa status info for status:", status);
    switch (status) {
      case 3:
        return {
          text: "Golden Visa",
          color: "#FFD700",
          image: "/visa-golden.svg",
          description: "Elite status - 10+ killmails",
        };
      case 2:
        return {
          text: "Green Card",
          color: "#00FF00",
          image: "/visa-green.svg",
          description: "Advanced status - 5+ killmails",
        };
      case 1:
        return {
          text: "Blue Card",
          color: "#0000FF",
          image: "/visa-blue.svg",
          description: "Basic status - 2+ killmails",
        };
      default:
        return {
          text: "No Visa",
          color: "#808080",
          image: "/visa-none.svg",
          description: "Start submitting killmails to earn your visa!",
        };
    }
  };

  const statusInfo = getVisaStatusInfo(visaStatusValue);

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        maxWidth: "800px",
        margin: "0 auto",
        borderRadius: "1rem",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1>Frontier Visa with PODs</h1>

      {playerAddress ? (
        <div style={{ marginBottom: "2rem" }}>
          <h2>Your Status</h2>
          <div
            style={{
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div style={{ width: "64px", height: "64px" }}>
              <img
                src={statusInfo.image}
                alt={statusInfo.text}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div>
              <h3 style={{ margin: 0, color: statusInfo.color }}>
                {statusInfo.text}
              </h3>
              <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
                {statusInfo.description}
              </p>
              <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
                Killmail Count: {counterValue}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: "2rem" }}>
          <h2>Welcome to Frontier Visa</h2>
          <p style={{ marginBottom: "1rem" }}>
            Submit your killmail POD to get started and earn your visa status.
          </p>
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <h2>Prove Your Loyalty and Earn a Visa</h2>
        <p style={{ marginBottom: "1rem" }}>
          Submit your killmail POD to increase your status. Requirements:
        </p>
        <ul style={{ marginBottom: "1rem" }}>
          <li>2+ killmails: Blue Card</li>
          <li>5+ killmails: Green Card</li>
          <li>10+ killmails: Golden Visa</li>
        </ul>
        <PodVerifier onValidPod={handleValidPod} />
      </div>
    </div>
  );
};
