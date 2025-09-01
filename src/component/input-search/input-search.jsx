import { Input } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { IconButton } from '@chakra-ui/react';

export function InputSearch({ value, setValue }) {
  return (
    <div>
      <Input
        size="sm"
        placeholder="Search…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        css={css`
          margin-top: 10px;
        `}
      />
    </div>
  );
}
