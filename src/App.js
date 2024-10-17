import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ethers } from 'ethers';
import './App.css';

// Import Components
import Navigation from './components/Navigation';
import CandidateRegistration from './components/CandidateRegistration';
import VoterRegistration from './components/VoterRegistration';
import Dashboard from './components/Dashboard';
import Voting from './components/Voting';
import Results from './components/Results';
import AdminPanel from './components/AdminPanel';

import contractABI from './contractABI.json';

function App() {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Ensure this matches the correct address

    // Hardcoded admin wallet address
    const adminAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

    // Fetch connected account from MetaMask
    const loadAccountData = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send('eth_requestAccounts', []);
                setAccount(accounts[0]);

                // Check if the connected account is the admin
                if (accounts[0].toLowerCase() === adminAddress.toLowerCase()) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error fetching account: ', error);
            }
        }
    };

    // Load the contract
    const loadBlockchainData = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const electionContract = new ethers.Contract(contractAddress, contractABI.abi, signer);
                setContract(electionContract);
            } catch (error) {
                console.error('Error loading contract data: ', error);
            }
        }
    };

    useEffect(() => {
        loadAccountData(); // Load connected account
    }, []);

    useEffect(() => {
        if (account) {
            loadBlockchainData(); // Load contract after account is set
        }
    }, [account]);

    return (
        <Router>
            <div className="App">
                <Navigation />
                <Routes>
                    <Route path="/" element={<Dashboard contract={contract} />} />
                    <Route path="/register-candidate" element={<CandidateRegistration contract={contract} />} />
                    <Route path="/register-voter" element={<VoterRegistration contract={contract} />} />
                    <Route path="/voting" element={<Voting contract={contract} account={account} />} />
                    <Route path="/results" element={<Results contract={contract} />} />
                    {/* Only show AdminPanel if the user is the hardcoded admin */}
                    <Route path="/admin" element={isAdmin ? <AdminPanel contract={contract} account={account} /> : <h2>Access Denied: You are not the admin.</h2>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
