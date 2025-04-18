import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Supported_Chains } from "@/constants";
import { useCopy, useMetaMask } from "@/hooks";
import { formatAddress } from "@/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const WalletConnect: React.FC = () => {
  const { account, chainId, connect, switchNetwork, walletProvider } = useMetaMask();
  const { copied, copyToClipboard } = useCopy();

  useEffect(() => {
    if (copied) toast.success("Wallet address copied to clipboard!");
  }, [copied]);

  if (!walletProvider) {
    return (
      <main className="min-h-svh flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-medium mb-4">MetaMask wallet not detected.</h1>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="pb-0.5 border-b border-current"
        >
          Please install MetaMask to connect.
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-svh flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-medium mb-4">{account ? "Connected to MetaMask" : "Connect to MetaMask"}</h1>
      {!account && (
        <Button onClick={connect} className="flex items-center gap-2 h-auto w-[300px]">
          <img src={walletProvider.info.icon} alt={walletProvider.info.name} className="h-6" />
          <div>Connect Wallet</div>
        </Button>
      )}
      {account && (
        <Button onClick={(event) => copyToClipboard(event, account)} className="flex items-center gap-2 h-auto">
          <img src={walletProvider.info.icon} alt={walletProvider.info.name} className="h-6" />
          {formatAddress(account)}
        </Button>
      )}

      {account && (
        <div className="mt-8 w-[300px] border rounded-md p-4 bg-muted/50">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Connected Network
            </span>
            <p className="mt-1 border-t pt-1">
              {Supported_Chains.find((chain) => chain.id === chainId)?.label ?? "Unsupported Network"}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="mt-3 text-sm border py-2 px-3 rounded-md bg-muted w-full text-left">
              Switch Network
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[266px]">
              <DropdownMenuLabel>Supported Networks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Supported_Chains.map((chain) => (
                <DropdownMenuItem key={chain.id} onClick={() => switchNetwork(chain.id)} className="cursor-pointer">
                  {chain.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </main>
  );
};
