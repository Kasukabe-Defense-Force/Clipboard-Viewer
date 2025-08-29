import { Input } from '@chakra-ui/react';
import { css } from '@emotion/react';

export function InputSearch({ value, setValue }) {
  return (
    <Input
      size="sm"
      placeholder="Search…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      css={css`
        margin-top: 10px;
      `}
    />
  );
}
