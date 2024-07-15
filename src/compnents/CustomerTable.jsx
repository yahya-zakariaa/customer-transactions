import React, { useState, useEffect } from "react";
import axios from "axios";
import TableRow from "./TableRow";
import TransactionChart from "./transactionChart";
import "../App.css";

function Table() {
  const [customersTransactions, setCustomersTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [userChartData, setUserChartData] = useState(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [transactionsResponse, customersResponse] = await Promise.all([
          axios.get(
            "https://yahya-zakariaa.github.io/customer-transaction-json/transactions.json"
          ),
          axios.get(
            "https://yahya-zakariaa.github.io/customer-transaction-json/customers.json"
          ),
        ]);

        const customers = customersResponse.data.customers;
        const transactions = transactionsResponse.data.transactions;

        const allCustomersData = customers.map((customer) => ({
          ...customer,
          Transactions: transactions.filter(
            (transaction) => transaction.customer_id == customer.id
          ),
        }));

        setCustomersTransactions(allCustomersData);
        setFilteredTransactions(allCustomersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleNameSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = customersTransactions.filter((user) =>
      user.name.toLowerCase().startsWith(value)
    );
    setFilteredTransactions(filtered);
  };

  const handleTransactionSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = customersTransactions.filter((user) =>
      user.Transactions.some((transaction) =>
        transaction.amount.toString().startsWith(value)
      )
    );
    setFilteredTransactions(filtered);
  };

  const clearInputs = () => {
    document.querySelector("#searchByName").value = "";
    document.querySelector("#searchByTransaction").value = "";
    setFilteredTransactions(customersTransactions);
  };
  const showChart = (user) => {
    document.querySelector("body").classList.add("overflow-hidden");

    const currentUserData = customersTransactions.find((e) => e.id == user.id);

    setUserChartData({
      labels: currentUserData.Transactions.map(
        (transaction) => transaction.date
      ),
      datasets: [
        {
          label: currentUserData.name,
          data: currentUserData.Transactions.map(
            (transaction) => transaction.amount
          ),
          fill: false,
          backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
            16
          )}`,
          borderColor: `rgba(${Math.floor(Math.random() * 4)}, ${Math.floor(
            Math.random() * 23
          )}, ${Math.floor(Math.random() * 192)}, 1)`,
        },
      ],
    });
  };
  const showAllTransactionsChart = () => {
    document.querySelector("body").classList.add("overflow-hidden");

    const allCustomersData = customersTransactions.map((user) => ({
      label: user.name,
      data: user.Transactions.map((transaction) => transaction.amount),
      fill: false,
      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      borderColor: `rgba(${Math.floor(Math.random() * 4)}, ${Math.floor(
        Math.random() * 23
      )}, ${Math.floor(Math.random() * 192)}, 1)`,
    }));

    setUserChartData({
      labels: ["2022-1-1", "2022-1-2"],
      datasets: allCustomersData,
    });

    setShowAllTransactions(true);
  };

  return (
    <section id="main-section" className="table py-5 m-0 bg-dark ">
      <div className="gradient-custom-2 h-100 d-flex flex-column align-items-center">
        <input
          className="form-control w-75 shadow rounded-pill py-2"
          id="searchByName"
          type="text"
          placeholder="Search by name"
          onKeyUp={handleNameSearch}
        />

        <input
          className="form-control w-75 mt-4 rounded-pill py-2  shadow"
          id="searchByTransaction"
          type="text"
          placeholder="Search by transaction"
          onKeyUp={handleTransactionSearch}
        />

        <div className="d-flex my-5 px-3">
          <button
            className="btn btn-primary btn-primary me-3"
            onClick={showAllTransactionsChart}>
            All Customers Chart
          </button>
          <button className="btn btn-danger" onClick={clearInputs}>
            Clear Inputs
          </button>
        </div>

        <div className="mask d-flex align-items-center h-100 w-100">
          <div className="container d-flex flex-column align-items-center justify-content-center bg-transparent">
            <div className="row w-100">
              <div className="col-12 p-0 mb-0">
                <div className="table-responsive">
                  <table className="table rounded-5  table-dark table-bordered table-hover table-striped mb-0">
                    <thead className="text-center">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Transaction</th>
                        <th scope="col">Date</th>
                        <th scope="col">View Chart</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {filteredTransactions.map((user) =>
                        user.Transactions.map((transaction, index) => (
                          <TableRow
                            key={`${user.id}-${index}`}
                            id={user.id}
                            name={user.name}
                            date={transaction.date}
                            amount={transaction.amount}
                            btnId={user.id}
                            fun={() => showChart(user)}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {userChartData && (
        <div
          id="chartContainer"
          className="bg-dark overflow-hidden position-absolute top-50 start-50 py-4 translate-middle">
          <button
            className="fs-5 position-absolute top-0 end-0 btn text-white fw-bolder m-3"
            onClick={() => {
              document
                .querySelector("body")
                .classList.remove("overflow-hidden");
              setUserChartData(null);
              setShowAllTransactions(false);
            }}>
            X
          </button>
          <div className="container   d-flex justify-content-center align-items-center flex-column h-100 w-100 p-5 px-2">
            {showAllTransactions && (
              <h2 className="text-white bg-transparent mb-5">
                Showing All Customers Transactions
              </h2>
            )}
            <TransactionChart chartData={userChartData} />
          </div>
        </div>
      )}
    </section>
  );
}

export default Table;
