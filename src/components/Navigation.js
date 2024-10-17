import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Panel Principal</Link></li>
                <li><Link to="/register-candidate">Registrar Candidato</Link></li>
                <li><Link to="/register-voter">Registrar Votante</Link></li>
                <li><Link to="/voting">Votación</Link></li>
                <li><Link to="/results">Resultados</Link></li>
                <li><Link to="/admin">Panel de Administración</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation;