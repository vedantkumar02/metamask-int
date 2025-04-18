import { useState } from "react";
import { formatAddress } from "~/utils";

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
  const [userAccount, setUserAccount] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState(chains[0].id);

  const handleConnect = async () => {
    const isMetaMaskInstalled = window.ethereum && window.ethereum.isMetaMask;

    if (!isMetaMaskInstalled) {
      alert("MetaMask is not installed");
      return;
    }

    try {
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts?.[0]) {
        setUserAccount(accounts[0]);
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
    }
  };

  const handleSwitchNetwork = async (chainId: string) => {
    const chain = chains.find((c) => c.id === chainId);
    if (!chain || !window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Chain not added to MetaMask, attempt to add
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId,
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
          console.error("Error adding chain:", addError);
        }
      } else {
        console.error("Error switching network:", switchError);
      }
    }
  };

  const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chainId = e.target.value;
    setSelectedChain(chainId);
    handleSwitchNetwork(chainId);
  };

  return (
    <>
      <h2>Wallet Connection</h2>
      <div>
        <button onClick={handleConnect}>Connect with MetaMask</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>Switch Network: </label>
        <select value={selectedChain} onChange={handleChainChange}>
          {chains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.label}
            </option>
          ))}
        </select>
      </div>

      <hr />
      <h2>{userAccount ? "Wallet Connected" : "No Wallet Connected"}</h2>
      {userAccount && (
        <div>
          <div>MetaMask</div>
          <div>({formatAddress(userAccount)})</div>
        </div>
      )}
    </>
  );
};
