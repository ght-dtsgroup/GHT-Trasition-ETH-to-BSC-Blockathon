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
    event WithdrawGHT(address indexed account, uint256 amount);
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
    function withdrawGHT(uint256 amount, address user) public onlyOwner whenNotPaused {
        require(_whiteListAddress[user]);
        require(_GHTAmount[user] > amount);
        
        GHT.transfer(user,amount);
        _GHTAmount[user] = _GHTAmount[user].sub(amount);
        
        emit WithdrawGHT(user, amount);
    }
    
    /**
     * @dev Decrease GHT in wallet cz used.
     */
    function decreaseGHTAmount(uint256 amount, address user) public onlyOwner whenNotPaused {
        _GHTAmount[user] = _GHTAmount[user].sub(amount);
        assert(_GHTAmount[user]>=0);
        emit DecreaseGHTAmount(user, amount);
    }
    
    /**
     * @dev Set the user's address to lock or unlock.
     */
    function setWhiteListAddress(address account, bool flag) public onlyOwner {
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
}