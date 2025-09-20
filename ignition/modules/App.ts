import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import LockModule from "./Lock";
import StakingModule from "./Staking";

export default buildModule("AppModule", (m) => {
    // Importamos los submódulos
    const { lock } = m.useModule(LockModule);
    const { stakingContract } = m.useModule(StakingModule);

    // Aquí podrías crear dependencias, por ejemplo:
    // m.call(stakingContract, "setLockContract", [lock]);

    return { lock, stakingContract };
});
