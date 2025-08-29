import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

export function StatusTab() {
  return (
    <Tabs size="sm">
      <TabList>
        <Tab>All</Tab>
        <Tab>BookMark</Tab>
      </TabList>
    </Tabs>
  );
}
