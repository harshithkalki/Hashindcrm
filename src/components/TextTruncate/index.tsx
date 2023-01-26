import type { TextProps } from "@mantine/core";
import { Text } from "@mantine/core";

const Truncate = ({
  text,
  maxLength = 20,
  textProps,
}: {
  text: string;
  maxLength: number;
  textProps?: TextProps;
}) => {
  const truncatedText =
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  return (
    <Text {...textProps} style={{ wordBreak: "break-word" }}>
      {truncatedText}
    </Text>
  );
};

export default Truncate;
