import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json'; // ABI del contrato

function AdminPanel() {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Reemplaza con la dirección de tu contrato desplegado

    const adminAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Reemplaza con la dirección del administrador (dirección del despliegue)

    // Inicio de sesión de MetaMask y detección de cuenta
    useEffect(() => {
        const loadMetaMaskAccount = async () => {
            if (window.ethereum) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const accounts = await provider.send('eth_requestAccounts', []);
                    setAccount(accounts[0]);

                    // Cargar el contrato
                    const signer = provider.getSigner();
                    const electionContract = new ethers.Contract(contractAddress, contractABI, signer);
                    setContract(electionContract);

                    // Verificar si la cuenta conectada es la del administrador
                    if (accounts[0].toLowerCase() === adminAddress.toLowerCase()) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } catch (err) {
                    console.error('Error al cargar la cuenta de MetaMask: ', err);
                }
            } else {
                setError('MetaMask no está instalado. Por favor, instálalo para continuar.');
            }
        };

        loadMetaMaskAccount();
    }, []);

    // Función para reiniciar la elección (solo accesible por el administrador)
    const handleResetElection = async () => {
        if (!isAdmin) {
            setError('No estás autorizado para realizar esta acción.');
            return;
        }

        if (!contract) {
            setError('El contrato no está inicializado.');
            return;
        }

        try {
            setError('');
            setSuccess('');

            // Llamar a la función resetElection del contrato
            const tx = await contract.resetElection();
            await tx.wait(); // Esperar a que la transacción sea minada

            setSuccess('¡Elección reiniciada con éxito!');
        } catch (err) {
            setError(`Error al reiniciar la elección: ${err.message}`);
        }
    };

    return (
        <div>
            {isAdmin ? (
                <div>
                    <h2>Panel de Administración</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <button onClick={handleResetElection}>Reiniciar Elección</button>
                </div>
            ) : (
                <p>No estás autorizado para acceder a este panel de administración.</p>
            )}
        </div>
    );
}

export default AdminPanel;
