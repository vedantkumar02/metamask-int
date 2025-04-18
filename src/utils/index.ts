export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (addr: string) => {
  const upperAfterLastTwo = addr.slice(0, 2) + addr.slice(2);
  return `${upperAfterLastTwo.substring(0, 12)}.....${upperAfterLastTwo.substring(30)}`;
};

export const parseError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string" || typeof error === "number" || typeof error === "boolean") return String(error);
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    (typeof error.message === "string" || typeof error.message === "number" || typeof error.message === "boolean")
  )
    return String(error.message);

  return "Something went wrong!";
};
