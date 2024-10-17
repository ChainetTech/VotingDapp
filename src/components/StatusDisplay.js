import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json';

function StatusDisplay() {
    const [contractAddress, setContractAddress] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3');
    const [status, setStatus] = useState('');
    const [totalVoters, setTotalVoters] = useState(0);
    const [totalVotes, setTotalVotes] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                if (!contractAddress) {
                    setError('La dirección del contrato no está establecida.');
                    return;
                }

                // Conectar con la billetera de Ethereum
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(contractAddress, contractABI, provider);

                // Obtener el estado actual
                const registrationEnded = await contract.registrationEnded();
                const votingStarted = await contract.votingStarted();
                const votingEnded = await contract.votingEnded();
                const voters = await contract.voterAddresses(); // Asumiendo que el contrato tiene un método para obtener las direcciones de los votantes
                const totalVotesCount = await contract.totalVotesCast(); // Obtener el total de votos emitidos

                // Determinar el estado
                if (!registrationEnded) {
                    setStatus('El registro está abierto');
                } else if (!votingStarted) {
                    setStatus('El registro ha terminado. La votación aún no ha comenzado.');
                } else if (!votingEnded) {
                    setStatus('La votación está abierta');
                } else {
                    setStatus('La votación ha terminado');
                }

                // Establecer el total de votantes y votos
                setTotalVoters(voters.length); // Actualiza esta línea si el método para obtener votantes es diferente
                setTotalVotes(totalVotesCount.toNumber());
            } catch (err) {
                setError('Ocurrió un error al obtener el estado.');
                console.error(err);
            }
        };

        fetchStatus();
    }, [contractAddress]);

    return (
        <div>
            <h2>Estado de la Elección</h2>
            <div>
                <h3>Dirección del Contrato</h3>
                <input
                    type="text"
                    placeholder="Dirección del Contrato"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p><strong>Estado:</strong> {status}</p>
            <p><strong>Total de Votantes Registrados:</strong> {totalVoters}</p>
            <p><strong>Total de Votos Emitidos:</strong> {totalVotes}</p>
        </div>
    );
}

export default StatusDisplay;
