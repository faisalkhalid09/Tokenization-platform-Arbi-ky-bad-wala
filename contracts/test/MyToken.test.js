const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let MyToken, token, owner, addr1, addr2, addrs;
  
  const TOKEN_NAME = "Test Token";
  const TOKEN_SYMBOL = "TEST";
  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 18); // 1 million tokens

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    // Deploy contract
    MyToken = await ethers.getContractFactory("MyToken");
    token = await MyToken.deploy(TOKEN_NAME, TOKEN_SYMBOL, 1000000); // Deploy with 1M initial supply
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      expect(await token.name()).to.equal(TOKEN_NAME);
    });

    it("Should set the right symbol", async function () {
      expect(await token.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Should set the right decimals", async function () {
      expect(await token.decimals()).to.equal(18);
    });

    it("Should assign the total supply to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint tokens to specified address", async function () {
      const mintAmount = ethers.parseUnits("1000", 18);
      const initialBalance = await token.balanceOf(addr1.address);
      
      await token.mint(addr1.address, 1000); // Mint 1000 tokens
      
      const newBalance = await token.balanceOf(addr1.address);
      expect(newBalance).to.equal(initialBalance + mintAmount);
    });

    it("Should increase total supply when minting", async function () {
      const initialSupply = await token.totalSupply();
      const mintAmount = ethers.parseUnits("1000", 18);
      
      await token.mint(addr1.address, 1000);
      
      const newSupply = await token.totalSupply();
      expect(newSupply).to.equal(initialSupply + mintAmount);
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        token.connect(addr1).mint(addr2.address, 1000)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("Should emit Transfer event when minting", async function () {
      await expect(token.mint(addr1.address, 1000))
        .to.emit(token, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, ethers.parseUnits("1000", 18));
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      // Transfer some tokens to addr1 for burning tests
      await token.transfer(addr1.address, ethers.parseUnits("10000", 18));
    });

    it("Should burn tokens from caller's balance", async function () {
      const burnAmount = ethers.parseUnits("5000", 18);
      const initialBalance = await token.balanceOf(addr1.address);
      
      await token.connect(addr1).burn(burnAmount);
      
      const newBalance = await token.balanceOf(addr1.address);
      expect(newBalance).to.equal(initialBalance - burnAmount);
    });

    it("Should decrease total supply when burning", async function () {
      const burnAmount = ethers.parseUnits("5000", 18);
      const initialSupply = await token.totalSupply();
      
      await token.connect(addr1).burn(burnAmount);
      
      const newSupply = await token.totalSupply();
      expect(newSupply).to.equal(initialSupply - burnAmount);
    });

    it("Should fail to burn more than balance", async function () {
      const userBalance = await token.balanceOf(addr1.address);
      const burnAmount = userBalance + ethers.parseUnits("1", 18);
      
      await expect(
        token.connect(addr1).burn(burnAmount)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });

    it("Should emit Transfer event when burning", async function () {
      const burnAmount = ethers.parseUnits("5000", 18);
      
      await expect(token.connect(addr1).burn(burnAmount))
        .to.emit(token, "Transfer")
        .withArgs(addr1.address, ethers.ZeroAddress, burnAmount);
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      // Transfer some tokens to addr1 for transfer tests
      await token.transfer(addr1.address, ethers.parseUnits("10000", 18));
    });

    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("1000", 18);
      const initialBalance1 = await token.balanceOf(addr1.address);
      const initialBalance2 = await token.balanceOf(addr2.address);
      
      await token.connect(addr1).transfer(addr2.address, transferAmount);
      
      const newBalance1 = await token.balanceOf(addr1.address);
      const newBalance2 = await token.balanceOf(addr2.address);
      
      expect(newBalance1).to.equal(initialBalance1 - transferAmount);
      expect(newBalance2).to.equal(initialBalance2 + transferAmount);
    });

    it("Should fail to transfer more than balance", async function () {
      const userBalance = await token.balanceOf(addr1.address);
      const transferAmount = userBalance + ethers.parseUnits("1", 18);
      
      await expect(
        token.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });

    it("Should fail to transfer to zero address", async function () {
      await expect(
        token.connect(addr1).transfer(ethers.ZeroAddress, ethers.parseUnits("1000", 18))
      ).to.be.revertedWithCustomError(token, "ERC20InvalidReceiver");
    });

    it("Should emit Transfer event", async function () {
      const transferAmount = ethers.parseUnits("1000", 18);
      
      await expect(token.connect(addr1).transfer(addr2.address, transferAmount))
        .to.emit(token, "Transfer")
        .withArgs(addr1.address, addr2.address, transferAmount);
    });
  });

  describe("Batch Transfer", function () {
    beforeEach(async function () {
      // Transfer tokens to owner for batch transfer tests
      await token.mint(owner.address, 100000); // Mint additional tokens for testing
    });

    it("Should transfer tokens to multiple recipients", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [ethers.parseUnits("1000", 18), ethers.parseUnits("2000", 18)];
      
      const initialBalance1 = await token.balanceOf(addr1.address);
      const initialBalance2 = await token.balanceOf(addr2.address);
      
      await token.batchTransfer(recipients, amounts);
      
      const newBalance1 = await token.balanceOf(addr1.address);
      const newBalance2 = await token.balanceOf(addr2.address);
      
      expect(newBalance1).to.equal(initialBalance1 + amounts[0]);
      expect(newBalance2).to.equal(initialBalance2 + amounts[1]);
    });

    it("Should fail with mismatched array lengths", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [ethers.parseUnits("1000", 18)]; // Only one amount for two recipients
      
      await expect(
        token.batchTransfer(recipients, amounts)
      ).to.be.revertedWith("MyToken: recipients and amounts length mismatch");
    });

    it("Should fail if insufficient balance for batch transfer", async function () {
      const recipients = [addr1.address, addr2.address];
      const totalBalance = await token.balanceOf(owner.address);
      const amounts = [totalBalance / 2n + ethers.parseUnits("1", 18), totalBalance / 2n + ethers.parseUnits("1", 18)];
      
      await expect(
        token.batchTransfer(recipients, amounts)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await token.transferOwnership(addr1.address);
      expect(await token.owner()).to.equal(addr1.address);
    });

    it("Should allow new owner to mint", async function () {
      await token.transferOwnership(addr1.address);
      
      await expect(token.connect(addr1).mint(addr2.address, 1000))
        .to.not.be.reverted;
    });

    it("Should prevent old owner from minting after ownership transfer", async function () {
      await token.transferOwnership(addr1.address);
      
      await expect(token.mint(addr2.address, 1000))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("Should only allow current owner to transfer ownership", async function () {
      await expect(
        token.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amount transfers", async function () {
      await expect(token.transfer(addr1.address, 0))
        .to.not.be.reverted;
    });

    it("Should handle zero amount minting", async function () {
      await expect(token.mint(addr1.address, 0))
        .to.not.be.reverted;
    });

    it("Should handle zero amount burning", async function () {
      await expect(token.burn(0))
        .to.not.be.reverted;
    });

    it("Should handle empty batch transfer", async function () {
      await expect(token.batchTransfer([], []))
        .to.not.be.reverted;
    });
  });
});
