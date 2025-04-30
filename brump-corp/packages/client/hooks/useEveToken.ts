import { useClient, useConnectorClient } from "wagmi";
import { erc20Abi } from "viem";
import { getContract } from "viem";
import { pyrope } from "viem/chains";

const EVE_TOKEN_ADDRESS = "0xD47ED7AF521D1EBB5aCA1E4FaA7238385e600077";

export function useEveToken():
  | {
      eveContract: any;
    }
  | {
      eveContract: undefined;
    } {
  const client = useClient({ chainId: pyrope.id });
  const { data: sessionClient } = useConnectorClient();

  const eveContract = getContract({
    abi: erc20Abi,
    address: EVE_TOKEN_ADDRESS,
    client: {
      public: client,
      wallet: sessionClient,
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return {
    eveContract: eveContract || undefined
  };
}