import type { TextProps } from '@mantine/core';
import {
  createStyles,
  Title,
  Text,
  Group,
  Image,
  Divider,
  Flex,
  Stack,
  Table,
} from '@mantine/core';
import type { DetailedHTMLProps, ThHTMLAttributes } from 'react';
import { useMemo } from 'react';
import type { ZSale } from '@/zobjs/sale';
import type { z } from 'zod';
import type { Company } from '@/zobjs/company';
import type { Warehouse } from '@/zobjs/warehouse';
import type { RouterOutputs } from '@/utils/trpc';

const useStyles = createStyles((theme) => ({
  invoice: {
    backgroundColor: theme.white,

    color: theme.black,
    padding: theme.spacing.md,
  },

  info: {
    display: 'flex',
    width: '100%',
  },

  leftInfo: {
    borderRight: `1px solid ${theme.colors.gray[6]}`,
    flex: 1,
  },

  invoiceInfo: {},

  main: {
    marginTop: theme.spacing.md,
    border: `1px solid ${theme.colors.gray[6]}`,
  },

  infoBox: {
    borderBottom: `1px solid ${theme.colors.gray[6]}`,
    '&:last-child': {
      borderBottom: 'none',
    },
    height: '100%',
  },

  cell: {
    padding: theme.spacing.xs,
    color: theme.black,
  },
}));

type InfoBox = {
  title: string;
  value: string;
  titleProps?: TextProps;
  valueProps?: TextProps;
};

type InvoiceInfo = {
  right: InfoBox;
  left: InfoBox;
};

const GroupInfoBox = ({ left, right }: InvoiceInfo) => {
  const { classes, theme } = useStyles();
  return (
    <Group className={classes.infoBox}>
      <div
        style={{
          width: 200,
          borderRight: `1px solid ${theme.colors.gray[6]}`,
          padding: theme.spacing.xs,
          height: '100%',
        }}
      >
        <Text weight={500} size='sm' {...left.titleProps}>
          {left.title}
        </Text>
        <Text weight={700} {...left.valueProps}>
          {left.value}
        </Text>
      </div>
      <div
        style={{
          width: 200,
          padding: theme.spacing.xs,
          height: '100%',
        }}
      >
        <Text weight={500} size='sm' {...right.titleProps}>
          {right.title}
        </Text>
        <Text weight={700} {...right.valueProps}>
          {right.value}
        </Text>
      </div>
    </Group>
  );
};

const Th = ({
  children,
  ...props
}: DetailedHTMLProps<
  ThHTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>) => {
  const { theme, classes } = useStyles();
  return (
    <th
      className={classes.cell}
      {...props}
      style={{
        color: theme.black,
        ...props.style,
      }}
    >
      {children}
    </th>
  );
};

const Td = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) => {
  const { theme, classes } = useStyles();
  return (
    <td
      className={classes.cell}
      {...props}
      style={{
        color: theme.black,
        ...props.style,
      }}
    >
      {children}
    </td>
  );
};

