import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json';
import './Dashboard.css';

// Import local images
import candidate01 from '../images/candidate01.jpg';
import candidate02 from '../images/candidate02.jpg';

function Dashboard() {
    const [contractAddress, setContractAddress] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3');
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                if (!contractAddress) {
                    setError('La dirección del contrato no está configurada.');
                    return;
                }

                if (!window.ethereum) {
                    setError('El proveedor de Ethereum no está disponible.');
                    return;
                }

                // Connect to Ethereum wallet
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(contractAddress, contractABI, provider);

                // Fetch the number of candidates
                const candidatesCount = await contract.candidatesCount();

                // Loop through each candidate and fetch their details
                const candidatesArray = [];
                for (let i = 1; i <= candidatesCount; i++) {
                    const candidate = await contract.candidates(i);
                    candidatesArray.push({
                        id: candidate.id.toNumber(),
                        name: candidate.name,
                        party: candidate.party,
                        voteCount: candidate.voteCount.toNumber(),
                        image: i === 1 ? candidate01 : candidate02 // Example logic for assigning images
                    });
                }

                setCandidates(candidatesArray);
            } catch (err) {
                setError('Ocurrió un error al obtener los candidatos.');
                console.error(err);
            }
        };

        const setupEventListener = () => {
            if (!window.ethereum) return;

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI, provider);

            // Set up an event listener for real-time updates
            const onVoteCasted = () => {
                fetchCandidates();
            };

            contract.on('VoteCasted', onVoteCasted);

            // Cleanup the event listener when the component unmounts
            return () => {
                contract.off('VoteCasted', onVoteCasted);
            };
        };

        fetchCandidates();
        const cleanupListener = setupEventListener();

        return cleanupListener;
    }, [contractAddress]);

    return (
        <div className="dashboard">
            <h2>Panel de Control de Elecciones</h2>
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
            <table className="candidates-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Partido</th>
                        <th>Conteo de Votos</th>
                        <th>Imagen</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map(candidate => (
                        <tr key={candidate.id}>
                            <td>{candidate.id}</td>
                            <td>{candidate.name}</td>
                            <td>{candidate.party}</td>
                            <td>{candidate.voteCount}</td>
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

export default Dashboard;