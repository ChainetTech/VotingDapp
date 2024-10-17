import React, { useState, useRef } from 'react';
import { ethers } from 'ethers';
import { QRCodeCanvas } from 'qrcode.react'; // Para generar el código QR
import contractABI from '../contractABI.json';
import './VoterRegistration.css';  // Asegúrate de importar el CSS

function VoterRegistration() {
    const [contractAddress, setContractAddress] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3');
    const [voterName, setVoterName] = useState('');
    const [voterId, setVoterId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [voterQRCode, setVoterQRCode] = useState('');
    const qrCodeRef = useRef(); // Ref para el código QR

    const registerVoter = async () => {
        try {
            if (!contractAddress) {
                setError('La dirección del contrato no está configurada.');
                return;
            }
            if (!voterName || !voterId) {
                setError('El nombre del votante y la ID son obligatorios.');
                return;
            }

            // Restablecer mensajes anteriores
            setError('');
            setSuccess('');
            setVoterQRCode('');

            // Verificar si Ethereum está instalado
            if (!window.ethereum) {
                setError('Por favor, instala MetaMask para usar esta función.');
                return;
            }

            // Conectar a la billetera de Ethereum
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Interactuar con el contrato para registrar al votante
            const tx = await contract.registerVoter(voterName, ethers.utils.id(voterId)); // Pasar nombre e ID del votante
            await tx.wait(); // Esperar a que la transacción sea minada

            // Obtener la dirección del votante
            const voterAddress = await signer.getAddress();

            // Crear datos para el código QR
            const qrData = JSON.stringify({
                voterName: voterName,
                voterId: voterId,
                voterAddress: voterAddress,
                contractAddress: contractAddress
            });

            setVoterQRCode(qrData);
            setSuccess('¡Votante registrado exitosamente! Guarda tu código QR para votar.');
        } catch (err) {
            setError('Ocurrió un error, posiblemente porque el período de registro ha finalizado.');
            console.error(err);
        }
    };

    // Función para descargar el código QR como una imagen
    const downloadQRCode = () => {
        const canvas = qrCodeRef.current.querySelector('canvas');
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'voter_qr_code.png';
        link.click();
    };

    // Función para imprimir el código QR
    const printQRCode = () => {
        window.print();
    };

    return (
        <div className="voter-registration-container">
            <h2>Regístrate como Votante</h2>
            <div className="contract-address">
                <h3>Dirección del Contrato</h3>
                <input
                    type="text"
                    placeholder="Dirección del Contrato"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                />
            </div>
            <div className="voter-details">
                <h3>Detalles del Votante</h3>
                <input
                    type="text"
                    placeholder="Tu Nombre"
                    value={voterName}
                    onChange={(e) => setVoterName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Tu ID de Votante"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                />
            </div>
            <button onClick={registerVoter}>Registrar</button>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            {voterQRCode && (
                <div className="qr-code-container">
                    <h3>Tu Código QR de Votante</h3>
                    <div ref={qrCodeRef}>
                        <QRCodeCanvas value={voterQRCode} size={256} />
                    </div>
                    <p>Por favor guarda este código QR. Lo necesitarás para votar.</p>
                    <div className="qr-code-actions">
                        <button onClick={downloadQRCode}>Descargar Código QR</button>
                        <button onClick={printQRCode}>Imprimir Código QR</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VoterRegistration;
