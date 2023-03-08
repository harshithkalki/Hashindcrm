import React from 'react';

const test = () => {
  return (
    <>
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <title>Accounting Voucher Display</title>
      <meta name='author' content='(tally)' />
      <style
        type='text/css'
        dangerouslySetInnerHTML={{
          __html:
            ' * {margin:0; padding:0; text-indent:0; }\n h1 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 8.5pt; }\n .s1 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 8.5pt; }\n .s2 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; }\n .s3 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; }\n .s4 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 6.5pt; }\n .s5 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 6.5pt; }\n .s6 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 6.5pt; }\n .s7 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 7pt; }\n .s8 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7pt; }\n .s9 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 7pt; }\n .s10 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 5.5pt; }\n .s11 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 5.5pt; }\n .s12 { color: black; font-family:Arial, sans-serif; font-style: italic; font-weight: bold; text-decoration: none; font-size: 7pt; }\n .s13 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 6pt; }\n .s14 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 8.5pt; }\n .s15 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 8.5pt; }\n .s16 { color: black; font-family:Arial, sans-serif; font-style: italic; font-weight: normal; text-decoration: none; font-size: 6.5pt; }\n .s17 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 6pt; }\n .s18 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 6pt; }\n .s19 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 6.5pt; }\n .s20 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 5.5pt; }\n .s21 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 6.5pt; vertical-align: -3pt; }\n .s22 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 6.5pt; vertical-align: -3pt; }\n .s23 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 6.5pt; vertical-align: 1pt; }\n .s24 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 6.5pt; vertical-align: 1pt; }\n .s25 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 6.5pt; vertical-align: 1pt; }\n .s26 { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: underline; font-size: 6.5pt; }\n p { color: black; font-family:Arial, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 6.5pt; margin:0pt; }\n .s27 { color: black; font-family:"Times New Roman", serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 6.5pt; }\n table, tbody {vertical-align: top; overflow: visible; }\n',
        }}
      />
      <p style={{ textIndent: '0pt', textAlign: 'left' }}>
        <span />
      </p>
      <table border={0} cellSpacing={0} cellPadding={0}>
        <tbody>
          <tr>
            <td>
              <img
                width={77}
                height={64}
                src='data:image/jpg;base64,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'
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p />
      <h1
        style={{
          paddingTop: '3pt',
          paddingLeft: '210pt',
          textIndent: '0pt',
          textAlign: 'center',
        }}
      >
        TAX<span className='s1'> </span>INVOICE
      </h1>
      <p style={{ textIndent: '0pt', textAlign: 'left' }}>
        <br />
      </p>
      <table
        style={{ borderCollapse: 'collapse', marginLeft: '5.765pt' }}
        cellSpacing={0}
      >
        <tbody>
          <tr style={{ height: '18pt' }}>
            <td
              style={{
                width: '325pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
              colSpan={2}
              rowSpan={3}
            >
              <p
                className='s2'
                style={{
                  paddingTop: '2pt',
                  paddingLeft: '60pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                Ambikaa<span className='s3'> </span>Building
                <span className='s3'> </span>Materials
                <span className='s3'> </span>
                Pvt<span className='s3'> </span>Limited
              </p>
              <p
                className='s4'
                style={{
                  paddingLeft: '60pt',
                  paddingRight: '111pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                T.S.1429,Santhai<span className='s5'> </span>Road
                <span className='s5'> </span>,<span className='s5'> </span>
                Mettupatti<span className='s5'> </span>Dindigul
                <span className='s5'> </span>-<span className='s5'> </span>
                624002
              </p>
              <p
                className='s4'
                style={{
                  paddingLeft: '60pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                GSTIN/UIN:<span className='s5'> </span>33AAXCA
                <span className='s5'> </span>3354R1ZW
              </p>
              <p
                className='s4'
                style={{
                  paddingLeft: '60pt',
                  paddingRight: '111pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                State<span className='s5'> </span>Name
                <span className='s5'> </span>:<span className='s5'> </span>Tamil
                <span className='s5'> </span>Nadu
                <span className='s5'> </span>,<span className='s5'> </span>Code
                <span className='s5'> </span>:<span className='s5'> </span>33
                <span className='s5'> </span>Contact
                <span className='s5'> </span>:<span className='s5'> </span>
                9787150990<span className='s5'> </span>
                9150478848
              </p>
              <p
                className='s4'
                style={{
                  paddingLeft: '60pt',
                  textIndent: '0pt',
                  lineHeight: '5pt',
                  textAlign: 'left',
                }}
              >
                E-Mail<span className='s5'> </span>:
                <a
                  href='mailto:ambikaaltd2022@yahoo.com'
                  style={{
                    color: 'black',
                    fontFamily: '"Times New Roman", serif',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    textDecoration: 'none',
                    fontSize: '6.5pt',
                  }}
                  target='_blank'
                  rel='noreferrer'
                >
                  {' '}
                </a>
                <a
                  href='mailto:ambikaaltd2022@yahoo.com'
                  className='s6'
                  target='_blank'
                  rel='noreferrer'
                >
                  ambikaaltd2022@yahoo.com
                </a>
              </p>
            </td>
            <td
              style={{
                width: '19pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              rowSpan={8}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                Invoice<span className='s5'> </span>No.
              </p>
              <p
                className='s7'
                style={{
                  paddingTop: '2pt',
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                PLY/02352/22-23
              </p>
            </td>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                Dated
              </p>
              <p
                className='s7'
                style={{
                  paddingTop: '2pt',
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                7-Feb-23
              </p>
            </td>
          </tr>
          <tr style={{ height: '17pt' }}>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                Delivery<span className='s5'> </span>Note
              </p>
            </td>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                Mode/Terms<span className='s5'> </span>of
                <span className='s5'> </span>Payment
              </p>
            </td>
          </tr>
          <tr style={{ height: '19pt' }}>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                Reference<span className='s5'> </span>No.
                <span className='s5'> </span>&amp;<span className='s5'> </span>
                Date.
              </p>
            </td>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                Other<span className='s5'> </span>References
              </p>
            </td>
          </tr>
          <tr style={{ height: '9pt' }}>
            <td
              style={{
                width: '325pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s4'
                style={{
                  paddingTop: '1pt',
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                Buyer<span className='s5'> </span>(Bill
                <span className='s5'> </span>
                to)
              </p>
            </td>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '5pt',
                  textAlign: 'left',
                }}
              >
                Buyer's<span className='s5'> </span>Order
                <span className='s5'> </span>No.
              </p>
            </td>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '5pt',
                  textAlign: 'left',
                }}
              >
                Dated
              </p>
            </td>
          </tr>
          <tr style={{ height: '5pt' }}>
            <td
              style={{
                width: '325pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
              }}
              colSpan={2}
              rowSpan={3}
            >
              <p
                className='s2'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                ARAVIND-9500757504
              </p>
              <p
                className='s8'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                DINDIGUL.
              </p>
              <p
                className='s8'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                State<span className='s9'> </span>Name
                <span className='s9'></span>:<span className='s9'> </span>Tamil
                <span className='s9'> </span>Nadu,
                <span className='s9'> </span>Code<span className='s9'> </span>:
                <span className='s9'> </span>33
              </p>
            </td>
            <td
              style={{
                width: '98pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '98pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
          </tr>
          <tr style={{ height: '17pt' }}>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                Dispatch<span className='s5'> </span>Doc
                <span className='s5'> </span>No<span className='s5'> </span>.
              </p>
            </td>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                Delivery<span className='s5'> </span>Note
                <span className='s5'> </span>Date
              </p>
            </td>
          </tr>
          <tr style={{ height: '17pt' }}>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                Dispatched<span className='s5'> </span>through
              </p>
            </td>
            <td
              style={{
                width: '98pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={5}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                Destination
              </p>
            </td>
          </tr>
          <tr style={{ height: '60pt' }}>
            <td
              style={{
                width: '325pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
              colSpan={2}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '196pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={10}
            >
              <p
                style={{
                  paddingLeft: '17pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                <span />
              </p>
              <table border={0} cellSpacing={0} cellPadding={0}>
                <tbody>
                  <tr>
                    <td>
                      <img
                        width={84}
                        height={76}
                        src='data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCABMAFQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9QPEviLT/AAj4d1TXdWuVs9K0y1lvbu4YEiKGNC7scc8KpP4V4L4b/a7utS8X+EfCes/D3U/D3iLxA8jGK4uQ1vp0Q06S8iNzLsHlySNBcRCIrkeRJJzGY2k9R8Q/Ez4ZX8F9ouu+K/CdxCxa3u9O1HUbVlJBwySRu3YjBBHaud8PeBvgL4uvXtNC8P8Aw51q7SMyvBp1lYTyKgIBYqikgZIGfcetIDyC4/4KFWdg/hgah8PNX02PxBotrrkFxc3SNDaW809tGWupI1dYQiTtO2SSsXkFgrTbE2PCP7c9l4um8EQWXhOTUJvFf2QW/wDZN810lk1zKVjjuW8lQrrHb6nI+zeiDT3G8l1r1vSPg38IPEFit7pfgbwTqVk5ZVuLPSLOWNirFWAZUIyCCD6EGqj/AAy+CUen6jft4T8ArY6bM1ve3J02xEdrKuNySttwjDcMhsEZHrTA4TxR+2Pa+A/gbonxH8SeHU0+31+WUaPbRX7PHcQrbzXEUrytCpj89ID5SBGdjLCCFy/lr4Z/bR0nXdP+Imr3HhfUbDQvB0KySXLTRmW4Zrma3RQrbUCM0DMJhI0Ow7mkXa4XorTRP2ctQuobW1sPhdc3M7rHFBFDpzvI7HCqoAySSQABVuTwd8AIpNSjfQ/hsj6YSL5GtNPBtMOEPmjHyYchfmxycdaAPPfF/wC3bovgyC9N3oUd5Lp9t592bHVY5IR5kDy2csblATazH7NF9pdUQSXkKDeRL5fTfBn9q21+M3xEuvCNjpFnYXmnWn2y/FxqbGYoXcRy20XkAzQPGbSZZXMQKXkeAWDKOt8Q/Cr4L+ErJbzXPB/gTRrNpBEtxqGmWUEZcgkKGdQMkAnHsaqeGdf+BHgu/e+8Paj8O9CvXjMLXOmT2FvI0ZIJQshBKkqpx04HpQB63R2qvp+o2mr2MF7Y3UN7Z3CCSG4t5BJHIh5DKw4IPqKn65oAXGaKKKAPyN+LFxqPgHwBFrvg34HeEPiZrmsePfF0Wq3us+DBrNxGkOpEQguo3KPncDcTwuB0rvvBmkRaR8Wk1LT/AAfZfD/XNY/Z9fVNR0vwoYfCrR3z6lHvKzMAttIMBfMkyV2jJ4qLx18NviN4O8YeOn0Twh8S9I0SLV7vUpv7H+ONhpdqBc3Dus/2URZhEpbcqN82WxkmvNfFnxI8M+C/B1944bwh8TviPH4o8JP4V8QzeKvGjm/0UTt581tHHcWRmaOPylYXSr5G6Rl+9kUAN8KWPxu+GGg+CfCtpJ4n1iL4f308vibwT4I1p9OvrR9TuRPp32u9R5Yb9JhvfMUZESeYJCpbNdDB4R8eW/xF+LfhwaBf+MdD+KLXFzqvgZ/Flp4en0bV5rrzbiK2S8JF6Y1jSP7bBEYpQCFY7CB6emrfE+DXfGviDT/gTrGg6n4lOgvqlxp/xe0q0lhWzj22cYxGGjWZCQyt/rASBiuR8dWPxE139onwz8RPCPgVfE6+FL59Y8S2/ijxDaWup6TqTealxpMF7dGMnTIDJGYmiRoC7yFHJLAAHS/HjwD8HPhXpmmvq2k6bovxW8LpNEtx4P8Ahvd2OnanNdbGgjhlihkjS8C+UkFx5z+TOzPtJyg5rwZ8d9P1Twy2gyfs1Wvg6XWkXTtX8W+KdJXxFqd15QWY3WpabDbR3l4JZI1zO2EMzFtxZCtY/wCz58XNe+Onwz0z4deO7jxVpnxI8L2uo3+kyeJbu4ki8VAyS3Mrs8yKlvcWiJAtvcySt5DyCRVO3bXuHiC0m8aeCNK8WeANC8Y+JfiDdaLafD3V44fG8WjX9n9kxeSNDqE8QF7J5hKtcQbklVnZTjJoA8I0nwd46uvgT8HLT4utqniuTV/jF4egkvNe8WW/iaw1OAvdxukKo8ixRhSI5I2dt7BjwPlGr8NjqPif9tDUfhzrn7Mnw9sPhnFrOs2UeuL8OUhY21vHcm2k+0svl/OYovmxht3GMis/TNRm1D4da/4b+LHhKXwQnh6xuPiDpc3gLxpZW+lQahp6OILTToLdZksHlE7SEBy7yq8oXkgdjN4bvJtH8HfZfFfxwvNc8d6FY6v4Q0hviq6DWZHt1uL+3Mpg2W/2WFw++baJuiDPFAH2N+xjx+yZ8If+xX0//wBELXs1cr8KfCGieAPhr4Z8N+G7pr7QNJ0+GzsLl5lmaSBECoxdQA2QByBg11XrQAUUfhRQB8YftQ/C7xx8dZtF8HaX4f8ADfw1bxvqV3beJNau2s7vULm10yRLjTJUCSxyzBzFny13mJZDu24JrIl17Q/EfxK1vwN8ZvHGl65qfieyl8CR3GlfDfUNHvHkllDC3j1RxJG0RKyMEDbC2Hz8vM3xY/aR15PHXiXxhFonhWD4W+E5/wCz9N+Kuqad9un8M3282t8jWKut3KJpttqGhEYAfeWkjBr5+g+H3ir4u+IJNV+K3xL8ZaHpPivXDf8Awz8caZ4ikXSWvZhmwMOjb5Li0yn2mQO8kQRR5ZKsckAu+HfGFl+y9r/jnw1qPhqT41vrF/o1pefEHxLrsFxZ3cwZlsGtrSdZHnNoZhG/lSPsaFSTFlQPSdB+BXjvxN+0N46stR8aadZ+Nb/QxDqeheN9KbxJY6rpX212S+tU84R2drJPvCWLM7xeWSchga8n0H9lj4nfAPxlcfDu9utC+JlvqFxBJ4N/4SjSFumaHPm6xc6dJJcsmlyw+ckjM+GndI2QMUrrBZ2fxT/a3/4QrS/GvjzWr7w5pKaFqXjjw34pfw7PYadBczKkN4J0Z9SnWUlnuIXCSGVSsY2MSANl+JXw40rw/wCJfGUyeLviL8LNOjjey8ea/wCNft92JdrA6cljLE13aQXk6NazK6COaOJWbMYBrY01/Gnxa8BeH/Et9pNzofiPU5V/4Qb4d+FNWjtJIfDbQCWyntbiJjHpc4Rpo2unWPzIojb7VMiivnz9qf4NfEu30z4J+F/Eui+FfhZJ8QNVubLWdC8C6Gllbw+Vd28dvNftb3DxXm1ZvNjzt8vzJRnLMR7X4j03W/2avjT4Pgv/ABNO2o+D/AVhaf8ACeadHLFottoySy21vDeaPG7zahIZecxTqAZYn8sLCxYA8Wm/ZI/tT4SfDu+0rx1F4t+CUn2q6jvND0KbSX1zUo7qRY7a9LuWidgLqJNQuEEVui4Y7WGfo/wX8AfiD478F23wz0rxNN4QbwtZ22t6V4x1CFtXv7Cz1ABk0zTdQjlXyxbxW32eSSByk0coARFOD4B8Fk1743/sseNfC3wd07xrB4ctLsaefDV346hidJbi3uCJBcSJBF9jyz+dZhMzNIreYuw590+DfgZvgv8ACCP4nP8AtC+LrSHwpZWmiTeHdZmvdW0jStVhC2moWzWcTj7VCkkgSHycJGUVw8iigD7+8ATaFceCNDl8MWKaZ4daziOn2cdi1isMG0bEFuyoYgBgbCqkdMCugrkPg/8AEA/Fb4WeFPGLaa+jnXdNg1A6fJJ5jW/mIG8sttXJGcZwPpXX9BQAhOKKXFFAH5cfF/8AZK+Evhqy+NlzqHxu1/R/Ed3rEGra/p8NtI2iypc6l5tnby26xFrlgX2ZSU+W5DsqgFa7j4K6vpv7SPjzxl4L8e/DP4X+EvE3hO3udG8OeF9Y8IyX8mn28MkQh3XomFvNEjzSJ5EHlsx+dSq5rqY/hzd23gSbwzqHgfwJrviObxh4k1S01XxjNYahaaHFLfNcRO8HnLIzXCAIBGwaNtpkACkVyPxMn+KniXwrc+OPiXNpxm0LwwdZvYfC2qxfZNJ8tiWWyg+0TPFrCF22aipaFY2KbSxzQA3Qv2i5f21vDXiW90rR/GvhOP4YT2sOoaN4V8VwWVprFpcO6zvcrJbkPFDHZuwiySyyOoySK5XVdG+F/iK28TzfFDwqdH+CXiKAx+CPHJij1jV4EaQSQW2ni3gkk06xW3w8VtNAGiMkgLkttGX8BvhbJ8O/i38cfhx8N9E8XeMvBl5J4XvNQ17T/FGn2d3ZxtDLcSJPJIEE8chlmR0RCSiMp5YE+4a58Sbn9lbxT4n8ReGPgVqWmeCYbUxR6d4e8T6Pb6VfRiY7dTi02JvNM8qhFL7S3loikfLQB5R+1Za/FiL4kJqHhnxrrvjubw0P7Q+J/g+w1F9H8PxackMMsENta3Mh81J7VLjzlSS4+fduVN4Q878Y/jpbfDjRPDekwyaxa+FPEPhew8f+HbWBpX17SLm9Yx/2Tot/HH5NhbwW0eArQN+685AR5i7e7/aE/aT0z4kfACDXkvtJ1bxL4XaSTVfGEfhy/sLG082XMOmC3uVFxLFqCRfZpfLZk+QmUqjLWWP2ubv4w/stWept8ENf0fSvC9taQDxD4J1iy0270iZUhjMmmQOGniiZZREGRGHlSMm44bABzXhvW/hr8XP2bvD0s3gbR9A8Y+K9SbwVq3hnQ9IOn6Lot7fSXEdnrjW8sbGaa2hRCJFl+UTyLuQtgdz4H+HXgXwP8UfAEPhnxZPoHijwtZTaL4RvNRgZvDGtavb2bQa7KdPRI5YpPLAczG4VZnkjKtKEIb56+G3hj9q678f3nh3xToF144uPDmu6bD4kXWvFFo9/LZTRrO+jLcT3eyS1u4WUyQAOrsqbhlcV1/7bvxH8MftJ/ASYaL4E1bw14j+D19Jo+oaPZ6hax2fhsSXVvaRLKNm24RzbvHGLVj5Zjy3ykZAP07+AnjnVfib8FPA/izXLWCy1jWtHtr+7traNo4opZIwzKquzMACTwST713leefs7WniKw+BHgG28X3E134pi0W1TVJ7i8W7kkuRGPMZplZhIS2fmDEHrk16JigBCKKXiigD8d/jh4p034NeA4PEel/B7wJ491zxD4+8Xwahe+J/D7X8qpBqJEQDI6EcSMPmJ4AxjFdjp+oaL4J8Tah410r4eeEtHm1L9nSXxBqPhq30rytKuLp9QjLrLAGDMhCqpBbOABmvss/sRaFa6lq1zpHxN+KPhy31PULnVJdP0TxS9rapPPK0spSNUwoLuT/Wo7L9hLwWLzxPe6v4t8deK77xD4cn8K3V34h1z7bLHYyypKyRM8eVIdMjqBubjmgD5HPwJ8SfCS9vdH8FeHNWtfh1bwQ3kfiPwv4s0zTZ9WWWPzrlNYgYmS9hgd5I4okjjYRGRcuXDVrfDb9mlviR8XfCfjrw34qu9A+JHh+GPWNG0/wARW0l7oFx4fcOtrLYW8YiksrYySTCOzlnM0Srh153H6u0L9gj4I+HvEHiHWLXwPpn2vVorWOMPZW5TTWgjKLLZjy/3EjE72Ycs6q3atvxh+zDD4vGiBvih8TtH/srTIdMH9j+KJLb7WI937+fC/vJ23fNIeWwPSgD5G/aA+MXw+8aX2qan428c6lonwk8ZTW19oD+I7K61Gx1W60xUVls7GOIS2VulzhbqO4XdchwYXQAtXM/FT9sHR9C0K10ZPCR8F6o3hSw/s3xL4EbyNQ1zRBN/oyaa8ayHTI2ZTMIbsMViDxlQ7Bq/Rjx78HfAvxVXTx408H6H4t/s8OLQ63p8V2YN+3fs8xTt3bEzjrtHpXP+H/2aPh14I8S6Xrvg/wAM2Hgi+s5HaX/hGbWKwS/RkZPJuhGg82MFg4QnAdEbqKAPy4+Fvin4p+AvgcnxJW68LfFTxhr07+NL3RvHunXE9/pkWkma2F+t09zGhkjVI9kYzMRINgIVq3vCnw6+J3jL9m34t618SLPwR8KvA/ju5sfFl/4mg0iXVdS1FLy+F3Aqpa3TypEkjxhVliZgszc5DEfeHjv9hT4c/Er4Wx+CPEV1r+pRtqUeq3mvz3yvq+ozxpLHEbq5aMmUJHMY13D5URFBwtM0/wDYa8JaH4Z0zR9F8a+P9BeyiFs2qaVr5t767tlVVgtp5lTMkMChhEh4jDuB96gD1L4E32map8GfBd3osmlzaRPpNtJaSaJYSWNk0RjBUwW8hLxR46IxJAwDXdVznw58B6Z8LvAOgeENGadtJ0Oxi0+1Ny4eXyo1CruYAAnA5OBXR0AFFGKKAP/Z'
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p />
            </td>
          </tr>
          <tr style={{ height: '17pt' }}>
            <td
              style={{
                width: '12pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                Sl
              </p>
              <p
                className='s8'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                No.
              </p>
            </td>
            <td
              style={{
                width: '337pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s10'
                style={{
                  paddingLeft: '133pt',
                  paddingRight: '142pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'center',
                }}
              >
                Description<span className='s11'> </span>of
                <span className='s11'> </span>Goods
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p
                className='s10'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'left',
                }}
              >
                HSN/SAC
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s10'
                style={{
                  paddingLeft: '3pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'left',
                }}
              >
                Quantity
              </p>
            </td>
            <td
              style={{
                width: '27pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p
                className='s10'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'left',
                }}
              >
                Disc.<span className='s11'> </span>%
              </p>
            </td>
            <td
              style={{
                width: '26pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s10'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'left',
                }}
              >
                DAmt
              </p>
            </td>
            <td
              style={{
                width: '58pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s10'
                style={{
                  paddingLeft: '13pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'left',
                }}
              >
                Amount
              </p>
            </td>
          </tr>
          <tr style={{ height: '14pt' }}>
            <td
              style={{
                width: '12pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s8'
                style={{
                  paddingTop: '5pt',
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                1
              </p>
            </td>
            <td
              style={{
                width: '259pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
              }}
            >
              <p
                className='s7'
                style={{
                  paddingTop: '5pt',
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                KRISHNA-TEAK-INT<span className='s9'> </span>17MM
                <span className='s9'> </span>8X4
              </p>
            </td>
            <td
              style={{
                width: '78pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s4'
                style={{
                  paddingTop: '4pt',
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                441113
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s7'
                style={{
                  paddingTop: '5pt',
                  paddingLeft: '16pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                2<span className='s9'> </span>No
              </p>
            </td>
            <td
              style={{
                width: '27pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
              rowSpan={6}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '26pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              rowSpan={6}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '58pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s7'
                style={{
                  paddingTop: '5pt',
                  paddingLeft: '17pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                3,416.94
              </p>
            </td>
          </tr>
          <tr style={{ height: '13pt' }}>
            <td
              style={{
                width: '12pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s8'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                2
              </p>
            </td>
            <td
              style={{
                width: '259pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
              }}
            >
              <p
                className='s7'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                KRISHNA-TEAK-INT<span className='s9'> </span>17MM
                <span className='s9'> </span>4X4<span className='s9'> </span>BIT
              </p>
            </td>
            <td
              style={{
                width: '78pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                441299
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s7'
                style={{
                  paddingLeft: '16pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                1<span className='s9'> </span>No
              </p>
            </td>
            <td
              style={{
                width: '58pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s7'
                style={{
                  paddingLeft: '26pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                854.24
              </p>
            </td>
          </tr>
          <tr style={{ height: '11pt' }}>
            <td
              style={{
                width: '12pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '259pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '78pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '58pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s8'
                style={{
                  paddingLeft: '18pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                4,271.18
              </p>
            </td>
          </tr>
          <tr style={{ height: '11pt' }}>
            <td
              style={{
                width: '12pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '259pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '78pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s12'
                style={{
                  paddingTop: '2pt',
                  paddingLeft: '4pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                CGST<span className='s9'> </span>(Out)
                <span className='s9'> </span>
                9%
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '58pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s7'
                style={{
                  paddingTop: '2pt',
                  paddingLeft: '26pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                384.40
              </p>
            </td>
          </tr>
          <tr style={{ height: '9pt' }}>
            <td
              style={{
                width: '12pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '259pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '78pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s12'
                style={{
                  paddingLeft: '5pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                SGST<span className='s9'> </span>(Out)
                <span className='s9'> </span>
                9%
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '58pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s7'
                style={{
                  paddingLeft: '26pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                384.40
              </p>
            </td>
          </tr>
          <tr style={{ height: '263pt' }}>
            <td
              style={{
                width: '12pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '259pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '78pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s12'
                style={{
                  paddingLeft: '27pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                Round<span className='s9'> </span>Off
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '58pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s7'
                style={{
                  paddingLeft: '37pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                0.02
              </p>
            </td>
          </tr>
          <tr style={{ height: '11pt' }}>
            <td
              style={{
                width: '12pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '337pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s13'
                style={{
                  paddingRight: '2pt',
                  textIndent: '0pt',
                  textAlign: 'right',
                }}
              >
                Total
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '40pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s7'
                style={{
                  paddingLeft: '16pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                3<span className='s9'> </span>No
              </p>
            </td>
            <td
              style={{
                width: '27pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '26pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '58pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s14'
                style={{
                  paddingLeft: '3pt',
                  textIndent: '0pt',
                  lineHeight: '10pt',
                  textAlign: 'left',
                }}
              >
                {' '}
                <span className='s15'>5,040.00</span>
              </p>
            </td>
          </tr>
          <tr style={{ height: '21pt' }}>
            <td
              style={{
                width: '271pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                Amount<span className='s5'> </span>Chargeable
                <span className='s5'> </span>(in<span className='s5'> </span>
                words
                <span className='s5'> </span>)
              </p>
              <p
                className='s7'
                style={{
                  paddingTop: '2pt',
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                INR<span className='s9'> </span>Five
                <span className='s9'> </span>
                Thousand<span className='s9'> </span>Forty
                <span className='s9'> </span>Only
              </p>
            </td>
            <td
              style={{
                width: '78pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '4pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '27pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '9pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '36pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '4pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '13pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '9pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '5pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '26pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '14pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '44pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s16'
                style={{
                  paddingRight: '1pt',
                  textIndent: '0pt',
                  textAlign: 'right',
                }}
              >
                E.<span className='s5'> </span>&amp;
                <span className='s5'> </span>O.E
              </p>
            </td>
          </tr>
          <tr style={{ height: '8pt' }}>
            <td
              style={{
                width: '309pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
              rowSpan={2}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '137pt',
                  paddingRight: '141pt',
                  textIndent: '0pt',
                  textAlign: 'center',
                }}
              >
                HSN/SAC
              </p>
            </td>
            <td
              style={{
                width: '44pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              rowSpan={2}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '6pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                Taxable
              </p>
              <p
                className='s13'
                style={{
                  paddingLeft: '10pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'left',
                }}
              >
                Value
              </p>
            </td>
            <td
              style={{
                width: '72pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '12pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'left',
                }}
              >
                Central<span className='s5'> </span>Tax
              </p>
            </td>
            <td
              style={{
                width: '71pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={6}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '16pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'left',
                }}
              >
                State<span className='s5'> </span>Tax
              </p>
            </td>
            <td
              style={{
                width: '44pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              rowSpan={2}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '1pt',
                  textIndent: '0pt',
                  textAlign: 'center',
                }}
              >
                Total
              </p>
              <p
                className='s13'
                style={{
                  paddingLeft: '1pt',
                  paddingRight: '2pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'center',
                }}
              >
                Tax<span className='s17'> </span>Amount
              </p>
            </td>
          </tr>
          <tr style={{ height: '7pt' }}>
            <td
              style={{
                width: '27pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s13'
                style={{
                  paddingRight: '3pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'right',
                }}
              >
                Rate
              </p>
            </td>
            <td
              style={{
                width: '45pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s13'
                style={{
                  paddingLeft: '7pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'left',
                }}
              >
                Amount
              </p>
            </td>
            <td
              style={{
                width: '26pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p
                className='s13'
                style={{
                  paddingLeft: '3pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'left',
                }}
              >
                Rate
              </p>
            </td>
            <td
              style={{
                width: '45pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p
                className='s13'
                style={{
                  paddingLeft: '7pt',
                  textIndent: '0pt',
                  lineHeight: '6pt',
                  textAlign: 'left',
                }}
              >
                Amount
              </p>
            </td>
          </tr>
          <tr style={{ height: '8pt' }}>
            <td
              style={{
                width: '309pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                441113
              </p>
            </td>
            <td
              style={{
                width: '44pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '7pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                3,416.94
              </p>
            </td>
            <td
              style={{
                width: '27pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s4'
                style={{
                  paddingRight: '1pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'right',
                }}
              >
                9%
              </p>
            </td>
            <td
              style={{
                width: '45pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '15pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                307.52
              </p>
            </td>
            <td
              style={{
                width: '26pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '11pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                9%
              </p>
            </td>
            <td
              style={{
                width: '45pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '15pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                307.52
              </p>
            </td>
            <td
              style={{
                width: '44pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s4'
                style={{
                  paddingRight: '1pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'right',
                }}
              >
                615.04
              </p>
            </td>
          </tr>
          <tr style={{ height: '8pt' }}>
            <td
              style={{
                width: '309pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                441299
              </p>
            </td>
            <td
              style={{
                width: '44pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '15pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                854.24
              </p>
            </td>
            <td
              style={{
                width: '27pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s4'
                style={{
                  paddingRight: '1pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'right',
                }}
              >
                9%
              </p>
            </td>
            <td
              style={{
                width: '45pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '20pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                76.88
              </p>
            </td>
            <td
              style={{
                width: '26pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '11pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                9%
              </p>
            </td>
            <td
              style={{
                width: '45pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p
                className='s4'
                style={{
                  paddingLeft: '20pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                76.88
              </p>
            </td>
            <td
              style={{
                width: '44pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s4'
                style={{
                  paddingRight: '1pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'right',
                }}
              >
                153.76
              </p>
            </td>
          </tr>
          <tr style={{ height: '9pt' }}>
            <td
              style={{
                width: '309pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s18'
                style={{
                  paddingRight: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'right',
                }}
              >
                Total
              </p>
            </td>
            <td
              style={{
                width: '44pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s18'
                style={{
                  paddingLeft: '7pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                4,271.18
              </p>
            </td>
            <td
              style={{
                width: '27pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '45pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={2}
            >
              <p
                className='s18'
                style={{
                  paddingLeft: '15pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                384.40
              </p>
            </td>
            <td
              style={{
                width: '26pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
            </td>
            <td
              style={{
                width: '45pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={3}
            >
              <p
                className='s18'
                style={{
                  paddingLeft: '15pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                384.40
              </p>
            </td>
            <td
              style={{
                width: '44pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s18'
                style={{
                  paddingRight: '1pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'right',
                }}
              >
                768.80
              </p>
            </td>
          </tr>
          <tr style={{ height: '72pt' }}>
            <td
              style={{
                width: '540pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={13}
            >
              <p
                className='s7'
                style={{
                  paddingTop: '4pt',
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                <span className='s4'>Tax</span>
                <span className='s5'> </span>
                <span className='s4'>Amount</span>
                <span className='s5'> </span>
                <span className='s4'>(in</span>
                <span className='s5'> </span>
                <span className='s4'>words</span>
                <span className='s5'> </span>
                <span className='s4'>)</span>
                <span className='s5'> </span>
                <span className='s4'>:</span>
                <span className='s5'> </span>INR<span className='s9'> </span>
                Seven
                <span className='s9'> </span>Hundred
                <span className='s9'> </span>
                Sixty<span className='s9'> </span>Eight
                <span className='s9'> </span>
                and<span className='s9'> </span>Eighty
                <span className='s9'> </span>
                paise<span className='s9'> </span>Only
              </p>
              <p
                className='s19'
                style={{
                  paddingLeft: '2pt',
                  paddingRight: '405pt',
                  textIndent: '0pt',
                  lineHeight: '106%',
                  textAlign: 'left',
                }}
              >
                Receivable<span className='s5'> </span>:
                <span className='s5'> </span>1,470.00
                <span className='s5'> </span>Dr
                <span className='s5'> </span>Bill<span className='s5'> </span>
                Amt.
                <span className='s5'> </span>:<span className='s5'></span>
                5,040.00
                <span className='s5'> </span>Dr
              </p>
              <p
                style={{
                  paddingLeft: '79pt',
                  textIndent: '0pt',
                  lineHeight: '1pt',
                  textAlign: 'left',
                }}
              />
              <p
                className='s20'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                Net<span className='s11'> </span>Receivable
                <span className='s11'></span>:<span className='s11'></span>
                6,510.00
                <span className='s11'> </span>Dr<span className='s11'> </span>
                <span className='s21'>Company's</span>
                <span className='s22'> </span>
                <span className='s21'>Bank</span>
                <span className='s22'> </span>
                <span className='s21'>Details</span>
              </p>
              <p
                className='s5'
                style={{
                  paddingLeft: '272pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                <span className='s4'>A/c</span>{' '}
                <span className='s4'>Holder</span>{' '}
                <span className='s4'>'s</span> <span className='s4'>Name</span>{' '}
                <span className='s4'>:</span>{' '}
                <span className='s19'>Ambikaa</span>{' '}
                <span className='s19'>Building</span>{' '}
                <span className='s19'>Materials</span>{' '}
                <span className='s19'>Pvt</span>{' '}
                <span className='s19'>Limited</span>
              </p>
              <p
                className='s5'
                style={{
                  paddingLeft: '272pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                <span className='s4'>Bank</span>{' '}
                <span className='s4'>Name</span> <span className='s4'>:</span>{' '}
                <span className='s19'>State</span>{' '}
                <span className='s19'>Bank</span>{' '}
                <span className='s19'>of</span>{' '}
                <span className='s19'>India</span>
              </p>
              <p
                className='s4'
                style={{
                  paddingLeft: '272pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                A/c<span className='s5'> </span>No.<span className='s5'> </span>
                <b>41199400563</b>
              </p>
              <p
                className='s5'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '8pt',
                  textAlign: 'left',
                }}
              >
                <span className='s23'>Company's</span>
                <span className='s24'> </span>
                <span className='s23'>PAN</span>
                <span className='s24'> </span>
                <span className='s23'>:</span>
                <span className='s24'> </span>
                <span className='s25'>AAXCA3354R</span>
                <span className='s24'> </span>
                <span className='s4'>Branch</span>{' '}
                <span className='s4'>&amp;</span>{' '}
                <span className='s4'>IFS</span> <span className='s4'>Code</span>{' '}
                <span className='s4'>:</span> <span className='s19'>SME</span>{' '}
                <span className='s19'>Branch,</span>{' '}
                <span className='s19'>Dindigul</span>{' '}
                <span className='s19'>&amp;</span>{' '}
                <span className='s19'>SBIN0012758</span>
              </p>
            </td>
          </tr>
          <tr style={{ height: '32pt' }}>
            <td
              style={{
                width: '271pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
            >
              <p
                className='s26'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'left',
                }}
              >
                Declaration
              </p>
              <p
                className='s4'
                style={{
                  paddingLeft: '2pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                We<span className='s5'> </span>declare
                <span className='s5'> </span>
                that<span className='s5'> </span>this
                <span className='s5'> </span>
                invoice<span className='s5'> </span>shows
                <span className='s5'> </span>the<span className='s5'> </span>
                actual
                <span className='s5'> </span>price<span className='s5'> </span>
                of
                <span className='s5'> </span>the<span className='s5'> </span>
                goods
                <span className='s5'> </span>described
                <span className='s5'> </span>
                and<span className='s5'> </span>that
                <span className='s5'> </span>all
                <span className='s5'> </span>particulars
                <span className='s5'> </span>are<span className='s5'> </span>
                true
                <span className='s5'> </span>and<span className='s5'> </span>
                correct
                <span className='s5'> </span>.
              </p>
            </td>
            <td
              style={{
                width: '269pt',
                borderTopStyle: 'solid',
                borderTopWidth: '1pt',
                borderLeftStyle: 'solid',
                borderLeftWidth: '1pt',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1pt',
                borderRightStyle: 'solid',
                borderRightWidth: '1pt',
              }}
              colSpan={12}
            >
              <p
                className='s19'
                style={{
                  paddingLeft: '132pt',
                  textIndent: '0pt',
                  textAlign: 'left',
                }}
              >
                for<span className='s5'> </span>Ambikaa
                <span className='s5'> </span>
                Building<span className='s5'> </span>Materials
                <span className='s5'> </span>Pvt<span className='s5'> </span>
                Limited
              </p>
              <p style={{ textIndent: '0pt', textAlign: 'left' }}>
                <br />
              </p>
              <p
                className='s4'
                style={{
                  paddingRight: '4pt',
                  textIndent: '0pt',
                  lineHeight: '7pt',
                  textAlign: 'right',
                }}
              >
                Authorised<span className='s5'> </span>Signatory
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ textIndent: '0pt', textAlign: 'left' }} />
      <p
        style={{
          paddingTop: '2pt',
          paddingLeft: '210pt',
          textIndent: '0pt',
          textAlign: 'center',
        }}
      >
        SUBJECT<span className='s27'> </span>TO<span className='s27'> </span>
        DINDIGUL<span className='s27'> </span>JURISDICTION
      </p>
      <p
        style={{
          paddingTop: '4pt',
          paddingLeft: '206pt',
          textIndent: '0pt',
          textAlign: 'center',
        }}
      >
        This<span className='s27'> </span>is<span className='s27'> </span>a
        <span className='s27'> </span>Computer<span className='s27'> </span>
        Generated<span className='s27'> </span>Invoice
      </p>
    </>
  );
};

export default test;
