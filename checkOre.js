const { spawnSync } = require("child_process");
const fs = require("fs")

const PATH = "/root/.config/solana/";

const getRewardsTable = async () => {
  try {
    const ListOfKeys = fs
      .readdirSync(PATH, { withFileTypes: true })
      .filter((item) => item.isFile() && item.name.endsWith(".json"))
      .map((item) => `${PATH}/${item.name}`);
    console.log(ListOfKeys);

    if (ListOfKeys.length === 0)
      throw new Error("No private keys found. Recheck your keys path.");

    const getData = ListOfKeys.map((keys) => {
      return new Promise((resolve, reject) => {
        const getAddress = spawnSync("solana", ["address", "-k", keys]);
        const getBalance = spawnSync("ore", ["--keypair", keys, "rewards"]);

        // Check if stdout exists before calling toString() and trim()
        if (getAddress.error || getBalance.error) {
          resolve({
            Address: getAddress.error
              ? "Solana Cli not found"
              : (getAddress.stdout && getAddress.stdout.toString().trim()) || "Invalid",
            Balance: getBalance.error
              ? "Ore Cli not found"
              : (getBalance.stdout && getBalance.stdout.toString().trim()) || "0",
          });
        } else {
          resolve({
            Address: getAddress.stdout ? getAddress.stdout.toString().trim() : "Invalid",
            Balance: getBalance.stdout ? getBalance.stdout.toString().trim() : "0",
          });
        }
      });
    });

    const signatures = await Promise.all(getData);
    console.table(signatures);
  } catch (err) {
    console.log("Error", err);
  }
};

getRewardsTable();
