


import { ethers } from "hardhat";

const readOnly = async() =>{
    const swapper = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const iSwap = await ethers.getContractAt("IUniSwap", swapper);

    const result = await iSwap.WETH();

    console.log(`get it ${result}`);
}


readOnly().catch((error)=>{
    console.log(error);
    process.exitCode=1;
})