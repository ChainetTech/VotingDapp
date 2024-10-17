import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json';
import './CandidateRegistration.css';

function CandidateRegistration() {
    const [contractAddress, setContractAddress] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3');
    const [name, setName] = useState('');
    const [party, setParty] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const registerCandidate = async () => {
        try {
            if (!name || !party) {
                setError('Por favor, ingrese tanto el nombre como el partido.');
                return;
            }

            // Reset previous messages
            setError('');
            setSuccess('');

            // Connect to Ethereum wallet
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Interact with the contract to register a candidate
            const tx = await contract.registerCandidate(name, party);
            await tx.wait(); // Wait for the transaction to be mined

            setSuccess('¡Candidato registrado exitosamente!');
            setName('');
            setParty('');
        } catch (err) {
            setError('Ocurrió un error al registrar al candidato.');
            console.error(err);
        }
    };

    return (
        <div className="candidate-registration">
            <h2>Registrar Candidato</h2>
            <div className="contract-address">
                <h3>Dirección del Contrato</h3>
                <input
                    type="text"
                    placeholder="Dirección del Contrato"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                />
            </div>
            <form className="registration-form" onSubmit={(e) => {
                e.preventDefault();
                registerCandidate();
            }}>
                <div className="form-group">
                    <label>Nombre del Candidato:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Partido del Candidato:</label>
                    <input
                        type="text"
                        value={party}
                        onChange={(e) => setParty(e.target.value)}
                    />
                </div>
                <button className="submit-button" type="submit">Registrar</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
}

export default CandidateRegistration;