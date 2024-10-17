import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json';
import './Results.css';

// Import local images
import candidate01 from '../images/candidate01.jpg';
import candidate02 from '../images/candidate02.jpg';

function Results() {
    const [contractAddress, setContractAddress] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3');
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState('');
    const [totalVotes, setTotalVotes] = useState(0);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                if (!contractAddress) {
                    setError('La dirección del contrato no está establecida.');
                    return;
                }

                // Connect to Ethereum wallet
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(contractAddress, contractABI, provider);

                // Fetch the number of candidates
                const candidatesCount = await contract.candidatesCount();
                const candidatesArray = [];
                let totalVotesCount = 0;
                let winningCandidateId = 0;
                let maxVotes = 0;

                // Loop through the candidates and collect their details
                for (let i = 1; i <= candidatesCount; i++) {
                    const candidate = await contract.candidates(i);
                    const candidateVotes = candidate.voteCount.toNumber();
                    
                    // Assign images to candidates based on their ID (example logic)
                    const candidateImage = i === 1 ? candidate01 : candidate02;

                    candidatesArray.push({
                        id: candidate.id.toNumber(),
                        name: candidate.name,
                        party: candidate.party,
                        voteCount: candidateVotes,
                        image: candidateImage
                    });

                    totalVotesCount += candidateVotes;

                    // Track the candidate with the highest votes to identify the winner
                    if (candidateVotes > maxVotes) {
                        maxVotes = candidateVotes;
                        winningCandidateId = candidate.id.toNumber();
                    }
                }

                // Set the candidate data and total votes
                setCandidates(candidatesArray);
                setTotalVotes(totalVotesCount);

                // Fetch winner details
                if (winningCandidateId) {
                    const winnerCandidate = await contract.candidates(winningCandidateId);
                    setWinner({
                        id: winnerCandidate.id.toNumber(),
                        name: winnerCandidate.name,
                        party: winnerCandidate.party,
                        voteCount: winnerCandidate.voteCount.toNumber(),
                        image: winnerCandidate.id.toNumber() === 1 ? candidate01 : candidate02 // Assign image to winner
                    });
                }
            } catch (err) {
                setError('');
                console.error(err);
            }
        };

        fetchResults();
    }, [contractAddress]);

    return (
        <div className="results-container">
            <h2>Resultados de la Elección</h2>
            <div className="contract-address">
                <h3>Dirección del Contrato</h3>
                <input
                    type="text"
                    placeholder="Dirección del Contrato"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                />
            </div>
            {error && <p className="error-message">{error}</p>}
            {winner && (
                <div className="winner-info">
                    <h3>Ganador</h3>
                    <p><strong>Nombre:</strong> {winner.name}</p>
                    <p><strong>Partido:</strong> {winner.party}</p>
                    <p><strong>Votos:</strong> {winner.voteCount}</p>
                    <img 
                        src={winner.image} 
                        alt={`Ganador ${winner.id}`} 
                        style={{ width: '150px', height: 'auto' }} 
                    />
                </div>
            )}
            <table className="results-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Partido</th>
                        <th>Recuento de Votos</th>
                        <th>Porcentaje</th>
                        <th>Imagen</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map(candidate => (
                        <tr key={candidate.id} className={winner && winner.id === candidate.id ? 'winner-row' : ''}>
                            <td>{candidate.id}</td>
                            <td>{candidate.name}</td>
                            <td>{candidate.party}</td>
                            <td>{candidate.voteCount}</td>
                            <td>{totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(2) + '%' : '0%'}</td>
                            <td>
                                <img 
                                    src={candidate.image} 
                                    alt={`Candidato ${candidate.id}`} 
                                    style={{ width: '100px', height: 'auto' }} 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Results;
