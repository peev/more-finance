export async function stake(amnt) {
  console.log("STAKE");
  try {
    const amount = this.$ethers.utils.parseEther(amnt);

    console.log("AMOUNT", amount.toString());

    const estimateGas = await this.sSpellTokenObject.mainToken.contractInstance.estimateGas.mint(
      amount
    );

    const gasLimit = 1000 + +estimateGas.toString();

    console.log("gasLimit:", gasLimit);

    const tx = await this.sSpellTokenObject.mainToken.contractInstance.mint(
      amount,
      {
        gasLimit,
      }
    );

    const receipt = await tx.wait();

    console.log("stake", receipt);
  } catch (e) {
    console.log("stake err:", e);
  }
}

export async function unstake(amnt) {
  console.log("UNSTAKE");
  try {
    const amount = this.$ethers.utils.parseEther(amnt);

    console.log("AMOUNT", amount.toString());

    const estimateGas = await this.sSpellTokenObject.mainToken.contractInstance.estimateGas.burn(
      this.account,
      amount
    );

    const gasLimit = 1000 + +estimateGas.toString();

    console.log("gasLimit:", gasLimit);

    const tx = await this.sSpellTokenObject.mainToken.contractInstance.burn(
      this.account,
      amount,
      {
        gasLimit,
      }
    );

    const receipt = await tx.wait();

    console.log("stake", receipt);
  } catch (e) {
    console.log("stake err:", e);
  }
}