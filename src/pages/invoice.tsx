import { Group, Table } from '@mantine/core';
import React from 'react';

const data = [
  {
    item: 'item1',
    hsn: 'hsn1',
    quantity: 'quantity1',
    discount: 'discount1',
    damt: 'damt1',
    amount: 'amount1',
  },
  {
    item: 'item2',
    hsn: 'hsn2',
    quantity: 'quantity2',
    discount: 'discount2',
    damt: 'damt2',
    amount: 'amount2',
  },
  {
    item: 'item3',
    hsn: 'hsn3',
    quantity: 'quantity3',
    discount: 'discount3',
    damt: 'damt3',
    amount: 'amount3',
  },
];

const invoice = () => {
  return (
    <div
      style={{
        width: '2480px',
        height: '3508px',
        backgroundColor: 'white',
        padding: '70px',
      }}
    >
      <div
        style={{
          border: '2px solid black',
          height: '100%',
          //  background: 'yellow',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: '25%',
            border: '2px solid black',
            flexDirection: 'row',
          }}
        >
          <div
            style={{
              flex: 0.6,
              border: '2px solid black',
            }}
          >
            <div
              style={{
                height: '50%',
                borderBottom: '2px solid black',
              }}
            >
              <h1 style={{ color: 'black' }}>company name</h1>
            </div>
            <div style={{ height: '50%' }}>
              <h1 style={{ color: 'black' }}>biller address</h1>
            </div>
          </div>
          <div
            style={{
              flex: 0.4,
              border: '2px solid black',
              height: '100%',
              //   background: '#E0E0E0',
            }}
          >
            <Table withBorder withColumnBorders style={{ height: '100%' }}>
              <thead style={{ height: '15%' }}>
                <tr style={{ color: 'black', height: '12%', width: '50%' }}>
                  <th style={{ color: 'black' }}>
                    <h1>Invoice No</h1>
                  </th>
                  <th style={{ color: 'black', width: '50%' }}>
                    <h1>Date</h1>
                  </th>
                </tr>
              </thead>
              <thead style={{ height: '15%' }}>
                <tr style={{ color: 'black', height: '12%' }}>
                  <th style={{ color: 'black', width: '50%' }}>
                    <h1>Delivery note</h1>
                  </th>
                  <th style={{ color: 'black', width: '50%' }}>
                    <h1>Terms of payment</h1>
                  </th>
                </tr>
              </thead>
              <thead style={{ height: '15%' }}>
                <tr style={{ color: 'black', height: '12%' }}>
                  <th style={{ color: 'black', fontSize: '50px' }}></th>
                  <th style={{ color: 'black', fontSize: '50px' }}></th>
                </tr>
              </thead>
              <thead style={{ height: '15%' }}>
                <tr style={{ color: 'black', height: '12%' }}>
                  <th style={{ color: 'black', fontSize: '50px' }}></th>
                  <th style={{ color: 'black', fontSize: '50px' }}></th>
                </tr>
              </thead>
              <thead style={{ height: '15%' }}>
                <tr style={{ color: 'black', height: '12%' }}>
                  <th style={{ color: 'black', fontSize: '50px' }}></th>
                  <th style={{ color: 'black', fontSize: '50px' }}></th>
                </tr>
              </thead>
              <thead style={{ height: '15%' }}>
                <tr style={{ color: 'black', height: '12%' }}>
                  <th style={{ color: 'black', fontSize: '50px' }}></th>
                  <th style={{ color: 'black', fontSize: '50px' }}></th>
                </tr>
              </thead>
            </Table>
          </div>
        </div>
        <div
          style={{
            height: '40%',
            border: '2px solid black',
            backgroundColor: '#E0E0E0',
          }}
        >
          <Table withBorder withColumnBorders>
            <thead>
              <tr style={{ color: 'black' }}>
                <th style={{ color: 'black', fontSize: '50px' }}>Sno</th>
                <th style={{ color: 'black', fontSize: '50px' }}>Item</th>
                <th style={{ color: 'black', fontSize: '40px' }}>HSN/SAC</th>
                <th style={{ color: 'black', fontSize: '40px' }}>Quantity</th>
                <th style={{ color: 'black', fontSize: '40px' }}>Discount</th>
                <th style={{ color: 'black', fontSize: '50px' }}>DAmt</th>
                <th style={{ color: 'black', fontSize: '40px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td style={{ color: 'black', fontSize: '40px', width: '5%' }}>
                    {index + 1}
                  </td>
                  <td
                    style={{ color: 'black', fontSize: '40px', width: '50%' }}
                  >
                    {item.item}
                  </td>
                  <td style={{ color: 'black', fontSize: '40px' }}>
                    {item.hsn}
                  </td>
                  <td style={{ color: 'black', fontSize: '40px' }}>
                    {item.quantity}
                  </td>
                  <td style={{ color: 'black', fontSize: '40px' }}>
                    {item.discount}
                  </td>
                  <td style={{ color: 'black', fontSize: '40px' }}>
                    {item.damt}
                  </td>
                  <td style={{ color: 'black', fontSize: '40px' }}>
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6} style={{ color: 'black', fontSize: '50px' }}>
                  Total
                </td>
                <td style={{ color: 'black', fontSize: '50px' }}>1000</td>
              </tr>
            </tfoot>
          </Table>
        </div>
        <div style={{ height: '10%' }}>
          <Table withBorder withColumnBorders>
            <thead>
              <tr style={{ color: 'black' }}>
                <th style={{ color: 'black', fontSize: '40px', width: '50%' }}>
                  HSN/SAC
                </th>
                <th style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  Taxable Value
                </th>
                <th
                  style={{ color: 'black', fontSize: '35px', width: '10%' }}
                  colSpan={2}
                >
                  CGST
                </th>
                <th
                  style={{ color: 'black', fontSize: '35px', width: '10%' }}
                  colSpan={2}
                >
                  SGST
                </th>

                <th style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  Total
                </th>
              </tr>
              <tr>
                <th
                  style={{ color: 'black', fontSize: '35px', width: '50%' }}
                  colSpan={2}
                ></th>
                <th style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  Rate
                </th>
                <th style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  Amount
                </th>
                <th style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  Rate
                </th>
                <th style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  Amount
                </th>
                <th
                  style={{ color: 'black', fontSize: '35px', width: '10%' }}
                ></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: 'black', fontSize: '35px', width: '50%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
              </tr>
              <tr>
                <td style={{ color: 'black', fontSize: '35px', width: '50%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
                <td style={{ color: 'black', fontSize: '35px', width: '10%' }}>
                  123
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default invoice;
