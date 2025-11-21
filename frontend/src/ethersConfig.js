import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "ethers";
import EvidenceManagerABI from "./EvidenceManagerABI.json";

const provider = new Web3Provider(window.ethereum, "any"); // Connect to any network
const signer = provider.getSigner();

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
const contract = new Contract(contractAddress, EvidenceManagerABI, signer);

export { provider, signer, contract };
