// Solidity Backend Code
pragma solidity ^0.8.0;

contract EvidenceManagement {
    
    struct Evidence {
        string fileName;
        string fileType;
        string fileContent;
        string functionName;
        string description;
        string timestamp;
        address uploader;
    }

    Evidence[] public evidences;

    event EvidenceUploaded(
        address indexed uploader,
        string fileName,
        string fileType,
        string functionName,
        string description,
        string timestamp
    );

    event AccountConnected(address indexed account);

    function uploadEvidence(
        string memory _fileName,
        string memory _fileType,
        string memory _fileContent,
        string memory _functionName,
        string memory _description,
        string memory _timestamp
    ) public {
        
        evidences.push(Evidence({
            fileName: _fileName,
            fileType: _fileType,
            fileContent: _fileContent,
            functionName: _functionName,
            description: _description,
            timestamp: _timestamp,
            uploader: msg.sender
        }));

        emit EvidenceUploaded(
            msg.sender,
            _fileName,
            _fileType,
            _functionName,
            _description,
            _timestamp
        );
    }

    function getEvidences() public view returns (Evidence[] memory) {
        return evidences;
    }

    function connectAccount() public {
        emit AccountConnected(msg.sender);
    }
}
