pragma solidity ^0.8.28;

/*
Características Clave de Seguridad:
1. Patrón Pull-Payment: Separa la lógica de desapostar y retirar para prevenir DoS.
2. Eventos Detallados:
    Staked: Al hacer un depósito.
    Unstaked: Al iniciar el retiro de fondos.
    Withdrawn: Al completar el retiro.
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

contract StakingContractBetter {
    uint256 public totalStaked;
    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public withdrawable;

    // Eventos para tracking de actividades
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    // Bloquea depósitos directos vía receive
    receive() external payable {
        require(msg.sender == address(this), "Direct deposits not allowed");
    }

    function stake(uint256 amount) public payable {
        require(amount > 0, "Amount must be greater than 0");
        require(msg.value == amount, "Incorrect ETH amount");

        totalStaked += amount;
        stakedBalances[msg.sender] += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= stakedBalances[msg.sender], "Insufficient balance");

        totalStaked -= amount;
        stakedBalances[msg.sender] -= amount;
        withdrawable[msg.sender] += amount;

        emit Unstaked(msg.sender, amount);
    }

    function withdraw() public {
        uint256 amount = withdrawable[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        withdrawable[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed transfer");

        emit Withdrawn(msg.sender, amount);
    }

    // Función adicional de emergencia (opcional)
    function emergencyStop() external {
        // Lógica para pausar operaciones en emergencias
        // Requiere configuración de permisos (owner/DAO)
    }
}