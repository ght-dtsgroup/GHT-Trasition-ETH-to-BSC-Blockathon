import "./Ownable.sol";
import "./SafeMath.sol";

pragma solidity >=0.6.0 <0.7.0;

contract GHTVerificationService is Pausable {
    using SafeMath for uint256;
    mapping (address => bool) private _whiteListAddress;
    mapping (address => uint256) private _GHTAmount;
    
    IERC20 GHT;
    /**
     * @dev Emitted when the user's address is locked or unlocked by a owner (`account`).
     */
    event SetWhiteListAddress(address indexed account, bool flag);
    event DepositGHT(address indexed account, uint256 amount);
    event GHTWithdrawalConfirmation(address indexed account, address indexed to, uint256 amount);
    event DecreaseGHTAmount(address indexed account, uint256 amount);
    
    constructor(address pauser, address _ght) public Pausable(pauser){
        address msgSender = _msgSender();
        setWhiteListAddress(msgSender,true);
        GHT = IERC20(_ght);
    }
    
     /**
     * @dev Returns GHT amount of `account` sent to contract.
     */
    function getGHTAmount(address account) public view returns (uint256) {
        return _GHTAmount[account];
    }
    
    /**
     * @dev User deposit to Wallet.
     */
    function depositGHT(uint256 amount, address user) public whenNotPaused {
        GHT.transferFrom(user,address(this),amount);
        _GHTAmount[user] = _GHTAmount[user].add(amount);
        
        emit DepositGHT(user, amount);
    }
    
    /**
     * @dev User withdraw GHT from Wallet.
     */
    function confirmedGHTWithdrawal(uint256 amount, address whitelistAddress, address to, uint256 update) public onlyMod whenNotPaused {
        //require(_whiteListAddress[user]);
        //require(_GHTAmount[whitelistAddress] >= amount);
        
        if(update!=0)
            _GHTAmount[whitelistAddress] = update;
        
        GHT.transfer(to,amount);
        _GHTAmount[whitelistAddress] = _GHTAmount[whitelistAddress].sub(amount);
        
        assert(_GHTAmount[whitelistAddress]>=0);
        
        emit GHTWithdrawalConfirmation(whitelistAddress, to, amount);
    }
    
    /**
     * @dev Decrease GHT in wallet cz used.
     */
    function decreaseGHTAmount(uint256 amount, address user) public onlyMod whenNotPaused {
        _GHTAmount[user] = _GHTAmount[user].sub(amount);
        assert(_GHTAmount[user]>=0);
        emit DecreaseGHTAmount(user, amount);
    }
    
    /**
     * @dev Set the user's address to lock or unlock.
     */
    function setWhiteListAddress(address account, bool flag) public onlyMod {
        _setWhiteListAddress(account, flag);
        emit SetWhiteListAddress(account, flag);
    }
    
    /**
     * @dev Returns the state `account`.
     */
    function getWhiteListAddress(address account) public view returns (bool) {
        return _whiteListAddress[account];
    }
    
    /**
     * @dev Set the user's address to lock or unlock.
     */
    function _setWhiteListAddress(address account, bool flag) internal {
        _whiteListAddress[account] = flag;
    }
    
    /**
     * @dev Pausese contract.
     *
     * See {Pausable-_pause}.
     */
    function pauseContract() public virtual onlyPauser {
        _pause();
    }
    
    /**
     * @dev Unpauses contract.
     *
     * See {Pausable-_unpause}.
     */
    function unpauseContract() public virtual onlyPauser {
        _unpause();
    }
}
