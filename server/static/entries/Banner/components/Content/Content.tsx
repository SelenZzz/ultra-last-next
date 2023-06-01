import { Container, Text } from '@mantine/core';
import { Fade } from '@/animations';
import { MantineProvider } from '@/providers';

import styles from './Content.module.css';

export const Content = () => {
  return (
    <MantineProvider>
      <Container>
        <Fade>
          <Text fz={32} align="center">
            This container is independent application
          </Text>
        </Fade>
        <ul className={styles.circles}>
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
      </Container>
    </MantineProvider>
  );
};
