var netId;  //1,3,42,4
var userAccount;
var web3js;

var identity;
var identityABI;
var identityByteCode;

var userRegistory;
var userRegistoryInstance;
var userRegistoryABI;
var userRegistoryAddress;

var issuerAddress;
var claimType = 0;

var claimVerifier;
var claimVerifierInstance;
var claimVerifierABI;
var claimVerifierAddress;

async function startApp() {
    var version = await web3js.version.network;

    if(version !=4){
        alert("This is only working on Rinkeby now!")
    }

    await $.getJSON('../contracts/Identity.json').then(function (data) {
        identityABI = data.abi;
        identityBytesCode = data.bytecode;
    });

    identity = web3js.eth.contract(identityABI);

    await $.getJSON('../contracts/UserRegistry.json').then(function (data) {
        userRegistoryABI = data.abi;
        userRegistoryAddress = "0xd34628cf3c0b9c5d70247f871f55555eb9e4dfbf";
    });

    await $.getJSON('../contracts/KeyHolder.json').then(function (data) {
        issuerAddress = "0x3d30dcf58906bab9abb2dfe42c010069ad9c0788";
        document.getElementById("issuer").innerHTML = issuerAddress;
    });

    userRegistory = web3js.eth.contract(userRegistoryABI);
    userRegistoryInstance = userRegistory.at(userRegistoryAddress);

    await $.getJSON('../contracts/ClaimVerifier.json').then(function (data) {
        claimVerifierABI = data.abi;
        claimVerifierAddress = "0xec3609f1046092d62b9b03c31fe78475d5d2a0e7";
    });

    /*
    await $.getJSON('../contracts/Identity.json').then(function (data) {
        identityABI = data.abi;
        identityBytesCode = data.bytecode;
    });

    identity = web3js.eth.contract(identityABI);

    await $.getJSON('../contracts/UserRegistry.json').then(function (data) {
        userRegistoryABI = data.abi;
        userRegistoryAddress = data.networks[version].address;
    });

    await $.getJSON('../contracts/KeyHolder.json').then(function (data) {
        issuerAddress = data.networks[version].address;
        document.getElementById("issuer").innerHTML = issuerAddress;
    });

    userRegistory = web3js.eth.contract(userRegistoryABI);
    userRegistoryInstance = userRegistory.at(userRegistoryAddress);

    await $.getJSON('../contracts/ClaimVerifier.json').then(function (data) {
        claimVerifierABI = data.abi;
        claimVerifierAddress = data.networks[version].address;
    });
    */

    claimVerifier = web3js.eth.contract(claimVerifierABI);
    claimVerifierInstance = claimVerifier.at(claimVerifierAddress);

    var accountInterval = setInterval(function () {
        web3.eth.getAccounts((error, accounts) => {
            if (accounts[0] !== userAccount) {
                userAccount = accounts[0];
                displayIdentity()
            }
        });
    }, 100);
}

window.addEventListener('load', function () {

    if (typeof web3 !== 'undefined') {
        web3js = new Web3(web3.currentProvider);
    } else {

    }
    startApp()
})

$( "#add" ).click(function() {
    add();
});

$( "#verify" ).click(function() {
    verify();
});

$( "#deploy" ).click(function() {
    deploy();
});

function deploy() {
    identity.new(userRegistoryAddress, {
        from: userAccount,
        data: identityBytesCode
    }, function (err, myContract) {
        if (!err) {
            if (!myContract.address) {
                console.log(myContract.transactionHash)
            } else {
                displayIdentity();
            }
        }
    });
}

function add() {
    userRegistoryInstance.users(userAccount, function (err, result) {
        console.log(result)
        $.ajax({
            method: 'POST',
            url: location.href + 'add',
            data: {
                "identity": result,
                "claimType": 0,
                "id": document.getElementById("usr").value,
                "pass": document.getElementById("pwd").value,
            },
            dataType: 'json',

            success: function (data, textStatus, jqXHR) {
                if (data.status) {
                    var identityInstance = identity.at(result);
                    identityInstance.addClaim(
                        claimType,
                        0,
                        issuerAddress,
                        data.sig,
                        data.data,
                        ""
                        ,
                        function (err, result) {
                            if (!err) {
                                console.log(result);
                            }
                        });
                } else {
                    alert("Your account is not verified!")
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error');
            }
        })
    });
}

function verify() {
    userRegistoryInstance.users(userAccount, function (err, result) {
        claimVerifierInstance.claimIsValid(result, claimType, function (err, result) {             
            if (result) {
                document.getElementById("account").innerHTML = "Verified: <i class='fas fa-check' style='color:green'></i>"
            } else {
                document.getElementById("account").innerHTML = "Verified: <i class='fas fa-times' style='color:red'></i>"
            }
        });
    });
}

function displayIdentity() {
    userRegistoryInstance.users(userAccount, function (err, result) {
        if (result != 0x0) {
            document.getElementById("identity").innerHTML = result;
            document.getElementById("deploy").innerHTML = "Replace Identity";
            document.getElementById("add").disabled = false;
            document.getElementById("verify").disabled = false;
            document.getElementById("new").style.display = "block";
        }
    });
}