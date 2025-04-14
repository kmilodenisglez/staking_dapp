pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
/*
Pasos:
    npm install @openzeppelin/contracts

Características Clave de Seguridad:
1. Patrón Pull-Payment: Separa la lógica de desapostar y retirar para prevenir DoS.
2. Eventos Detallados:
    Staked: Al hacer un depósito.
    Unstaked: Al iniciar el retiro de fondos.
    Withdrawn: Al completar el retiro. nonReentrant bloquea llamadas recursivas. Se restringe el gas para operaciones externas. Si el call falla, restaura el balance retirable
3. Protección contra Depósitos Directos: Bloquea ETH enviado fuera del método stake().
4. Manejo Seguro de ETH: Usa call en vez de transfer para evitar límites de gas.
5. Chequeos de Seguridad:
    Validación de cantidades positivas.
    Verificación de balances antes de operaciones.
    Requerimientos explícitos con mensajes de error.

Recomendaciones Adicionales:
- Chequeo de Balance: Verificar address(this).balance >= totalStaked en unstake.
- Whitelist de Contratos: Permitir desapostar solo a EOAs (cuentas externas) si es necesario.
- Bibliotecas Seguras: Usar OpenZeppelin para estructuras complejas (aunque en 0.8+ no es necesario para overflows).
- Control de Acceso: Añadir Ownable para funciones administrativas.
- Pausas: Implementar circuito de emergencia con OpenZeppelin Pausable.
- Slashing: Si es un contrato de staking con penalizaciones, añadir lógica con votación.
- Límites: Establecer montos mínimos/máximos de stake según necesidades.
*/

contract StakingContractBetterWithZeppelin is ReentrancyGuard {
    uint256 public totalStaked;
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public withdrawable;

    // Eventos para tracking de actividades
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    // Bloquea depósitos directos vía receive
    receive() external payable {
        require(msg.sender == address(this), "Depositos directos no permitidos");
    }

    function stake(uint256 amount) public payable {
        require(amount > 0, "Cantidad debe ser mayor a 0");
        require(msg.value == amount, "Monto ETH incorrecto");

        totalStaked += amount;
        stakedBalances[msg.sender] += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) public {
        require(amount > 0, "Cantidad debe ser mayor a 0");
        require(amount <= stakedBalances[msg.sender], "Saldo insuficiente");

        totalStaked -= amount;
        stakedBalances[msg.sender] -= amount;
        withdrawable[msg.sender] += amount;

        emit Unstaked(msg.sender, amount);
    }

    function withdraw() public nonReentrant {
        uint256 amount = withdrawable[msg.sender];
        require(amount > 0, "Nada para retirar");

        // Update state before external call (Checks-Effects-Interactions pattern)
        withdrawable[msg.sender] = 0;

        // External call after state updates
        (bool success, ) = msg.sender.call{
            value: amount,
            gas: 30_000   // Limita el gas para prevenir griefing
        }("");

        // Revert if transfer fails, but don't update state
        require(success, "Transferencia fallida");

        emit Withdrawn(msg.sender, amount);
    }

    // Función adicional de emergencia (opcional)
    function emergencyStop() external {
        // Lógica para pausar operaciones en emergencias
        // Requiere configuración de permisos (owner/DAO)
    }
}