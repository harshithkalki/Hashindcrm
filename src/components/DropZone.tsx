import { Group, Text, useMantineTheme } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons';
import type { DropzoneProps } from '@mantine/dropzone';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';

export default function DropzoneComp(props: Omit<DropzoneProps, 'children'>) {
  const theme = useMantineTheme();

  return (
    <Dropzone
      h={220}
      accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
      {...props}
    >
      <Group
        position='center'
        spacing='lg'
        style={{ minHeight: 220, pointerEvents: 'none' }}
      >
        <Dropzone.Accept>
          <IconUpload size={50} stroke={1.5} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size={50} stroke={1.5} />
        </Dropzone.Idle>
        <div>
          <Text size='xl' inline>
            Drag images, PDFs here or click to select files
          </Text>
          <Text size='sm' color='dimmed' inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
