export type Token = {
    mint: string;
    delegate: string;
    delegatedAmount: string;
    owner: string;
};

export type WalletConnectProps = {
    setTokens: (tokens: {
        mint: string;
        delegate: string;
        delegatedAmount: string;
        owner: string;
    }[]) => void;
};

export type TokenTableProps = {
    tokens: Token[];
};

type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";
