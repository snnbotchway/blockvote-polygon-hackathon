// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

// Portal contract
contract ElectionPortal {

    // Election states
    enum State {
        NotStarted,
        InProgress,
        Ended
    }

    // Candidate data structure
    struct Candidate {
        uint256 id;
        uint256 voteCount; // Candidate vote count
        bytes32 name; // Candidate name
        string imageHash; // Candidate image URL
    }

    // Election data structure:
    struct Election{
        uint256 id;
        bytes32 title;
        Candidate [] candidates; 
        State state;
        mapping(address => bool) eligible; // Check if address is an eligible voter
        mapping(address => bool) hasVoted; // Check if voter has already voted
    }

    Election [] public elections; // Array with all elections
    bytes32 [] public electionTitles; // Array with all elections
    address public immutable owner; // Contract owner(Election admin)

    // Set owner to address that deploys the contract
    constructor() {
        owner = msg.sender;
    }

    // return elections
    function getElections() public view returns (bytes32 [] memory _titles) {
        _titles = electionTitles;
    }

    // return candidate info
    function getCandidates(uint _electionId) public view returns (Candidate [] memory _candidates) {
        _candidates = elections[_electionId].candidates;
    }

    // Check if msg sender is the owner or not:
    function isOwner() public view returns (bool) {
        if (owner == msg.sender) {
            return true;
        }
        return false;
    }
    
    // Check if msg sender has already voted in given election:
    function hasVoted(uint _electionId) public view returns (bool _hasVoted) {
        // Check if msg sender is in haveVoted array of given election:
        _hasVoted = elections[_electionId].hasVoted[msg.sender];
    }
    
    // Returns true if msg sender is eligible to vote in given election
    function isEligible(uint _electionId) public view returns (bool _eligible) {
        _eligible = elections[_electionId].eligible[msg.sender];
    }

    // Vote for a specific candidate in a given election
    function vote(uint _electionId, uint _candidateId) public {
        require(elections[_electionId].state == State.InProgress, "Election not in progress");
        require(isEligible(_electionId), "Ineligible for election");
        require(!hasVoted(_electionId), "Already voted");

        elections[_electionId].candidates[_candidateId].voteCount++;
        elections[_electionId].hasVoted[msg.sender] = true;
    }   

    // Return state of the election:
    function getElectionState(uint _electionId) public view returns (uint){
        if (elections[_electionId].state == State.NotStarted){
            return 0;
        }
        else if (elections[_electionId].state == State.InProgress){
            return 1;
        }
        else{
            return 2;
        }
    }

    // Creates a new election
    function createElection(bytes32 _title, 
                            bytes32 [] memory _candidateNames, 
                            string [] memory _candidateimageHashes,
                            address [] memory _eligibleVoters) public { 
        require (msg.sender == owner, "Only owner can create elections");
        require(_candidateNames.length >= 2, "Must be two or more candidates.");
        require(_candidateNames.length == _candidateimageHashes.length, "Every candidate must have an image URL");

        //Store election title
        electionTitles.push(_title);

        // Instantiate new election with parameters
        uint256 idx = elections.length;
        elections.push();
        Election storage _election = elections[idx];
        _election.title = _title;
        _election.state = State.NotStarted;

        // Creates candidate structs for the election 
        for(uint i=0; i < _candidateNames.length; i++){
            Candidate memory _candidate;
            _candidate.id = i; 
            _candidate.voteCount = 0; 
            _candidate.name = _candidateNames[i]; 
            _candidate.imageHash = _candidateimageHashes[i];
            _election.candidates.push(_candidate); 
        }

        // Give all eligible voters the right to vote
        for(uint i=0; i < _eligibleVoters.length; i++){
            _election.eligible[_eligibleVoters[i]] = true;
        }
    }

    // Sets given election state to InProgress
    function startElection(uint _electionId) public {
        require(msg.sender == owner, "Only owner can start the election.");
        require(elections[_electionId].state != State.InProgress, "Election is already in progress.");
        require(elections[_electionId].state != State.Ended, "Election has ended.");

        elections[_electionId].state = State.InProgress;
    }

    // Sets given election state to Ended
    function endElection(uint _electionId) public {
        require(msg.sender == owner, "Only owner can end the election.");
        require(elections[_electionId].state == State.InProgress, "Election is not in progress.");
        
        elections[_electionId].state = State.Ended;
    }

}