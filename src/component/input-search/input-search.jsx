import { Input } from '@chakra-ui/react';
import { css } from '@emotion/react';

export function InputSearch({ value, onChange }) {
  return (
    <Input
      size="sm"
      placeholder="Search…"
      value={value}
      onChange={onChange}
      css={css`
        margin-top: 10px;
      `}
    />
  );
}
