import Web3 from 'web3';

document.addEventListener('DOMContentLoaded', () => {
  const connectWalletButton = document.getElementById('connectWallet');
  const appDiv = document.getElementById('app');
  const uploadButton = document.getElementById('uploadButton');
  const fileInput = document.getElementById('fileInput');
  const evidenceList = document.getElementById('evidenceList');
  const functionNameInput = document.getElementById('functionNameInput');
  const descriptionInput = document.getElementById('descriptionInput');

  let currentAccount = null;
  let contract = null;

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractABI = [
    {
      "inputs": [],
      "name": "getEvidences",
      "outputs": [
        {
          "components": [
            { "internalType": "string", "name": "fileName", "type": "string" },
            { "internalType": "string", "name": "fileType", "type": "string" },
            { "internalType": "string", "name": "fileContent", "type": "string" },
            { "internalType": "string", "name": "functionName", "type": "string" },
            { "internalType": "string", "name": "description", "type": "string" },
            { "internalType": "string", "name": "timestamp", "type": "string" },
            { "internalType": "address", "name": "uploader", "type": "address" }
          ],
          "internalType": "struct EvidenceManagement.Evidence[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "_fileName", "type": "string" },
        { "internalType": "string", "name": "_fileType", "type": "string" },
        { "internalType": "string", "name": "_fileContent", "type": "string" },
        { "internalType": "string", "name": "_functionName", "type": "string" },
        { "internalType": "string", "name": "_description", "type": "string" },
        { "internalType": "string", "name": "_timestamp", "type": "string" }
      ],
      "name": "uploadEvidence",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const web3 = new Web3(window.ethereum);

  connectWalletButton.addEventListener('click', async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        alert(`Connected to account: ${currentAccount}`);
        connectWalletButton.style.display = 'none';
        appDiv.style.display = 'block';

        contract = new web3.eth.Contract(contractABI, contractAddress);
        renderEvidenceList();
      } catch (error) {
        console.error('MetaMask connection error:', error);
        alert('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask and try again.');
    }
  });

  uploadButton.addEventListener('click', async () => {
    if (!currentAccount) {
      alert('Please connect to a MetaMask account before uploading.');
      return;
    }

    const files = fileInput.files;
    const functionName = functionNameInput.value.trim();
    const description = descriptionInput.value.trim();
    const currentTime = new Date().toLocaleString();

    if (files.length === 0 || !functionName || !description) {
      alert('Please fill in all fields and select files to upload.');
      return;
    }

    // Convert files to Base64 and upload one by one
    for (const file of files) {
      await processFile(file, functionName, description, currentTime);
    }
  });

  async function processFile(file, functionName, description, timestamp) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileContent = reader.result.split(',')[1]; // Extract Base64 content
        const fileName = file.name;
        const fileType = file.type;

        try {
          const nonce = await web3.eth.getTransactionCount(currentAccount, 'latest');
          await contract.methods.uploadEvidence(
            fileName,
            fileType,
            fileContent,
            functionName,
            description,
            timestamp
          ).send({ from: currentAccount, gas: 3000000, nonce });

          alert(`Evidence uploaded successfully: ${fileName}`);
          localStorage.setItem(`evidence_${Date.now()}`, JSON.stringify({
            fileName,
            fileType,
            fileContent,
            functionName,
            description,
            timestamp,
            uploader: currentAccount
          }));
          renderEvidenceList();
          resolve();
        } catch (error) {
          console.error(`Error uploading evidence (${fileName}):`, error);
          alert(`Failed to upload evidence: ${fileName}. Please try again.`);
          reject(error);
        }
      };

      reader.readAsDataURL(file);
    });
  }

  function renderEvidenceList() {
    evidenceList.innerHTML = '';
    for (const key in localStorage) {
      if (key.startsWith('evidence_')) {
        const evidence = JSON.parse(localStorage.getItem(key));
        if (evidence.uploader.toLowerCase() === currentAccount.toLowerCase()) {
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>File:</strong> ${evidence.fileName}<br>
            <strong>Function Name:</strong> ${evidence.functionName}<br>
            <strong>Description:</strong> ${evidence.description}<br>
            <strong>Time:</strong> ${evidence.timestamp}<br>
          `;

          const viewButton = document.createElement('button');
          viewButton.textContent = 'View';
          viewButton.addEventListener('click', () => {
            const blob = new Blob([Uint8Array.from(atob(evidence.fileContent), c => c.charCodeAt(0))], { type: evidence.fileType });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
          });

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', () => {
            localStorage.removeItem(key);
            renderEvidenceList();
          });

          li.appendChild(viewButton);
          li.appendChild(deleteButton);
          evidenceList.appendChild(li);
        }
      }
    }
  }
});

// Fix: Export App as a module if needed for import
const App = {};
export default App;
