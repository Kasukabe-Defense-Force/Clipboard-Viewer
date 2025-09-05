// app.jsx
import { useEffect, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { InputSearch } from './component/input-search/input-search';
import { StatusTab } from './component/status-tab/status-tab';
import { ClipBoardItem } from './component/clip-board-item/clip-board-item';
import { css } from '@emotion/react';
import { useGlobalContext } from './context/global-context';
import Lottie from 'lottie-react';
import emptyAnim from './assets/animation/Loading.json';
import { Box } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';

const Container = styled.div`
  width: 400px;
  min-height: 400px;
`;

export default function App() {
  const { tab } = useGlobalContext();
  const [copiedList, setCopiedList] = useState([]); // [string]
  const [bookmarks, setBookmarks] = useState(new Set()); // Set<string>
  const [value, setValue] = useState('');

  // 초기 로드
  useEffect(() => {
    chrome.storage.local.get({ copiedList: [], bookmarks: [] }, (data) => {
      setCopiedList(data.copiedList);
      setBookmarks(new Set(data.bookmarks));
    });

    const listener = (msg) => {
      if (msg.type === 'copied') {
        setCopiedList((prev) => {
          const next = [msg.text, ...prev].slice(0, 50);
          chrome.storage.local.set({ copiedList: next });
          return next;
        });
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  // 검색 필터링
  const searched = useMemo(() => {
    if (!value) return copiedList;
    const q = value.toLowerCase();
    return copiedList.filter((item) => item.toLowerCase().includes(q));
  }, [value, copiedList]);

  // 탭 반영 + 정렬(북마크 상단, 원래 순서 보존)
  const viewList = useMemo(() => {
    if (tab === 'bookmark') {
      return searched.filter((it) => bookmarks.has(it));
    }
    // all: 북마크 우선으로 파티셔닝
    const top = [];
    const rest = [];
    for (const it of searched) {
      (bookmarks.has(it) ? top : rest).push(it);
    }
    return [...top, ...rest];
  }, [tab, searched, bookmarks]);

  // 북마크 토글
  const toggleBookmark = (item) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      chrome.storage.local.set({ bookmarks: Array.from(next) });
      return next;
    });
  };

  // 삭제: 리스트 & 스토리지 & 북마크 동시 정리
  const handleDelete = async (item) => {
    try {
      await navigator.clipboard.writeText(''); // 클립보드 비우기
      setCopiedList((prev) => {
        const newList = prev.filter((i) => i !== item);
        chrome.storage.local.set({ copiedList: newList });
        return newList;
      });
      setBookmarks((prev) => {
        if (!prev.has(item)) return prev;
        const next = new Set(prev);
        next.delete(item);
        chrome.storage.local.set({ bookmarks: Array.from(next) });
        return next;
      });
    } catch (err) {
      console.error('클립보드/삭제 실패:', err);
    }
  };

  // 복사
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
      <Box
        style={{
          minHeight: '75vh',
        }}
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: ${viewList.length === 0 ? 'center' : 'unset'};
          gap: 5px;
        `}
      >
        {viewList.length === 0 ? (
          <Box
            css={css`
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 20px;
              height: 100%;
            `}
          >
            <Lottie
              animationData={emptyAnim}
              loop
              autoplay
              style={{ width: 75, height: 75 }}
            />
            <Text as={'p'}>No copied text available</Text>
          </Box>
        ) : (
          viewList?.map((item, idx) => (
            <ClipBoardItem
              key={idx}
              text={item}
              isBookmarked={bookmarks.has(item)}
              onToggleBookmark={() => toggleBookmark(item)}
              handleCopy={handleCopy}
              handleDelete={handleDelete}
            />
          ))
        )}
      </Box>
    </Container>
  );
}
