import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import Web3 from 'web3'
import {GridList, GridTile} from 'material-ui/GridList';
import * as WebRequest from 'web-request';
import * as abiDecoder from 'abi-decoder'; // NodeJS
import * as txDecoder from 'ethereum-tx-decoder';

const BigNumber = window.web3.BigNumber;

var o = function(e, t) {
  return null == e ? 0 : new BigNumber(e.toString()).shiftedBy(t).toString()
};

function prepareOrderParams2(whichExchange, ordersOpen) {
  console.log("HEY");
  var n = "0x0000000000000000000000000000000000000000",
      _exchanges = [],
      orderAddresses = [],
      orderValues = [],
      exchangeFees = [],
      vECDSA = [],
      rECDSA = [],
      sECDSA = [];

  console.log("ordersOpen", ordersOpen);

  for (var idx = 0; idx < ordersOpen.length; idx++) {
      var currentOrder = ordersOpen[idx];
      console.log("currentOrder", currentOrder);

      _exchanges[idx] = currentOrder.exchange;
      //exchangeFees[idx] = new BigNumber(o(currentOrder.feePercentage, 18));
      exchangeFees[idx] = new BigNumber(1);
      console.log("YOOOO");

      if( currentOrder.exchange === 0) { // Etherdelta
          orderAddresses[idx] = [
                  currentOrder.user,
                  currentOrder.tokenGive,
                  currentOrder.tokenGet,
                  n,
                  n
              ];

          orderValues[idx] = [
                  new BigNumber(currentOrder.amountGive),
                  new BigNumber(currentOrder.amountGet),
                  currentOrder.expires,
                  currentOrder.nonce,
                  0,
                  0
              ];

          vECDSA[idx] = currentOrder.v;
          rECDSA[idx] = currentOrder.r;
          sECDSA[idx] = currentOrder.s
      }

      if( currentOrder.exchange === 1) { // 0x
        console.log("Ox baby");
          orderAddresses[idx] = [
                  currentOrder.maker,
                  currentOrder.taker,
                  currentOrder.makerTokenAddress,
                  currentOrder.takerTokenAddress,
                  currentOrder.feeRecipient
              ];
          orderValues[idx] = [
                  new BigNumber(currentOrder.makerTokenAmount),
                  new BigNumber(currentOrder.takerTokenAmount),
                  new BigNumber(currentOrder.makerFee),
                  new BigNumber(currentOrder.takerFee),
                  currentOrder.expirationUnixTimestampSec,
                  currentOrder.salt
              ];

          vECDSA[idx] = currentOrder.ecSignature.v;
          rECDSA[idx] = currentOrder.ecSignature.r;
          sECDSA[idx] = currentOrder.ecSignature.s;
      }
  }

  return {
      exchanges: _exchanges,
      orderAddresses: orderAddresses,
      orderValues: orderValues,
      exchangeFees: exchangeFees,
      v: vECDSA,
      r: rECDSA,
      s: sECDSA
  }
}
/*
var ABI_easy = [{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawFees","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"feeAccount_","type":"address"}],"name":"changeFeeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"serviceFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"admin_","type":"address"}],"name":"changeAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ZRX_TOKEN_ADDR","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"tokensTotal","type":"uint256"},{"name":"ethersTotal","type":"uint256"},{"name":"exchanges","type":"uint8[]"},{"name":"orderAddresses","type":"address[5][]"},{"name":"orderValues","type":"uint256[6][]"},{"name":"exchangeFees","type":"uint256[]"},{"name":"v","type":"uint8[]"},{"name":"r","type":"bytes32[]"},{"name":"s","type":"bytes32[]"}],"name":"createSellOrder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"collectedFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawZRX","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"tokensTotal","type":"uint256"},{"name":"exchanges","type":"uint8[]"},{"name":"orderAddresses","type":"address[5][]"},{"name":"orderValues","type":"uint256[6][]"},{"name":"exchangeFees","type":"uint256[]"},{"name":"v","type":"uint8[]"},{"name":"r","type":"bytes32[]"},{"name":"s","type":"bytes32[]"}],"name":"createBuyOrder","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"serviceFee_","type":"uint256"}],"name":"changeFeePercentage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"admin_","type":"address"},{"name":"feeAccount_","type":"address"},{"name":"serviceFee_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"},{"indexed":false,"name":"ethers","type":"uint256"},{"indexed":false,"name":"tokensSold","type":"uint256"},{"indexed":false,"name":"ethersObtained","type":"uint256"},{"indexed":false,"name":"tokensRefunded","type":"uint256"}],"name":"FillSellOrder","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"},{"indexed":false,"name":"ethers","type":"uint256"},{"indexed":false,"name":"tokensObtained","type":"uint256"},{"indexed":false,"name":"ethersSpent","type":"uint256"},{"indexed":false,"name":"ethersRefunded","type":"uint256"}],"name":"FillBuyOrder","type":"event"}];

abiDecoder.addABI(ABI_easy);
const testData = "0xf9067381878477359400830a1590949ae4ed3bf7a3a529afbc126b4541c0d636d455f6880999ac9e5aaaa04db90604f7c3805200000000000000000000000012b306fa98f4cbb8d4457fdff3a0a0a56f07ccdf000000000000000000000000000000000000000000000043c33c1937564819f00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000002e0000000000000000000000000000000000000000000000000000000000000048000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000000000000000000000000000000000000000054000000000000000000000000000000000000000000000000000000000000005a00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000d1294a465ca1f1660e5afa17520f1a55f3ed7d0200000000000000000000000012b306fa98f4cbb8d4457fdff3a0a0a56f07ccdf000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d99750f1307326dcd3bf371fde3267426b82875900000000000000000000000012b306fa98f4cbb8d4457fdff3a0a0a56f07ccdf000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000014998f32ac7870000000000000000000000000000000000000000000000000000002cdc7205629c8000000000000000000000000000000000000000000000000000000000000051a97200000000000000000000000000000000000000000000000000000000e2e1c455000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001ac4286100191f000000000000000000000000000000000000000000000000000003c3079789758c000000000000000000000000000000000000000000000000000000000000051ad7500000000000000000000000000000000000000000000000000000000bb202c4a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000aa87bee538000000000000000000000000000000000000000000000000000000aa87bee5380000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001b00000000000000000000000000000000000000000000000000000000000000021875e91005fcee86c5d391f4e787629275f148716bcf1ffc8d1d7b4260f7366c15352ae855a5bc624cd6a0280d8229bb66ced837813fef32f83aa724351ded1500000000000000000000000000000000000000000000000000000000000000027749fb5921ee80fd8738f483366c172fe450d81cef5c4359e2a955c708551cf666f16cb90ee867e5dff8d3ab47be578e9699b150c6e9e553e55564462628035826a0192f05194f04c82f8da26a1fdb462b3cba1e4bf605c720cfbb19b4244125e6b3a05c3ae8d489d63920026ffba9b5627e84d6c17663ad5e4f066612e17a63166199";
console.log(abiDecoder);
const decodedData = abiDecoder.decodeMethod(testData);
console.log("decodedData", decodedData);
*/
const testABI = [{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawFees","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeAccount","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"feeAccount_","type":"address"}],"name":"changeFeeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"serviceFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"admin_","type":"address"}],"name":"changeAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ZRX_TOKEN_ADDR","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"tokensTotal","type":"uint256"},{"name":"ethersTotal","type":"uint256"},{"name":"exchanges","type":"uint8[]"},{"name":"orderAddresses","type":"address[5][]"},{"name":"orderValues","type":"uint256[6][]"},{"name":"exchangeFees","type":"uint256[]"},{"name":"v","type":"uint8[]"},{"name":"r","type":"bytes32[]"},{"name":"s","type":"bytes32[]"}],"name":"createSellOrder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"collectedFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawZRX","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"tokensTotal","type":"uint256"},{"name":"exchanges","type":"uint8[]"},{"name":"orderAddresses","type":"address[5][]"},{"name":"orderValues","type":"uint256[6][]"},{"name":"exchangeFees","type":"uint256[]"},{"name":"v","type":"uint8[]"},{"name":"r","type":"bytes32[]"},{"name":"s","type":"bytes32[]"}],"name":"createBuyOrder","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"serviceFee_","type":"uint256"}],"name":"changeFeePercentage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"admin_","type":"address"},{"name":"feeAccount_","type":"address"},{"name":"serviceFee_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"},{"indexed":false,"name":"ethers","type":"uint256"},{"indexed":false,"name":"tokensSold","type":"uint256"},{"indexed":false,"name":"ethersObtained","type":"uint256"},{"indexed":false,"name":"tokensRefunded","type":"uint256"}],"name":"FillSellOrder","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"},{"indexed":false,"name":"ethers","type":"uint256"},{"indexed":false,"name":"tokensObtained","type":"uint256"},{"indexed":false,"name":"ethersSpent","type":"uint256"},{"indexed":false,"name":"ethersRefunded","type":"uint256"}],"name":"FillBuyOrder","type":"event"}];
abiDecoder.addABI(testABI);
const testData = "0xf9068a0e843b9aca008308c0b3949ae4ed3bf7a3a529afbc126b4541c0d636d455f680b90624caf717430000000000000000000000007b22938ca841aa392c93dbb7f4c42178e3d65e880000000000000000000000000000000000000000000000000000000000009c4000000000000000000000000000000000000000000000000000330f8af60a0a00000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000004a00000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000056000000000000000000000000000000000000000000000000000000000000005c000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000007c0480106375e25b12aa10e412d365b4c064b6b800000000000000000000000000000000000000000000000000000000000000000000000000000000000000007b22938ca841aa392c93dbb7f4c42178e3d65e88000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007c0480106375e25b12aa10e412d365b4c064b6b800000000000000000000000000000000000000000000000000000000000000000000000000000000000000007b22938ca841aa392c93dbb7f4c42178e3d65e880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000506cafb21a5800000000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000003be89ba5000000000000000000000000000000000000000000000000000000002a626b85000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000506cafb21a5800000000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000003be89ba500000000000000000000000000000000000000000000000000000000934f6a6d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000aa87bee538000000000000000000000000000000000000000000000000000000aa87bee5380000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000287cf2af9823cc10f24fbe21ec8eee1a5510468484619c152176d0fb9acf336d2c37e3550d3b231e6648f2bec16e3cf686c6428263c2b54a9fa988fc99d069a5200000000000000000000000000000000000000000000000000000000000000026b1aa3e007af9b332d3648fe59dae0bebb5b0e667c055ca96544b0bb1f4dcca678dfbd145c1b850766a2ad12aae062b9064136ad0f538e290e4a6281a3e5ae3f26a053d7153f9de35c6c86af43e2f944d40712527f1a6c493d94d05a09f757f7c234a07538b964c9e6bb4dd2ccefcd3dd0ef867617e6153da028118d9711c9051b6651";
const decodedData = abiDecoder.decodeMethod(testData);
var decodedTx = txDecoder.decodeTx(testData);
console.log("decodedData", decodedData);
console.log("decodedTx", decodedTx);
var fnDecoder = new txDecoder.FunctionDecoder(testABI);
console.log(fnDecoder.decodeFn(decodedTx.data));

