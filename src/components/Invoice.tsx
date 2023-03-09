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
import { DetailedHTMLProps, ThHTMLAttributes } from 'react';

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

const invoiceInfo: InvoiceInfo[] = [
  {
    left: {
      title: 'Invoice No',
      value: '123456',
    },
    right: {
      title: 'Date',
      value: '12/12/2020',
    },
  },
  {
    left: {
      title: 'Delivery Note',
      value: 'dfsadf df asf fasdf /n dfdsfa df ds',
      valueProps: {
        color: 'gray.7',
        weight: 500,
        size: 'sm',
      },
    },
    right: {
      title: 'Mode/Terms of Payment',
      value: 'Cash',
    },
  },
  {
    left: {
      title: 'Reference No. & Date',
      value: '123456',
    },
    right: {
      title: 'Other Reference',
      value: '123456',
    },
  },
  {
    left: {
      title: 'Buyer Order No',
      value: '123456',
    },
    right: {
      title: 'Dated',
      value: '123456',
    },
  },
  {
    left: {
      title: 'Despatch Document No',
      value: '123456',
    },
    right: {
      title: 'Despatched Date',
      value: '123456',
    },
  },
  {
    left: {
      title: 'Despatched Through',
      value: '123456',
    },
    right: {
      title: 'Destination',
      value: '123456',
    },
  },
];

const GroupInfoBox = ({ left, right }: InvoiceInfo) => {
  const { classes, theme } = useStyles();
  return (
    <Group className={classes.infoBox}>
      <div
        style={{
          width: 200,
          borderRight: `1px solid ${theme.colors.gray[6]}`,
          padding: theme.spacing.xs,
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

const someData = [
  {
    name: 'Product 1',
    description: 'Description 1',
    quantity: 1,
    hsn: '123456',
    disc: 0,
    amount: 100,
  },
  {
    name: 'Product 2',
    description: 'Description 2',
    quantity: 1,
    hsn: '123456',
    disc: 0,
    amount: 100,
  },
];

export default function Invoice({
  invoiceRef,
}: {
  invoiceRef: React.RefObject<HTMLDivElement>;
}) {
  const { classes, theme } = useStyles();
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
                  Company Name
                </Text>
                <Text weight={500}>Address</Text>
                <Text weight={500}>City, State, Zip</Text>
                <Text weight={500}>Phone</Text>
                <Text weight={500}>Email</Text>
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
            <Flex className={classes.invoiceInfo}>
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
            {someData.map((data, index) => (
              <tr key={index}>
                <Td
                  style={{
                    width: '5%',
                  }}
                >
                  {index + 1}
                </Td>
                <Td>{data.name}</Td>
                <Td>{data.hsn}</Td>
                <Td>{data.quantity}</Td>
                <Td>{data.disc}</Td>
                <Td>{data.amount}</Td>
              </tr>
            ))}
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
              <Td>{someData.reduce((acc, curr) => acc + curr.amount, 0)}</Td>
            </tr>
          </tbody>
        </Table>
        <Table withBorder withColumnBorders>
          <thead>
            {/* <tr>
              <Th>HSN/SAC</Th>
              <Th>Taxable</Th>
              <Th>Central Tax</Th>
              <Th>State Tax</Th>
              <Th>Integrated Tax</Th>
              <Th>Total</Th>
            </tr>
            <tr>
              <Th></Th>
              <Th></Th>
              <Th colSpan={2}>Rate</Th>
              <Th colSpan={2}>Sp</Th>
            </tr> */}
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
            <tr>
              <Td
                style={{
                  textAlign: 'right',
                }}
              >
                Total
              </Td>
              <Td>100</Td>
              <Td>0</Td>
              <Td>0</Td>
              <Td>0</Td>
              <Td>0</Td>
              <Td>100</Td>
            </tr>
          </tbody>
        </Table>
      </Flex>
    </div>
  );
}
