import { useEffect, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { InputSearch } from './component/input-search/input-search';
import { StatusTab } from './component/status-tab/status-tab';
import { ClipBoardItem } from './component/clip-board-item/clip-board-item';
import { css } from '@emotion/react';

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
      <ul
        style={css`
          display: flex;
          flex-direction: column;
          gap: 5px;
        `}
      >
        {filteredList.map((item, idx) => (
          <ClipBoardItem
            key={idx}
            text={item}
            handleCopy={handleCopy}
            handleDelete={handleDelete}
          />
        ))}
      </ul>
    </Container>
  );
}
