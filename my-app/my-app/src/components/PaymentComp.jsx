import React from "react";
import FooterComp from "../components/FooterComp";

export default function PaymentComp() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Payments</h2>
      <table className="table table-bordered table-striped w-75 mx-auto">
        <thead className="table-dark">
          <tr>
            <th>Bill ID</th>
            <th>Month</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Pay</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>001</td>
            <td>June 2026</td>
            <td>₹1500</td>
            <td>Pending</td>
            <td><button className="btn btn-primary btn-sm">Pay Now</button></td>
          </tr>
        </tbody>
      </table>
      <FooterComp />
    </div>
  );
}


