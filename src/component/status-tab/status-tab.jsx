// component/status-tab/status-tab.jsx
import { Tabs, TabList, Tab } from '@chakra-ui/react';
import { useGlobalContext } from '../../context/global-context';

export function StatusTab() {
  const { tab, setTab } = useGlobalContext();
  const index = tab === 'bookmark' ? 1 : 0;

  return (
    <Tabs
      size="sm"
      index={index}
      onChange={(i) => setTab(i === 1 ? 'bookmark' : 'all')}
    >
      <TabList>
        <Tab fontWeight={'bold'}>All</Tab>
        <Tab fontWeight={'bold'}>BookMark</Tab>
      </TabList>
    </Tabs>
  );
}
