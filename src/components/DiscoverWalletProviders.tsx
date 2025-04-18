import { useEffect, useMemo, useState } from "react";
import { useSyncProviders } from "../hooks/useSyncProviders";
import { formatAddress } from "../utils";

const chains = [
  {
    id: "0x1",
    token: "ETH",
    label: "Ethereum Mainnet",
    rpcUrl: "https://rpc.ankr.com/eth",
  },
  {
    id: "0x2105",
    token: "ETH",
    label: "Base",
    rpcUrl: "https://mainnet.base.org",
  },
];

export const DiscoverWalletProviders = () => {
  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>();
  const [userAccount, setUserAccount] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  const providers = useSyncProviders();

  const metamaskProvider = useMemo(() => providers?.find((provider) => provider.info.name === "MetaMask"), [providers]);

  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    try {
      const accounts = (await providerWithInfo.provider.request({
        method: "eth_requestAccounts",
      })) as Array<string> | undefined;

      setSelectedWallet(providerWithInfo);
      if (accounts?.length) {
        setUserAccount(accounts[0]);
      } else {
        setUserAccount("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const switchNetwork = async (newChainId: (typeof chains)[number]["id"]) => {
    if (!selectedWallet) return;
    if (chainId === newChainId) return;
    const provider = selectedWallet.provider;

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: newChainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        const chain = chains.find((chain) => chain.id === newChainId);
        if (!chain) {
          console.error("Chain not found");
          return;
        }

        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chain.id,
                chainName: chain.label,
                rpcUrls: [chain.rpcUrl],
                nativeCurrency: {
                  name: chain.token,
                  symbol: chain.token,
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error("Add error:", addError);
        }
      }
      console.error("Switch error:", switchError);
    }
  };

  useEffect(() => {
    function handleChainChanged(chainId: string) {
      setChainId(chainId);
    }

    const detectChainId = async () => {
      if (!selectedWallet) {
        setChainId("");
        return;
      }

      try {
        const chainId = (await selectedWallet.provider.request({ method: "eth_chainId" })) as string;
        setChainId(chainId);

        selectedWallet.provider.on("chainChanged", handleChainChanged);
      } catch (error) {
        console.error(error);
      }
    };

    detectChainId();
  }, [selectedWallet]);

  return (
    <>
      <h2>Wallets Detected:</h2>
      <div>
        {!metamaskProvider && <p>Please install MetaMask wallet to connect.</p>}
        {metamaskProvider && (
          <button key={metamaskProvider.info.uuid} onClick={() => handleConnect(metamaskProvider)}>
            <img src={metamaskProvider.info.icon} alt={metamaskProvider.info.name} />
            <div>{metamaskProvider.info.name}</div>
          </button>
        )}
      </div>
      <hr />
      <h2>{userAccount ? "" : "No "}Wallet Selected</h2>
      {userAccount && (
        <div>
          <div>
            <img src={selectedWallet?.info.icon} alt={selectedWallet?.info.name} />
            <div>{selectedWallet?.info.name}</div>
            <div>({formatAddress(userAccount)})</div>
          </div>
        </div>
      )}
      {chainId && (
        <div>
          <div>
            <div>ChainId</div>
            <div>({chainId})</div>
          </div>
        </div>
      )}
      {chains.map((chain) => (
        <button key={chain.id} onClick={() => switchNetwork(chain.id)}>
          Switch to {chain.label}
        </button>
      ))}
    </>
  );
};
