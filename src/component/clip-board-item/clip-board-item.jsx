import { CloseButton, Flex, Icon, Text, useToast } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { useState } from 'react';
import { CopyIcon } from '@chakra-ui/icons';

export function ClipBoardItem({
  text,
  handleDelete,
  handleCopy,
  isBookmarked,
  onToggleBookmark,
}) {
  const [hovered, setHovered] = useState(false);
  const toast = useToast();

  const filled = isBookmarked || hovered;

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      gap={5}
      css={css`
        border-bottom: 0.5px solid #e2e8f0;
        padding: 5px 0;
      `}
    >
      {/* 북마크 토글 아이콘 */}
      <Icon
        viewBox="0 0 24 24"
        role="button"
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        onClick={onToggleBookmark}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        css={css`
          cursor: pointer;
          flex-shrink: 0;
        `}
      >
        <path
          fill={filled ? '#FFD700' : 'none'}
          stroke="#FFD700"
          strokeWidth="2"
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </Icon>

      {/* 본문 텍스트 + 복사 */}
      <Text
        textStyle="xs"
        css={css`
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        `}
      >
        <CopyIcon
          css={css`
            cursor: pointer;
            margin-bottom: 2px;
            margin-right: 5px;
          `}
          onClick={() => {
            toast({
              title: 'Copy Success.',
              status: 'success',
              duration: 1500,
              isClosable: true,
            });
            handleCopy(text);
          }}
        />
        {text}
      </Text>

      {/* 삭제 버튼 */}
      <Flex
        gap={1}
        css={css`
          padding: 0 4px;
        `}
      >
        <CloseButton
          size="sm"
          css={css`
            svg {
              width: 7px;
            }
          `}
          color="#bbb"
          onClick={() => handleDelete(text)}
        />
      </Flex>
    </Flex>
  );
}
