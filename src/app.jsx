import { useEffect, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { InputSearch } from './component/input-search/input-search';
import { StatusTab } from './component/status-tab/status-tab';

const Container = styled.div`
  width: 400px;
  min-height: 400px;
`;

export default function App() {
  const [copiedList, setCopiedList] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    chrome.storage.local.get({ copiedList: [] }, (data) => {
      setCopiedList(data.copiedList);
    });

    const listener = (msg) => {
      if (msg.type === 'copied') {
        setCopiedList((prev) => [msg.text, ...prev].slice(0, 50));
      }
    };
    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const filteredList = useMemo(() => {
    if (!value) return copiedList;
    return copiedList.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
  }, [value, copiedList]);

  // 삭제 버튼: 클립보드와 리스트에서 제거
  const handleDelete = async (item) => {
    try {
      await navigator.clipboard.writeText(''); // 클립보드 삭제
      const newList = copiedList.filter((i) => i !== item);
      setCopiedList(newList);
      chrome.storage.local.set({ copiedList: newList });
    } catch (err) {
      console.error('클립보드 삭제 실패:', err);
    }
  };

  // 복사 버튼: 해당 아이템 클립보드에 복사
  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item);
      console.log(`클립보드에 복사됨: ${item}`);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  return (
    <Container
      style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px' }}
    >
      <StatusTab />
      <InputSearch value={value} setValue={setValue} />
      <ul>
        {filteredList.map((item, idx) => (
          <li
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <span>{item}</span>
            <div>
              <button onClick={() => handleCopy(item)}>복사</button>
              <button onClick={() => handleDelete(item)}>삭제</button>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
