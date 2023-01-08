import { Menu, Group, useMantineTheme } from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import UserButton from "../UserButton";
import { useRouter } from "next/router";

export function UserMenu() {
  const theme = useMantineTheme();
  const router = useRouter();
  return (
    <Group position="center">
      <Menu withArrow width={300} position="bottom" transition="pop">
        <Menu.Target>
          <UserButton
            image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
            name="Harriette Spoonlicker"
            email="hspoonlicker@outlook.com"
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<IconLogout size={14} stroke={1.5} />}
            onClick={() => {
              router.push("/login");
            }}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
