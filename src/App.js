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
            return NotShapeshift.deployed(); //NotShapeshift is truffle contract
        })
        .then(function(_deployed) {
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
            //fillOrder() parameters: (found in contracts/Exchange.sol)
            //address[5] orderAddresses, uint[6] orderValues, uint fillTakerTokenAmount, bool shouldThrowOnInsufficientBalanceOrAllowance, uint8 v, bytes32 r, bytes32 s

          alert("Wrong Network! ")
          var orderObject = window.orders[0] //grabs first order from Dan's getOrders()
          //Define parameters for fillOrder() below:
          var orderAddresses = order_object.order_addresses;
          var orderValues = order_object.order_values; //currently .length = 5.... Order_values[5] should be `expirationTimestampInSec` (it's currently salt) 
          var fillTakerTokenAmount = wethBalance; //need to make sure that wethBalance is a number and that it comes from a smart contract call for getBalance
          var shouldThrowOnInsufficientBalanceOrAllowance = true;
          var v = orderObject.v;
          var r = orderObject.s;
          var r = orderObject.r;

          return deployed.fillOrder(
            orderAddresses, 
            orderValues, 
            fillTakerTokenAmount, 
            shouldThrowOnInsufficientBalanceOrAllowance, 
            v, 
            r, 
            s);
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
    var order_addresses = [current_order.makera current_order.takera current_order.makerTokenAddressa current_order.takerTokenAddressa current_order.feeRecipient];
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
  console.log(final_orders);
  window.orders = final_orders;
  return final_orders; //sorted by best to worst price
}
export default App;
