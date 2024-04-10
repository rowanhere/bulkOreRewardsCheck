import { spawnSync  } from "child_process";
import fs from "fs";

const PATH = "/root/.config/solana/";

const getRewardsTable = async () => {
  try {
 
    const ListOfKeys = fs
      .readdirSync(PATH, { withFileTypes: true })
      .filter((item) => item.isFile() && item.name.endsWith(".json"))
      .map((item) => `${item.path}/${item.name}`);
     console.log(ListOfKeys);
    if (!(ListOfKeys.length > 0))
      throw new Error("No private keys found. Recheck your keys path.");

    const getData = ListOfKeys.map((keys) => {
      return new Promise((resolve, reject) => {
        const getAddress = spawnSync("solana", ["address", "-k", keys]);
        const getBalance = spawnSync("ore", ["--keypair", keys, "rewards"]);
      
       resolve(
        {
            Address:getAddress.error?"Solana Cli not found":getAddress.stdout?.toString().trim() || "Invalid",
            Balance :getBalance.error?"Ore Cli not found": getBalance.stdout?.toString().trim() || "0"
        }
       )
      });
    });
    const signatures = await Promise.all(getData);
    console.table(signatures);
  } catch (err) {
    console.log("Error", err);
  }
};

getRewardsTable();
