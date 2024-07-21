'use client'
import { useState } from 'react';
import { Importer, ImporterField } from 'react-csv-importer';
import { ethers, Contract } from "ethers";
import Multisend from "./Multisend.json";

const blockchainExplorerUrls = {
  "84532": "https://sepolia.basescan.org/tx"
}

export default function Home() {

  const [payments, setPayments] = useState(undefined);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [blockchainExplorer, setBlockchainExplorer] = useState(undefined);
  const [transaction, setTransaction] = useState(false);

  const sendPayments = async () => {

    //Connect to Metamask
    const provider = new ethers.BrowserProvider(window.ethereum);  // Connnect to the ethereum provider, optionally forcing the network
    const signer = await provider.getSigner();
    const { chainId } = await provider.getNetwork();
    setBlockchainExplorer(blockchainExplorerUrls[chainId.toString()]);
    console.log(blockchainExplorer);

    //Show feedback to user
    setSending(true);

    //Format arguments for smart contract function ??
    //acc is accumulator and val is current row value
    const { recipients, amounts, total } = payments.reduce((acc, val) => {

      acc.recipients.push(val.recipient);
      acc.amounts.push(val.amount);
      acc.total += parseInt(val.amount);
      return acc;

    }, { recipients: [], amounts: [], total: 0 })

    // Send transaction
    const multisend = new Contract(Multisend.address, Multisend.abi, signer); // Connected to a Signer; can make state changing transactions, which will cost the account ether

    try {

      const tx = await multisend.send(recipients, amounts, { value: total }); // the transaction has been sent to mempool but has not been included/mined yet
      const txReceipt = await tx.wait();  // wait for transaction to be included/mined
      setTransaction(txReceipt.hash);

    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  return (
    <div className="container-fluid mt-5 d-flex justify-content-center">
      <div id="content" className="row">
        <div id="content-inner" className="col">
          <div className="text-center">
            <h1 id="title" className="fw-bold">MULTISEND</h1>
            <p id="sub-title" className="mt-4 fw-bold"><span>Send multiple payments <br />in a single transaction</span></p>
          </div>

          <Importer
            dataHandler={(rows) => setPayments(rows)}

            defaultNoHeader={false} // optional, keeps "data has headers" checkbox off by default
            restartable={false} // optional, lets user choose to upload another file when import is complete
          >
            <ImporterField name="recipient" label="Recipient" />
            <ImporterField name="amount" label="Amount" />
            <ImporterField name="currency" label="Currency" />
          </Importer>;

          <div className='text-center'>
            <button
              className='btn btn-primary mt-5'
              onClick={sendPayments}
              disabled={payments === undefined}
            >
              Send Payments
            </button>
          </div>

          {sending && <div className='alert alert-info mt-4 mb-0'>Your payments are processing. Please wait until the transaction is complete.</div>}

          {error && <div className='alert alert-danger mt-4 mb-0'>Oops, something went wrong. Please try again later.</div>}

          {transaction && <div className='alert alert-success mt-4 mb-0'>Success! Your payments were sent.</div>}

        </div>
      </div>
    </div>
  );
}
