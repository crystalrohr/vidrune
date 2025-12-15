import { getDefaultConfig } from "connectkit";
import { createConfig, http, custom } from "wagmi";
import { anvil } from "viem/chains";
import { isMiniPay } from "@/utils/minipay";

// Polygon Amoy Testnet chain configuration
const polygonAmoy = {
  id: 80002,
  name: "Polygon Amoy",
  nativeCurrency: {
    name: "POL",
    symbol: "POL",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-amoy.polygon.technology"],
    },
  },
  blockExplorers: {
    default: {
      name: "Polygon Scan",
      url: "https://amoy.polygonscan.com/",
    },
  },
} as const;

// Detect if we're running against Anvil (local development)
const isAnvil = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  return backendUrl.includes("localhost") || backendUrl.includes("127.0.0.1");
};

// Get the appropriate chain based on environment
const getChain = () => {
  return isAnvil() ? anvil : polygonAmoy;
};

// Use custom transport for MiniPay, otherwise use http
const getTransport = () => {
  if (typeof window !== "undefined" && isMiniPay() && window.ethereum) {
    return custom(window.ethereum);
  }
  return http();
};

const activeChain = getChain();

export const config = createConfig(
  getDefaultConfig({
    appName: "Vidrune",
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    chains: [activeChain],
    transports: {
      [activeChain.id]: getTransport(),
    },
  }),
);
