// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev ERC20 token with minting, burning, and ownership capabilities
 * 
 * This contract implements a standard ERC20 token with additional features:
 * - Minting capability restricted to the contract owner
 * - Burning capability available to all token holders
 * - Ownership transfer capability
 */
contract MyToken is ERC20, ERC20Burnable, Ownable {
    
    /**
     * @dev Constructor that creates the initial token supply
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token  
     * @param initialSupply_ The initial supply in whole tokens (automatically converted to wei)
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        // Mint initial supply to the deployer
        // Convert to wei by multiplying by 10^decimals
        _mint(msg.sender, initialSupply_ * 10**decimals());
    }

    /**
     * @dev Mints new tokens to a specified address
     * @param to The address to receive the minted tokens
     * @param amount The amount of tokens to mint (in whole tokens, automatically converted to wei)
     * 
     * Requirements:
     * - Only the contract owner can call this function
     * - The `to` address cannot be the zero address
     */
    function mint(address to, uint256 amount) external onlyOwner {
        // Convert amount to wei by multiplying by 10^decimals
        _mint(to, amount * 10**decimals());
    }

    /**
     * @dev Returns the number of decimals used for token amounts
     * @return The number of decimals (18 by default for ERC20)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }

    /**
     * @dev Batch transfer tokens to multiple recipients
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to transfer (in wei)
     * 
     * Requirements:
     * - Arrays must have the same length
     * - Caller must have sufficient balance for all transfers
     */
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external {
        require(recipients.length == amounts.length, "MyToken: recipients and amounts length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(msg.sender, recipients[i], amounts[i]);
        }
    }
}
