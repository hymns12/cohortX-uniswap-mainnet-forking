import {ethers} from "hardhat";

let helpers: {
    
    impersonateAccount: (address: string) => Promise<void>;
   
};
helpers = require("@nomicfoundation/hardhat-network-helpers");

const main = async () => {
    const Holder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    await helpers.impersonateAccount(Holder);
    const impersonator = await ethers.getSigner(Holder);

    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const tetherAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const swapper = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const dai = await ethers.getContractAt("IERC20", daiAddress);
    const tether = await ethers.getContractAt("IERC20", tetherAddress);
    const uniSwap = await ethers.getContractAt("IUniSwap", swapper);
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    const first = ethers.parseUnits("2000", 18);
    const second = ethers.parseUnits("2000", 6);

    await dai.connect(impersonator).approve(swapper, first);
    await tether.connect(impersonator).approve(swapper, second);

    const daiBefore = await dai.balanceOf(impersonator.address);
    const tetherBefore = await tether.balanceOf(impersonator.address);


    console.log("---------------------------------------------")

    console.log("before dai:::", daiBefore);

    console.log("---------------------------------------------")

    console.log("before tether:::", tetherBefore);

    console.log("---------------------------------------------")

    const liquidityResponse = await uniSwap.connect(impersonator).addLiquidity(
        daiAddress,
        tetherAddress,
        first,
        second,
        0,
        0,
        swapper,
        deadline
    );

    const daiAfter = await dai.balanceOf(impersonator.address);
    const tetherAfter = await tether.balanceOf(impersonator.address);

    console.log("---------------------------------------------")

    console.log("after dai:::", daiAfter);

    console.log("---------------------------------------------")

    
    console.log("after tether:::", tetherAfter);

}

main().catch((error) => {
    console.log(error);
    process.exitCode = 2;
});