var web3 = require('web3');
var coinType = '';
var ethAmount = 0;
var lowBidZrx = 0;
//var orders3;
const truffle = require("truffle-contract");

const NotShapeshiftJSON = require("./NotShapeshift.json");
const NotShapeshift = truffle(NotShapeshiftJSON);
console.log("NOT SHAPESHIFT", NotShapeshift)
const Promise = require("bluebird");
const $ = require("jquery");

//window. order = getOrders();


const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
};

const tilesData = [
  {
    id: 'ZRX',
    img: require('./pictures/zrx.jpg'),
    title: 'Ox (ZRX)',
    lowBid:'',
  },
  {
    id: 'MLN',
    img: require('./pictures/mln.jpg'),
    title: 'Melon (MLN)',
    lowBid: '',
  },
  {
    id: 'OMG',
    img: require('./pictures/omg.png'),
    title: 'OmiseGO (OMG)',
    lowBid: '',
  },
  {
    id: 'ANT',
    img: require('./pictures/ant.jpg'),
    title: 'Aragon (ANT)',
    lowBid: '',
  },
  {
    id: 'SNT',
    img: require('./pictures/snt.svg'),
    title: 'Status (SNT)',
    lowBid: '',
  },
  {
    id: 'BNT',
    img: require('./pictures/bnt.svg'),
    title: 'Bancor (BNT)',
    lowBid: '',
  },
  {
    id:'STORJ',
    img: require('./pictures/storj.svg'),
    title: 'Storj (STORJ)',
    lowBid: '',
  }

];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }
  handleToggle = () => this.setState({open: !this.state.open});

  getInitialState() {
    return {welcome: 'Hello!'};
  }
  componentDidMount() {
    this.web3 = new Web3(web3.currentProvider);
    window.addEventListener('load', this.handleLoad.bind(this));


  }
  handleLoad() {
    if (typeof web3 === 'undefined') {
      console.log("web3")
      document.getElementById('meta-mask-required').innerHTML = 'You need <a href="https://metamask.io/">MetaMask</a> browser plugin to run this example'
    }
    //console.log("order" ,orders3[0].price);
    // var orders2 = Promise.resolve(orders);
    // console.log("order", orders2);
    Promise.promisifyAll(window.web3.eth, { suffix: "Promise" });
    NotShapeshift.setProvider(window.web3.currentProvider);
    console.log("CONTRACT 2~ ", NotShapeshift);

    if (typeof NotShapeshift.currentProvider.sendAsync !== "function") {
      NotShapeshift.currentProvider.sendAsync = function() {
        return NotShapeshift.currentProvider.send.apply(
          NotShapeshift.currentProvider, arguments
        );
      };
    }

  }
  render() {
    return (
        <MuiThemeProvider>
        <div className="App">
          <AppBar
            title="Not Shapeshift"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <div style={styles.root}>
            <GridList style={styles.gridList} cols={2.2}>
              {tilesData.map((tile) => (
                <GridTile
                  key={tile.img}
                  title={tile.title}
                  titleStyle={styles.titleStyle}
                  subtitle={<span>Lowest bid: <b>{tile.lowBid}</b></span>}
                  titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                  onTouchTap={this.tileClick.bind(this, tile.id)}
                >
                <img src={tile.img} alt={tile.title}/>
                </GridTile>
              ))}
            </GridList>
          </div>

          <TextField hintText="Amount in Ether" type="text" id="amount" onChange={this.handleAmountChange.bind(this)} />
          <RaisedButton label="Buy"  onClick={this.handleSubmission.bind(this)}/>
          <p>Selected Token: <span id="selbut"> </span></p>
          <p>Lowest Bid: <span id="lowbid"> </span><span id ="totalErcToken"></span></p>
      </div>
      </MuiThemeProvider>
    );
  }
  tileClick(event, index, value){
      coinType = event;
      $("#selbut").html("Retrieving price information for "+ coinType);
      getOrders(coinType).then(orders =>{
        if(!orders.length){
          alert("No orders found for "+ coinType);
          $("#selbut").html();
          $("#lowbid").html();
          $("#totalErcToken").html("0")

          return false;
        }
        $("#selbut").html(coinType);
        $("#lowbid").html(orders[0].price);
        $("#totalErcToken").html(" is ",orders[0].price * this.state.amount || 0)
      //console.log("order",orders3);
      });
  }

  handleAmountChange(event, index, value) {
    console.log("hey", event.target.value);
    this.setState({amount: event.target.value});
    // ethAmount=event.target.value;
  }
  handleSubmission(event, index, value){
    console.log("clicked and sending request");
    var deployed;
    window.web3.eth.getAccountsPromise()
        .then(accounts => {
          console.log("AMOUNT~~~~", this.state.amount)
          ethAmount = window.web3.toWei(this.state.amount, 'ether')
          console.log("ACCOUNTS", accounts)
            if (accounts.length == 0) {
                $("#balance").html("N/A");
                throw new Error("No account with which to transact");
            }
            window.account = accounts[0];
            console.log("WINDOW.ACCOUNT", window.account);
            console.log("NotShapeshift~ ", NotShapeshift);
            // console.log("ACCOUNT:", window.account);
            console.log("NotShapeshift.deployed()", NotShapeshift.deployed());
            return NotShapeshift.deployed(); //NotShapeshift is truffle contract
        })
        .then(function(_deployed) {
          console.log("HEEERE");
          deployed = _deployed;
          console.log("deployed contract", deployed) //methods logged in chrome console
          return deployed.getBalance.call(); //deployed is our NotShapeshift.deployed() truffle instance
      })
        .then(function(result){
          console.log("Result from contract method call: ", result);
          return deployed.wrapEth({value: ethAmount, from: window.account}); // don't include "to since it's specified in the solidity function"
        })
        .then(function(txObject){
          // if(success) check for wrapEth success
          console.log("Transaction object", txObject)
          if(txObject.receipt.status !== 1){
            console.error("Transaction unsuccessful");
            return false;
          }
          return ethAmount;
        })
        .then(function(wethBalance){
          //address[5] orderAddresses, uint[6] orderValues, uint fillTakerTokenAmount, bool shouldThrowOnInsufficientBalanceOrAllowance, uint8 v, bytes32 r, bytes32 s
          //deployedAddress[3] should be var variable token;
            //maker: orderAddresses[0],
            // taker: orderAddresses[1],
            // makerToken: orderAddresses[2],
            // takerToken: orderAddresses[3],
            // feeRecipient: orderAddresses[4],
          alert("Wrong Network! ")
          var orderArray = window.orders[0]
          var orderAddresses = [orderArray[0], orderArray[1],orderArray[2], orderArray[3], orderArray[4]]
          var orderValues = [orderArray[0], orderArray[1], orderArray[2], orderArray[3], orderArray[4]]
          var tokenAmount = wethBalance;
          var safety = true;
          var v = orderArray[3];
                    var s = orderArray[3];

          var v = orderArray[3];

          var r  = orderArray[3];
          var s = orderArray[3];

          return deployed.fillOrder(orderAddresses, orderValues, tokenAmount, safety, v, r, s);
        })
        .catch(error => {
          return console.error(error)
        })

    // window.web3.eth.sendTransaction({
    //   from: window.web3.eth.accounts[0],
    //   to: '0x6c85E27E0b01733f5d22425582A6CBD2B4a1C041',
    //   value: window.web3.toWei(ethAmount, 'ether')
    // }, function(error, result) {
    //   if (!error) {
    //     document.getElementById('response').innerHTML = 'Success: <a href="https://testnet.etherscan.io/tx/' + result + '"> View Transaction </a>'
    //   } else {
    //     document.getElementById('response').innerHTML = '<pre>' + error + '</pre>'
    //   }
    // })
  }
}

