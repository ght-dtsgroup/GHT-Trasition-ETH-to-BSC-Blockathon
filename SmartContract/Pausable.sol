import "./Ownable.sol";
/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
contract Pausable is Ownable {
    bool private _paused;

    address private _pauser;
    
    /**
     * @dev Emitted when the pause is triggered by a pauser (`account`).
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by a pauser (`account`).
     */
    event Unpaused(address account);

    /**
     * @dev Emitted when the pauser is transferred by a owner.
     */
    event PauserTransferred(address indexed previousPauser, address indexed newPauser);

    /**
     * @dev Initializes the contract setting the deployer as the initial pauser.
     * 
     * @dev Initializes the contract in unpaused state. Assigns the Pauser role
     * to the deployer.
     */
    constructor (address pauser) internal {
        _pauser = pauser;
        _paused = false;
        emit PauserTransferred(address(0), pauser);
    }

    /**
     * @dev Returns the address of the current pauser.
     */
    function pauser() public view returns (address) {
        return _pauser;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyPauser() {
        require(isPauser(), "Pausable: caller is not the pauser");
        _;
    }

    /**
     * @dev Returns true if the caller is the current pauser.
     */
    function isPauser() public view returns (bool) {
        return _msgSender() == _pauser;
    }

    /**
     * @dev Transfers pauser of the contract to a new account (`newPauser`).
     * Can only be called by the current owner.
     */
    function setNewPauser(address newPauser) public virtual onlyOwner {
        _transferPauser(newPauser);
    }

    /**
     * @dev Transfers pauser of the contract to a new account (`newPauser`).
     */
    function _transferPauser(address newPauser) internal virtual {
        require(newPauser != address(0), "Pausable: new pauser is the zero address");
        emit PauserTransferred(_pauser, newPauser);
        _pauser = newPauser;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view returns (bool) {
        return _paused;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     */
    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     */
    modifier whenPaused() {
        require(_paused, "Pausable: not paused");
        _;
    }

    /**
     * @dev Called by a pauser to pause, triggers stopped state.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}