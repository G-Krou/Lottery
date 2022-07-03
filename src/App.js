import { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import web3 from './web3';
import lottery from './lottery';

function App() {
  const [currentAccount, setCurrentAccount] = useState();
  const [ownersAccount, setOwnersAccount] = useState();
  const [carTokens, setcarTokens] = useState();
  const [phoneTokens, setphoneTokens] = useState();
  const [computerTokens, setcomputerTokens] = useState();
  const [itemsWon, setItemsWon] = useState();
  const [contractBalance, setContractBalance] = useState();

  async function getOwnersAccount() {
    const owner = await lottery.methods.beneficiary().call();
    setOwnersAccount(owner);
  }
  useEffect(() => {
    window.ethereum.on("accountsChanged", accounts => setCurrentAccount(accounts[0]));
    getOwnersAccount();
    getContractBalance();
    setInterval(()=>{
      getContractBalance();
      revealHandler();
    },200)
  }, [])
  async function getCurrentAccount() {
    const accounts = await web3.eth.getAccounts();
    setCurrentAccount(accounts[0]);
  }
  useEffect(() => {
    getCurrentAccount();
  }, [currentAccount]);

  const bidHandler = async (id) => {
    await lottery.methods.bid(id).send({ from: currentAccount, value: web3.utils.toWei('0.01', 'ether') });
  }

  const revealHandler = async () => {
    const tokens = await lottery.methods.getTokens().call();
    setcarTokens(tokens[0]);
    setphoneTokens(tokens[1]);
    setcomputerTokens(tokens[2]);
    getContractBalance();
  }

  const withdrawHandler = async() => {
    await lottery.methods.withdraw().send({from:currentAccount});
  }

  const declarationHandler = async() => {
    await lottery.methods.revealWinners().send({from:currentAccount});
  }

  const amIWinnerHandler = async() => {
    const itemsWon = await lottery.methods.itemsWon().call({from:currentAccount});
    setItemsWon(itemsWon);
  }

  const resetHandler = async() => {
    await lottery.methods.reset().send({from:currentAccount});
    setItemsWon();
  }

  async function getContractBalance(){
    const balance = await web3.eth.getBalance(lottery.options.address);
    setContractBalance(web3.utils.fromWei(balance,'ether'));
  }
  return (
    <div className="App d-flex flex-column p-5 container-xl">
      <header className="border-bottom">
        <h1>Lottery-Ballot</h1>

      </header>
      <label>{contractBalance} Ether</label>
      <div className="d-flex flex-row mt-5 gap-3">
        <div className='card col'>
          <div className='card-header'>
            <h3>Car</h3>
          </div>
          <div className='card-body'>
            <img src="2022auc290001_640_01.jpg" width="300" height="300" alt='car'></img>
            <div className='d-flex justify-content-between mt-auto'>
              <button className='btn btn-outline-secondary right-align' onClick={() => bidHandler(0)}>Bid</button>
              <h3>{carTokens}</h3>
            </div>

          </div>
        </div>
        <div className='card col'>
          <div className='card-header'>
            <h3>Phone</h3>
          </div>
          <div className='card-body'>
            <img src="9520103_R_SET.jpg" width="300" height="300" alt='Phone'></img>
            <div className='d-flex justify-content-between mt-auto'>
              <button className='btn btn-outline-secondary right-align' onClick={() => bidHandler(1)}>Bid</button>
              <h3>{phoneTokens}</h3>
            </div>

          </div>
        </div>
        <div className='card col'>
          <div className='card-header'>
            <h3>Computer</h3>
          </div>
          <div className='card-body'>
            <img src="k2-_fe35a111-e1fa-491f-9732-fc1bfd90794f.v1.jpg" width="300" height="300" alt='computer'></img>
            <div className='d-flex justify-content-between mt-auto'>
              <button className='btn btn-outline-secondary right-align' onClick={() => bidHandler(2)}>Bid</button>
              <h3>{computerTokens}</h3>
            </div>

          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between mt-4 gap-3'>
        <div className='d-flex flex-column gap-2'>
          <span className='me-auto'>
            Current account:
          </span>
          <span className='mb-4 border border-1 border-dark rounded px2'>
            {currentAccount}
          </span>
        </div>
        <div className='d-flex flex-column gap-2'>
          <span className='me-auto'>
            Owner's account:
          </span>
          <span className='mb-4 border border-1 border-dark rounded px2'>
            {ownersAccount}
          </span>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="col d-flex justify-content-start py-1"><button type="button" class="btn btn-primary" style={{ width: "150px" }} onClick = {()=>revealHandler()}>Reveal</button></div>
          <div class="col d-flex justify-content-end py-1"><button type="button" class="btn btn-success" style={{ width: "150px" }} onClick = {()=>withdrawHandler()}>Withdraw</button></div>
          <div class="w-100"></div>
          <div class="col d-flex justify-content-start py-1"><button type="button" class="btn btn-primary" style={{ width: "150px" }} onClick = {amIWinnerHandler}>Am I Winner</button></div>
          <div class="col d-flex justify-content-end py-1"><button type="button" class="btn btn-success" style={{ width: "150px" }} onClick = {()=>declarationHandler()}>Declare Winners</button></div>
          <div class="w-100"></div>
          <div class="col d-flex justify-content-start py-1">
            {itemsWon && itemsWon.length>0?(
              <label>Congratulations, you have won item{itemsWon.length>1 &&(<label>s</label>)}{" "}{itemsWon.toString()}</label>
            ):(itemsWon && (
              <label>0 items</label>
            ))}
          </div>
          <div class="col d-flex justify-content-end py-1"><button type="button" class="btn btn-danger" style={{ width: "150px" }} onClick = {()=>resetHandler()}>Reset</button></div>
          <div class="w-100"></div>
          <div class="col d-flex justify-content-end py-1"><button type="button" class="btn btn-danger" style={{ width: "150px" }}>Destroy Contract</button></div>
          <div class="w-100"></div>
          <div class="col d-flex justify-content-end py-1"><button type="button" class="btn btn-danger" style={{ width: "150px" }}>Change Owner</button></div>
        </div>
      </div>
    </div>
  );
}

export default App;