async function getOrders(makerToken) {
  console.log("YES");
  var mkrToken = makerToken;
  const takerToken = "WETH";
  const networkId = 42;
  const orders_url = "https://api.ercdex.com/api/standard/"+networkId+"/v0/orders?sortOrder=price&isOpen=True&isAscending=false";
  const tokenpairs_url = "https://api.ercdex.com/api/token-pairs/"+networkId;
  var orders_result = await WebRequest.get(orders_url);
  var tokenpairs_result = await WebRequest.get(tokenpairs_url);
  let orders_obj = JSON.parse(orders_result.content);
  let tokenpairs_obj = JSON.parse(tokenpairs_result.content);
  //Let's get the mastertoken address and takertoken address
  var taker_Address = "";
  var maker_Address = "";
  for (var key in tokenpairs_obj) {
    if(tokenpairs_obj[key].tokenB.symbol === takerToken){
      taker_Address = tokenpairs_obj[key].tokenB.address
    }
    if(tokenpairs_obj[key].tokenA.symbol === mkrToken){
      maker_Address = tokenpairs_obj[key].tokenA.address
    }
  }
  console.log("Taker Address, ",taker_Address);
  console.log("Maker Address, ",maker_Address);
  var final_orders = [];
  console.log("orders_obj", orders_obj);
  for (var key in orders_obj) {
    //console.log("Maker :", orders_obj[key].makerTokenAddress, "Taker: ", orders_obj[key].takerTokenAddress);
    if(orders_obj[key].makerTokenAddress === maker_Address
            && orders_obj[key].takerTokenAddress === taker_Address){
      var matched_order = orders_obj[key];
      var price = matched_order.takerTokenAmount/matched_order.makerTokenAmount;
      final_orders.unshift(matched_order);
    }
  }
  for(var key in final_orders){
    var current_order = final_orders[key];
    var order_addresses = [current_order.maker, current_order.taker, current_order.makerTokenAddress, current_order.takerTokenAddress, current_order.feeRecipient];
    var order_values = [current_order.makerTokenAmount, current_order.takerTokenAmount, current_order.makerFee, current_order.takerFee, current_order.salt];
    var v = current_order.ecSignature.v;
    var r = current_order.ecSignature.r;
    var s = current_order.ecSignature.s;
    var price = current_order.takerTokenAmount/current_order.makerTokenAmount;
    var final_order = {
      orderAddresses: order_addresses,
      orderValues: order_values,
      v: v,
      r: r,
      s: s,
      price: price
    }
    final_orders[key] = final_order
  }
  console.log("final_orders", final_orders);
  const prepareOrd = prepareOrderParams2(1, orders_obj.map(o => {
    o.exchange = 1;
    return o;
  }))
  console.log("XXXXX", prepareOrd);
  console.log(JSON.stringify(prepareOrd));

  window.orders = final_orders;
  return final_orders; //sorted by best to worst price
}
export default App;
