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
import { Visa } from "./pod/Visa";
import { VisaStatus as PodVisaStatus } from "./pod/createVisaPod";

export const App = () => {
  const {
    components: { Counter, VisaStatus },
    systemCalls: { submitKillmail },
    network: { world },
  } = useMUD();

  const [playerEntity, setPlayerEntity] = useState<Entity | undefined>();
  const [holderAddress, setHolderAddress] = useState<string | undefined>();
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
      case 1:
        return {
          text: "Golden Visa",
          status: PodVisaStatus.GOLDEN,
          color: "#6d3c12",
          backgroundColor: "linear-gradient(to bottom, #f9dd51, #6d3c12)",
          image: "/visa-gold.png",
          description: "Elite status - 10+ killmails",
        };
      case 2:
        return {
          text: "Black Card",
          status: PodVisaStatus.BLACK,
          color: "white",
          backgroundColor:
            "linear-gradient(to top,rgb(34, 34, 34),rgb(0, 0, 0))",
          image: "/visa-black.png",
          description: "Advanced status - 5+ killmails",
        };
      case 3:
        return {
          text: "Orange Card",
          status: PodVisaStatus.ORANGE,
          color: "#FF4700",
          backgroundColor:
            "linear-gradient(to top,rgb(35, 8, 0),rgb(159, 58, 0))",
          image: "/visa-orange.png",
          description: "Basic status - 2+ killmails",
        };
      default:
        return {
          text: "No Visa",
          status: PodVisaStatus.NONE,
          color: "#808080",
          backgroundColor: "linear-gradient(to top,rgb(34, 34, 35), #808080)",
          image: "/visa-none.png",
          description: "Start submitting killmails to earn your visa!",
        };
    }
  };

  const statusInfo = getVisaStatusInfo(visaStatusValue);

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#0f0f0f",
        maxWidth: "60%",
        margin: "0 auto",
        borderRadius: "1rem",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1>Frontier Visa with PODs</h1>

      <Visa
        playerAddress={playerAddress}
        statusInfo={statusInfo}
        holderAddress={holderAddress}
        counterValue={counterValue}
      />

      <div style={{ marginBottom: "2rem" }}>
        <h2>Prove Your Loyalty and Earn a Visa</h2>
        <p style={{ marginBottom: "1rem" }}>
          Submit your killmail POD to increase your status. Requirements:
        </p>
        <ul style={{ marginBottom: "1rem" }}>
          <li>2+ killmails: Orange Card</li>
          <li>5+ killmails: Black Card</li>
          <li>10+ killmails: Golden Card</li>
        </ul>
        <PodVerifier
          onValidPod={handleValidPod}
          setHolderAddress={setHolderAddress}
        />
      </div>
    </div>
  );
};
