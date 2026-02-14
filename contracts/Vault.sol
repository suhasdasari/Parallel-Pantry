// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ParallelPantryVault
 * @notice Vault contract for accepting pathUSD donations and enabling AI agent withdrawals
 * @dev Designed for Tempo L1 blockchain with pathUSD token
 */
contract ParallelPantryVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // pathUSD token address on Tempo network
    IERC20 public immutable pathUSD;
    
    // Authorized AI agent address that can withdraw funds
    address public aiAgent;
    
    // Total amount deposited
    uint256 public totalDeposited;
    
    // Total amount withdrawn
    uint256 public totalWithdrawn;
    
    // Mapping of donor addresses to their total contributions
    mapping(address => uint256) public donations;
    
    // Events
    event Deposited(address indexed donor, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed recipient, uint256 amount, address indexed aiAgent, uint256 timestamp);
    event AIAgentUpdated(address indexed oldAgent, address indexed newAgent);
    
    /**
     * @notice Constructor
     * @param _pathUSD Address of pathUSD token on Tempo
     * @param _aiAgent Initial AI agent address authorized to withdraw
     */
    constructor(address _pathUSD, address _aiAgent) Ownable(msg.sender) {
        require(_pathUSD != address(0), "Invalid pathUSD address");
        require(_aiAgent != address(0), "Invalid AI agent address");
        
        pathUSD = IERC20(_pathUSD);
        aiAgent = _aiAgent;
    }
    
    /**
     * @notice Deposit pathUSD into the vault
     * @param amount Amount of pathUSD to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer pathUSD from donor to vault
        pathUSD.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update state
        donations[msg.sender] += amount;
        totalDeposited += amount;
        
        emit Deposited(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @notice Withdraw funds to a verified recipient (AI agent only)
     * @param recipient Address of the verified recipient
     * @param amount Amount to withdraw
     */
    function withdraw(address recipient, uint256 amount) external nonReentrant {
        require(msg.sender == aiAgent, "Only AI agent can withdraw");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        require(getBalance() >= amount, "Insufficient balance");
        
        // Transfer pathUSD to recipient
        pathUSD.safeTransfer(recipient, amount);
        
        // Update state
        totalWithdrawn += amount;
        
        emit Withdrawn(recipient, amount, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Update the AI agent address
     * @param newAgent New AI agent address
     */
    function updateAIAgent(address newAgent) external onlyOwner {
        require(newAgent != address(0), "Invalid AI agent address");
        require(newAgent != aiAgent, "Same as current AI agent");
        
        address oldAgent = aiAgent;
        aiAgent = newAgent;
        
        emit AIAgentUpdated(oldAgent, newAgent);
    }
    
    /**
     * @notice Get current vault balance
     * @return Current pathUSD balance in the vault
     */
    function getBalance() public view returns (uint256) {
        return pathUSD.balanceOf(address(this));
    }
    
    /**
     * @notice Get donor's total contribution
     * @param donor Address of the donor
     * @return Total amount donated by the donor
     */
    function getDonorContribution(address donor) external view returns (uint256) {
        return donations[donor];
    }
    
    /**
     * @notice Get vault statistics
     * @return balance Current vault balance
     * @return deposited Total amount deposited
     * @return withdrawn Total amount withdrawn
     */
    function getStats() external view returns (
        uint256 balance,
        uint256 deposited,
        uint256 withdrawn
    ) {
        return (getBalance(), totalDeposited, totalWithdrawn);
    }
}
