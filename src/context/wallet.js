import { create } from "zustand";

export const useWalletStore = create((set) => ({
  walletData: undefined,
  account: undefined,
  network: undefined,
  contractAddress: undefined,
  connectTextSt: undefined,
  contractTextSt: undefined,
  executeTextSt: undefined,
  connectLinkSt: "",
  contractLinkSt: undefined,
  executeLinkSt: undefined,

  setWalletData: (data) => set({ walletData: data }),
  setAccount: (acc) => set({ account: acc }),
  setNetwork: (net) => set({ network: net }),
  setContractAddress: (addr) => set({ contractAddress: addr }),
  setConnectTextSt: (text) => set({ connectTextSt: text }),
  setContractTextSt: (text) => set({ contractTextSt: text }),
  setExecuteTextSt: (text) => set({ executeTextSt: text }),
  setConnectLinkSt: (link) => set({ connectLinkSt: link }),
  setContractLinkSt: (link) => set({ contractLinkSt: link }),
  setExecuteLinkSt: (link) => set({ executeLinkSt: link }),
}));
