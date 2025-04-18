import { useCallback, useEffect, useState } from "react";
import { useSyncProviders } from "./use-sync-providers";
import { Supported_Chains, SupportedChain } from "@/constants";

export type NetworkSwitchError = {
  code: number;
};

export const useMetaMask = () => {
  const [walletProvider, setWalletProvider] = useState<EIP6963ProviderDetail | undefined>(undefined);
  const [account, setAccount] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");

  const providers = useSyncProviders();

  const connect = useCallback(async () => {
    if (!walletProvider) return;

    try {
      const accounts = (await walletProvider.provider.request({
        method: "eth_requestAccounts",
      })) as Array<string> | undefined;

      if (accounts?.length) setAccount(accounts[0]);
      else setAccount("");
    } catch (error: unknown) {
      console.error("Error connecting to MetaMask:", error);
    }
  }, [walletProvider]);

  const switchNetwork = useCallback(
    async (chainIdToConnect: SupportedChain["id"]) => {
      if (!walletProvider) return;
      if (chainId === chainIdToConnect) return;

      const chainToConnect = Supported_Chains.find((chain) => chain.id === chainIdToConnect);
      if (!chainToConnect) {
        console.error("Unsupported network");
        return;
      }

      try {
        await walletProvider.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainToConnect.id }],
        });
      } catch (switchError: unknown) {
        if ((switchError as NetworkSwitchError).code === 4902) {
          try {
            await walletProvider.provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainToConnect.id,
                  chainName: chainToConnect.label,
                  rpcUrls: [chainToConnect.rpcUrl],
                  nativeCurrency: {
                    name: chainToConnect.token,
                    symbol: chainToConnect.token,
                    decimals: 18,
                  },
                  blockExplorerUrls: [chainToConnect.blockExplorer],
                },
              ],
            });
          } catch (addError: unknown) {
            console.error("Error adding network to metamask:", addError);
          }
        }
        console.error("Error switching network:", switchError);
      }
    },
    [chainId, walletProvider]
  );

  useEffect(() => {
    const metamaskProvider = providers?.find((provider) => provider.info.name === "MetaMask");
    setWalletProvider(metamaskProvider);
  }, [providers]);

  useEffect(() => {
    const handleAccountsChanged = (accounts: unknown) => {
      if ((accounts as Array<string>).length !== 0) {
        const currentAccount = (accounts as Array<string>)[0];
        setAccount(currentAccount);
      }
    };

    if (walletProvider && !account) {
      connect();
      walletProvider.provider.on("accountsChanged", handleAccountsChanged);
    }
  }, [account, connect, walletProvider]);

  useEffect(() => {
    const detectChainId = async () => {
      if (!walletProvider) {
        setChainId("");
        return;
      }

      try {
        const chainId = (await walletProvider.provider.request({ method: "eth_chainId" })) as string;
        setChainId(chainId);
        walletProvider.provider.on("chainChanged", (chainId) => {
          setChainId(chainId as string);
        });
      } catch (error) {
        console.error(error);
      }
    };

    detectChainId();
  }, [walletProvider]);

  return { walletProvider, account, chainId, connect, switchNetwork } as const;
};
