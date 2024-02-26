import {ethers} from "hardhat";

let helpers: {
    // setCode: (address: string, code: string) => Promise<void>;
    // SnapshotRestorer: SnapshotRestorer;
    // setNextBlockBaseFeePerGas: (baseFeePerGas: NumberLike) => Promise<void>;
    // reset: (url?: string, blockNumber?: NumberLike) => Promise<void>;
    impersonateAccount: (address: string) => Promise<void>;
    // takeSnapshot: () => Promise<SnapshotRestorer>;
    // setPrevRandao: (prevRandao: NumberLike) => Promise<void>;
    // setCoinbase: (address: string) => Promise<void>;
    // mine: (blocks?: NumberLike, options?: { interval?: NumberLike }) => Promise<void>;
    // setStorageAt: (address: string, index: NumberLike, value: NumberLike) => Promise<void>;
    // setNonce: (address: string, nonce: NumberLike) => Promise<void>;
    // setBalance: (address: string, balance: NumberLike) => Promise<void>;
    // time: {
    //     advanceBlock: (numberOfBlocks?: NumberLike) => Promise<number>;
    //     increaseTo: (timestamp: (NumberLike | Date)) => Promise<void>;
    //     latest: () => Promise<number>;
    //     advanceBlockTo: (blockNumber: NumberLike) => Promise<void>;
    //     setNextBlockTimestamp: (timestamp: (NumberLike | Date)) => Promise<void>;
    //     duration: {
    //         seconds: (n: number) => number;
    //         years: (n: number) => number;
    //         millis: (n: number) => number;
    //         weeks: (n: number) => number;
    //         hours: (n: number) => number;
    //         minutes: (n: number) => number;
    //         days: (n: number) => number
    //     } | duration;
    //     increase: (amountInSeconds: NumberLike) => Promise<number>;
    //     latestBlock: () => Promise<number>
    // } | time;
    // dropTransaction: (txHash: string) => Promise<boolean>;
    // setBlockGasLimit: (blockGasLimit: NumberLike) => Promise<void>;
    // stopImpersonatingAccount: (address: string) => Promise<void>;
    // mineUpTo: (blockNumber: NumberLike) => Promise<void>;
    // getStorageAt: (address: string, index: NumberLike, block?: (NumberLike | BlockTag)) => Promise<string>;
    // loadFixture<T>(fixture: Fixture<T>): Promise<T>
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

    const first = ethers.parseUnits("100", 18);
    const second = ethers.parseUnits("100", 6);

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