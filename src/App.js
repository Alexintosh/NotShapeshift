import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Web3 from 'web3'
import RaisedButton from 'material-ui/RaisedButton';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import * as WebRequest from 'web-request';

var web3 = require('web3');
var ethAmount=0;
var coinType = '';
const truffle = require("truffle-contract");
const $ = require("jquery");
const NotShapeshiftJSON = require("./NotShapeshift.json");
const NotShapeshift = truffle(NotShapeshiftJSON);
console.log("NOT SHAPESHIFT", NotShapeshift)
const Promise = require("bluebird");  



console.log(getOrders());

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
    id: 'zrx',
    img: './zrx.jpg',
    title: 'Ox (ZRX)',
    lowBid: '',
  },
  {
    id: 'mln',
    img: 'mln.jpg',
    title: 'Melon (MLN)',
    lowBid: '',
  },
  {
    id: 'omg',
    img: 'omg.png',
    title: 'OmiseGO (OMG)',
    lowBid: '',
  },
  {
    id: 'ant',
    img: '../public/ant.jpg',
    title: 'Aragon (ANT)',
    lowBid: '',
  },
  {
    id: 'snt',
    img: 'snt.svg',
    title: 'Status (SNT)',
    lowBid: '',
  },
  {
    id: 'bnt',
    img: 'bnt.svg',
    title: 'Bancor (BNT)',
    lowBid: '',
  },
  {
    id:'storj',
    img: 'storj.svg',
    title: 'Storj (STORJ)',
    lowBid: '',
  },

];

class App extends Component {

  constructor() {
    super();
    this.state = {
      selectedToken: 'ZRX',
    };
  }
  getInitialState() {
    return {amount: 'Hello!'};
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
    console.log("WEB3", window.web3);
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
            title="App Name"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <div style={styles.root}>
            <GridList style={styles.gridList} cols={2.2}>
              {tilesData.map((tile) => (
                <GridTile
                  key={tile.img}
                  title={tile.title}
                  titleStyle={styles.titleStyle}
                  titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                  onTouchTap={this.tileClick.bind(this, tile.id)}
                >
                <img src={tile.img} alt={tile.title}/>
                </GridTile>
              ))}
            </GridList>
          </div>

          <TextField hintText="Amount willing to trade" type="text" id="amount"
                value={this.state.amount} onChange={this.handleAmountChange.bind(this)} />
          <RaisedButton label="Buy"  onClick={this.handleSubmission.bind(this)}/>
      </div>
      </MuiThemeProvider>
    );
  }
  tileClick(event, index, value){
      coinType = event;
      console.log(coinType);
  }
  handleChange(event, index, value) {
     this.setState({
       selectedToken: value,
     });
  }
  handleAmountChange(event, index, value) {
    this.setState({amount: event.target.value});
    ethAmount=event.target.value;
    console.log(ethAmount);
  }
  handleSubmission(event, index, value){
    console.log("clicked and sending request");

    window.web3.eth.getAccountsPromise()
        .then(accounts => {
          console.log("ACCOUNTS", accounts)
            if (accounts.length == 0) {
                $("#balance").html("N/A");
                throw new Error("No account with which to transact");
            }
            window.account = accounts[0];
            console.log("WINDOW.ACCOUNT", window.account);
            console.log("NotShapeshift~ ", NotShapeshift);
            // console.log("ACCOUNT:", window.account);
            return NotShapeshift.deployed(); //if you print it here, you won't see anything since it won't resolve in time
        })
        .then(function(deployed) {
          console.log("deployed contract", deployed) //methods logged in chrome console
            return deployed.getBalance.call(); //deployed is our NotShapeshift.deployed() truffle instance
      })
        .then(function(result){
          console.log("Result from contract method call: ", result);
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

async function getOrders() {
  console.log("YES");
  const makerToken = "ZRX";
  const takerToken = "WETH";
  const networkId = 1;
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
    if(tokenpairs_obj[key].tokenB.symbol == takerToken){
      taker_Address = tokenpairs_obj[key].tokenB.address
    }
    if(tokenpairs_obj[key].tokenA.symbol == makerToken){
      maker_Address = tokenpairs_obj[key].tokenA.address
    }
  }
  console.log("Taker Address, ",taker_Address);
  console.log("Maker Address, ",maker_Address);
  var final_orders = [];
  for (var key in orders_obj) {
    //console.log("Maker :", orders_obj[key].makerTokenAddress, "Taker: ", orders_obj[key].takerTokenAddress);
    if(orders_obj[key].makerTokenAddress == maker_Address
            && orders_obj[key].takerTokenAddress == taker_Address){
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
  console.log(final_orders);
  return final_orders;
}
export default App;
