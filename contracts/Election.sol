// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {

    // Structure to store candidate details
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    // Structure to store voter details
    struct Voter {
        bool registered;
        bool hasVoted;
        string name;
        string voterId;
        uint voteCandidateId;
    }

    // State variables
    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    mapping(bytes32 => bool) public usedVoterIds;

    uint public candidatesCount;
    uint public totalVotesCast;
    address public admin;

    address[] public voterAddresses;

    // Event declarations
    event CandidateRegistered(uint indexed candidateId);
    event VoterRegistered(address indexed voterAddress, string voterName, string voterId);
    event VoteCasted(uint indexed candidateId);
    event ElectionEnded(uint indexed winningCandidateId, string winnerName);
    event ElectionReset();

    constructor() {
        admin = msg.sender;  // The deployer is the admin
        totalVotesCast = 0;
    }

    // Modifier to ensure only the admin can call specific functions
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Function for candidates to register
    function registerCandidate(string memory _name, string memory _party) public {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _party, 0);
        emit CandidateRegistered(candidatesCount);
    }

    // Function for voters to register with name and voterId
    function registerVoter(string memory _name, string memory _voterId) public {
        require(!voters[msg.sender].registered, "Voter is already registered");
        voters[msg.sender] = Voter(true, false, _name, _voterId, 0);
        voterAddresses.push(msg.sender); // Add voter address to the array
        emit VoterRegistered(msg.sender, _name, _voterId);
    }

    // Function to cast a vote
    function vote(uint _candidateId, bytes32 _voterId) public {
        require(!usedVoterIds[_voterId], "This QR code has already been used");
        require(voters[msg.sender].registered, "You are not registered as a voter");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].voteCandidateId = _candidateId;
        usedVoterIds[_voterId] = true;

        candidates[_candidateId].voteCount++;
        totalVotesCast++;

        emit VoteCasted(_candidateId);
    }

    // Function to get the election results (no restriction to be callable anytime)
    function getResults() public view returns (uint[] memory, string[] memory, uint[] memory) {
        uint[] memory ids = new uint[](candidatesCount);
        string[] memory names = new string[](candidatesCount);
        uint[] memory voteCounts = new uint[](candidatesCount);

        for (uint i = 1; i <= candidatesCount; i++) {
            ids[i-1] = candidates[i].id;
            names[i-1] = candidates[i].name;
            voteCounts[i-1] = candidates[i].voteCount;
        }

        return (ids, names, voteCounts);
    }

    // Function to reset the election (only callable by admin)
    function resetElection() public onlyAdmin {
        for (uint i = 1; i <= candidatesCount; i++) {
            delete candidates[i];
        }
        candidatesCount = 0;

        for (uint i = 0; i < voterAddresses.length; i++) {
            delete voters[voterAddresses[i]];
        }
        delete voterAddresses;
        totalVotesCast = 0;

        emit ElectionReset();
    }

    // Function to view partial election results
    function getPartialResults() public view returns (uint[] memory, string[] memory, uint[] memory) {
        uint[] memory ids = new uint[](candidatesCount);
        string[] memory names = new string[](candidatesCount);
        uint[] memory voteCounts = new uint[](candidatesCount);

        for (uint i = 1; i <= candidatesCount; i++) {
            ids[i-1] = candidates[i].id;
            names[i-1] = candidates[i].name;
            voteCounts[i-1] = candidates[i].voteCount;
        }

        return (ids, names, voteCounts);
    }
}
