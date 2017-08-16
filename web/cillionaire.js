var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("https://api.myetherapi.com/eth"));
var mainnetAddress = "0x4f6Fe3bBEfDB17E23D6e74a33482413c961569C3";
var ABI  = [{"constant":false,"inputs":[{"name":"_ownerRandomHash","type":"bytes32"}],"name":"start","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_count","type":"uint256"}],"name":"refund","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ownerRandomHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"participants","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"stake","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdrawFees","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"pot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_potTarget","type":"uint256"},{"name":"_stake","type":"uint256"},{"name":"_fee","type":"uint256"}],"name":"setParams","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ownerRandomNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ownerRandomNumber","type":"string"},{"name":"_ownerRandomSecret","type":"string"}],"name":"chooseWinner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastRefundedIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"potTarget","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minerRandomNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fees","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setContractOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"participate","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"winner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"funds","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"cancel","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"participationEndTimestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newState","type":"uint8"}],"name":"StateChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"participant","type":"address"},{"indexed":false,"name":"total","type":"uint256"},{"indexed":false,"name":"stakeAfterFee","type":"uint256"},{"indexed":false,"name":"refundNow","type":"uint256"}],"name":"NewParticipant","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"number","type":"uint256"}],"name":"MinerRandomNumber","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"number","type":"uint256"}],"name":"OwnerRandomNumber","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"randomNumber","type":"uint256"}],"name":"RandomNumber","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winnerIndex","type":"uint256"}],"name":"WinnerIndex","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_winner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Winner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"participant","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Refund","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"cancelledBy","type":"address"}],"name":"Cancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newPotTarget","type":"uint256"},{"indexed":false,"name":"newStake","type":"uint256"},{"indexed":false,"name":"newFee","type":"uint256"}],"name":"ParametersChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"ContractOwnershipTransferred","type":"event"}];

var Cillionaire = web3.eth.contract(ABI);
cillionaire = Cillionaire.at(mainnetAddress);

$(function () {
	initUI();
});

function initUI() {
	$("#contractAddress").html("cillionaire.eth - " + mainnetAddress);
	initState();
	$('#contractPotTarget').html(formatEth(cillionaire.potTarget()));
	$('#contractStake').html(formatEth(cillionaire.stake()));
	$('#contractFee').html(formatEth(cillionaire.fee()) + " (The fee is taken from each participant's stake)");
	$('#contractPot').html(formatEth(cillionaire.pot()));
	initParticipants();
	$('#contractWinner').html(formatWinner(cillionaire.winner()));
}

function initState() {
	var state = parseInt(cillionaire.state());
	var stateString = "Unknown";
	switch (state) {
		case 0: stateString = "ENDED - The game is not currently ongoing. The stats below reflect the last game."; break;
		case 1: stateString = "PARTICIPATION - Participate by sending the required amount of ether (stake) to the contract using the <i>participate()</i> function."; break;
		case 2: stateString = "CHOOSE WINNER - Participation phase is complete. Next step is to draw the winner."; break; 
		case 3: stateString = "REFUND - The game was cancelled. Now, all participants must be refunded, before a new game can start."; break;
	}
	$('#contractState').html(stateString);
}

function initParticipants() {
	var i = 0;
	while (cillionaire.participants(i).toString() != "0x") {
		i++;
	}
	$('#contractParticipants').html(i);
}

function formatEth(wei) {
	return wei.dividedBy(1E18).toString() + ' ETH';
}

function formatWinner(winner) {
	return winner.toString() == "0x0000000000000000000000000000000000000000" ? "Not yet decided" : winner.toString();
}

