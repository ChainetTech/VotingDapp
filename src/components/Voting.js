import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { QrReader } from 'react-qr-reader';
import contractABI from '../contractABI.json';
import './Voting.css';

// Importar imágenes locales
import candidate01 from '../images/candidate01.jpg';
import candidate02 from '../images/candidate02.jpg';

// Crear un objeto para mapear las ID de los candidatos con sus respectivas imágenes
const candidateImages = {
  1: candidate01,
  2: candidate02,
};

function Voting() {
    const [contractAddress, setContractAddress] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3');
    const [candidates, setCandidates] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [votingStatus, setVotingStatus] = useState('');
    const [voterStatus, setVoterStatus] = useState('');
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [showQrReader, setShowQrReader] = useState(false);

    useEffect(() => {
        fetchCandidatesAndVoterStatus();
    }, [contractAddress]);

    const getContract = async (needSigner = false) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        if (needSigner) {
            const signer = provider.getSigner();
            return new ethers.Contract(contractAddress, contractABI, signer);
        }
        return new ethers.Contract(contractAddress, contractABI, provider);
    };

    const fetchCandidatesAndVoterStatus = async () => {
        try {
            if (!contractAddress) {
                setError('La dirección del contrato no está configurada.');
                return;
            }

            const contract = await getContract();
            
            const [ids, names, voteCounts] = await contract.getPartialResults();
            const candidatesArray = ids.map((id, index) => ({
                id: id.toNumber(),
                name: names[index],
                voteCount: voteCounts[index].toNumber(),
                image: candidateImages[id.toNumber()] || null // Usar la imagen importada o null si no se encuentra
            }));
            setCandidates(candidatesArray);

            await checkVoterStatus();

            setVotingStatus('La votación está activa.');
        } catch (err) {
            console.error('Error al obtener los candidatos y el estado del votante:', err);
            setError(`Error al obtener los datos de la elección: ${err.message}`);
        }
    };

    const checkVoterStatus = async () => {
        try {
            const contract = await getContract(true);
            const signer = await contract.signer;
            const address = await signer.getAddress();
            const voter = await contract.voters(address);

            if (!voter.registered) {
                setVoterStatus('No estás registrado como votante.');
            } else if (voter.hasVoted) {
                setVoterStatus('Ya has votado.');
            } else {
                setVoterStatus('Eres elegible para votar.');
            }
        } catch (err) {
            console.error('Error al verificar el estado del votante:', err);
            setVoterStatus(`No se pudo verificar el estado del votante: ${err.message}`);
        }
    };

    const handleQrCodeScan = (data) => {
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setQrCodeData(parsedData);
                setShowQrReader(false);
                setSuccess('Código QR escaneado exitosamente. Ahora puedes seleccionar un candidato y votar.');
            } catch (err) {
                setError('Datos del código QR no válidos');
            }
        }
    };

    const handleQrCodeError = (err) => {
        console.error(err);
        setError('Error al escanear el código QR');
    };

    const selectCandidate = (candidateId) => {
        setSelectedCandidateId(candidateId);
    };

    const vote = async () => {
        try {
            if (!contractAddress) {
                setError('La dirección del contrato no está configurada.');
                return;
            }

            if (!selectedCandidateId) {
                setError('Por favor selecciona un candidato para votar.');
                return;
            }

            if (!qrCodeData || !qrCodeData.voterId) {
                setError('Por favor escanea tu código QR primero.');
                return;
            }

            setError('');
            setSuccess('');

            const contract = await getContract(true);

            await window.ethereum.request({ method: 'eth_requestAccounts' });

            console.log('Enviando transacción de voto...');
            const tx = await contract.vote(selectedCandidateId, ethers.utils.id(qrCodeData.voterId), { gasLimit: 200000 });
            console.log('Transacción enviada:', tx.hash);
            setSuccess('Transacción de voto enviada. Esperando confirmación...');
            const receipt = await tx.wait();
            console.log('Transacción confirmada:', receipt);

            setSuccess('¡Voto emitido con éxito!');
            setSelectedCandidateId(null);
            await checkVoterStatus();
            await fetchCandidatesAndVoterStatus();
        } catch (err) {
            console.error('Error detallado:', err);
            if (err.code === 4001) {
                setError('La transacción fue rechazada por el usuario.');
            } else if (err.error && err.error.message) {
                setError(`Error en el contrato inteligente: ${err.error.message}`);
                console.error('Detalles del error:', err.error);
            } else {
                setError(`Ocurrió un error: ${err.message}`);
            }
        }
    };

    return (
        <div className="voting-container">
            <h2>Vota por tu candidato favorito</h2>
            <div className="contract-address">
                <h3>Dirección del Contrato</h3>
                <input
                    type="text"
                    placeholder="Dirección del Contrato"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                />
            </div>
            <p className="status">Estado de la Elección: {votingStatus}</p>
            <p className="status">Tu Estado: {voterStatus}</p>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="candidates-list">
                <h3>Candidatos:</h3>
                {candidates.map(candidate => (
                    <div 
                        key={candidate.id} 
                        className={`candidate-card ${selectedCandidateId === candidate.id ? 'selected' : ''}`}
                        onClick={() => selectCandidate(candidate.id)}
                    >
                        {candidate.image && (
                            <img src={candidate.image} alt={`${candidate.name}`} className="candidate-image" />
                        )}
                        <h4>{candidate.name}</h4>
                        <p>Votos: {candidate.voteCount}</p>
                    </div>
                ))}
            </div>
            <div className="vote-form">
                <h3>Emitir tu Voto</h3>
                {!qrCodeData && (
                    <button className="button" onClick={() => setShowQrReader(true)}>
                        Escanear Código QR
                    </button>
                )}
                {showQrReader && (
                    <QrReader
                        onResult={handleQrCodeScan}
                        onError={handleQrCodeError}
                        constraints={{ facingMode: 'environment' }}
                        style={{ width: '100%' }}
                    />
                )}
                {qrCodeData && (
                    <button 
                        className="button" 
                        onClick={vote} 
                        disabled={voterStatus !== 'Eres elegible para votar.' || !selectedCandidateId}
                    >
                        Votar por el Candidato Seleccionado
                    </button>
                )}
            </div>
        </div>
    );
}

export default Voting;