export default function Invoice({
  invoiceRef,
  data,
}: {
  invoiceRef: React.RefObject<HTMLDivElement>;
  data: RouterOutputs['saleRouter']['getInvoice'];
}) {
  const { classes, theme } = useStyles();
  const invoiceInfo = useMemo(
    () =>
      [
        {
          left: {
            title: 'Invoice No',
            value: `Invoice #${data.invoiceId}`,
          },
          right: {
            title: 'Date',
            value: data.date.toDateString(),
          },
        },
        {
          left: {
            title: 'Delivery Note',
            value: data.notes,
            valueProps: {
              color: 'gray.7',
              weight: 500,
              size: 'sm',
            },
          },
          right: {
            title: 'Mode/Terms of Payment',
            value: data.paymentMode ?? 'Cash',
          },
        },
        {
          left: {
            title: 'Reference No. & Date',
            value: '',
          },
          right: {
            title: 'Other Reference',
            value: '',
          },
        },
        {
          left: {
            title: 'Buyer Order No',
            value: '',
          },
          right: {
            title: 'Dated',
            value: '',
          },
        },
        {
          left: {
            title: 'Despatch Document No',
            value: '',
          },
          right: {
            title: 'Despatched Date',
            value: '',
          },
        },
        {
          left: {
            title: 'Despatched Through',
            value: '',
          },
          right: {
            title: 'Destination',
            value: '',
          },
        },
      ] as InvoiceInfo[],
    []
  );

  // console.log(data);
  const netPrice = data.products.reduce(
    (acc, curr) => acc + curr.salePrice * curr.quantity,
    0
  );

  return (
    <div className={classes.invoice} ref={invoiceRef}>
      <Title
        order={3}
        style={{
          textAlign: 'center',
        }}
      >
        Invoice
      </Title>

      <Flex className={classes.main} direction='column'>
        <div className={classes.info}>
          <div className={classes.leftInfo}>
            <Group>
              <Image
                width={100}
                height={100}
                alt='Logo'
                withPlaceholder
                styles={{
                  placeholder: {
                    backgroundColor: 'white',
                    color: 'black',
                  },
                }}
              />
              <div>
                <Text weight={700} size={'lg'}>
                  {data.warehouse?.name ?? data.company?.name}
                </Text>
                <Text weight={500}>
                  {data.warehouse?.addressline1 ?? data.company?.addressline1}
                </Text>
                <Text weight={500}>
                  {data.warehouse?.addressline2 ?? data.company?.addressline2}
                </Text>
                <Text weight={500}>
                  {data.warehouse?.city ?? data.company?.city},
                  {data.warehouse?.state ?? data.company?.state},
                  {data.warehouse?.pincode ?? data.company?.pincode}
                </Text>
                <Text weight={500}>
                  {data.warehouse?.numbers?.[0] ?? data.company?.numbers?.[0]}
                </Text>
                <Text weight={500}>
                  {data.warehouse?.email ?? data.company?.email}
                </Text>
              </div>
            </Group>
            <Divider />
            <div>
              <Text weight={500}>Buyer Info</Text>
              <Text weight={700} size='xl'>
                Name
              </Text>
              <Text weight={500}>Address</Text>
            </div>
          </div>
          <div>
            <Flex className={classes.invoiceInfo} h='100%'>
              <Stack spacing={0}>
                {invoiceInfo.map((info, index) => (
                  <GroupInfoBox key={index} {...info} />
                ))}
              </Stack>
            </Flex>
          </div>
        </div>
        <Table withBorder withColumnBorders>
          <thead>
            <tr>
              <Th
                style={{
                  width: '5%',
                }}
              >
                SI No.
              </Th>
              <Th>Description of Goods</Th>
              <Th>HSN/SAC</Th>
              <Th>Quantity</Th>
              <Th>Disc. %</Th>
              <Th>Amount</Th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product, index) => {
              return (
                <tr key={index}>
                  <Td
                    style={{
                      width: '5%',
                    }}
                  >
                    {index + 1}
                  </Td>
                  <Td>{product.name}</Td>
                  <Td>{}</Td>
                  <Td>{product.quantity}</Td>
                  <Td>{data.discount}</Td>
                  <Td>
                    {product.salePrice -
                      (netPrice * (data.discount / 100)) / data.products.length}
                  </Td>
                </tr>
              );
            })}
            <tr>
              <Td
                style={{
                  width: '5%',
                }}
              ></Td>
              <Td
                style={{
                  textAlign: 'right',
                }}
              >
                Total
              </Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td>{netPrice - netPrice * (data.discount / 100)}</Td>
            </tr>
          </tbody>
        </Table>
        <Table withBorder withColumnBorders>
          <thead>
            <tr>
              <Th rowSpan={2}>HSN/SAC</Th>
              <Th rowSpan={2}>Taxable</Th>

              <Th colSpan={2} align='center'>
                Central Tax
              </Th>
              <Th colSpan={2} align='center'>
                State Tax
              </Th>
              <Th rowSpan={2} align='center'>
                amount
              </Th>
            </tr>
            <tr>
              <Th>Rate</Th>
              <Th>Amt.</Th>
              <Th>Rate</Th>
              <Th>Amt.</Th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product, index) => {
              const totalPrice =
                product.salePrice -
                (netPrice * (data.discount / 100)) / data.products.length;
              return (
                <tr key={index}>
                  <Td>{product.itemCode}</Td>
                  <Td>{totalPrice}</Td>
                  <Td>{product.tax / 2}</Td>
                  <Td>{(totalPrice * (product.tax / 2)) / 100}</Td>
                  <Td>{product.tax / 2}</Td>
                  <Td>{(totalPrice * (product.tax / 2)) / 100}</Td>
                  <Td>{totalPrice * (product.tax / 100)}</Td>
                </tr>
              );
            })}
          </tbody>
          <tfoot style={{ borderTop: '2px solid black' }}>
            <tr>
              <Td
                style={{
                  textAlign: 'right',
                }}
              >
                Total
              </Td>
              <Td>{netPrice - netPrice * (data.discount / 100)}</Td>
              <Td></Td>
              <Td>
                {data.products.reduce(
                  (acc, curr) =>
                    acc +
                    ((curr.salePrice -
                      (netPrice * (data.discount / 100)) /
                        data.products.length) *
                      (curr.tax / 2)) /
                      100,
                  0
                )}
              </Td>
              <Td></Td>
              <Td>
                {data.products.reduce(
                  (acc, curr) =>
                    acc +
                    ((curr.salePrice -
                      (netPrice * (data.discount / 100)) /
                        data.products.length) *
                      (curr.tax / 2)) /
                      100,
                  0
                )}
              </Td>
              <Td>
                {data.products.reduce(
                  (acc, curr) =>
                    acc +
                    ((curr.salePrice -
                      (netPrice * (data.discount / 100)) /
                        data.products.length) *
                      curr.tax) /
                      100,
                  0
                )}
              </Td>
            </tr>
          </tfoot>
        </Table>
        <Group mt={'md'} mb={'xs'} style={{ justifyContent: 'space-between' }}>
          <div>
            <Text weight={400}>{`Total Amount : ${(
              netPrice -
              netPrice * (data.discount / 100)
            ).toFixed(2)}`}</Text>

            <Text weight={400}>{`Total Tax : ${data.products
              .reduce(
                (acc, curr) =>
                  acc +
                  ((curr.salePrice -
                    (netPrice * (data.discount / 100)) / data.products.length) *
                    curr.tax) /
                    100,
                0
              )
              .toFixed(2)}`}</Text>

            <Text weight={400}>{`Amount Chargeable : ${data.products
              .reduce(
                (acc, curr) =>
                  acc +
                  curr.salePrice -
                  (netPrice * (data.discount / 100)) / data.products.length +
                  (curr.salePrice -
                    (netPrice * (data.discount / 100)) / data.products.length) *
                    (curr.tax / 100),
                0
              )
              .toFixed(2)}`}</Text>
          </div>
          <div>
            <Text weight={400}>
              BankName : {data.warehouse?.bankName || 'XXXX'}
            </Text>
            <Text weight={400}>
              Account Number : {data.warehouse?.accountNumber || 'XXXX'}
            </Text>
            <Text weight={400}>
              IFSC Code : {data.warehouse?.ifscCode || 'XXXX'}
            </Text>
            <Text weight={400}>Pan: {data.warehouse?.pan} </Text>
          </div>
        </Group>
        <div style={{ justifyContent: 'space-between' }}>
          <div style={{ width: '50%' }}>
            <Text weight={400}>Terms and conditions</Text>
            <Text weight={100}>1. Goods once sold will not be taken back.</Text>
            <Text weight={100}>
              2. Interest @ 24% p.a. will be charged if the payment is not made
              within the stipulated time.
            </Text>
          </div>
        </div>
      </Flex>
    </div>
  );
}
function convert(otherNumbers: string) {
  throw new Error('Function not implemented.');
}
