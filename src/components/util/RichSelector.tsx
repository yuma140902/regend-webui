import { Select, Typography } from 'antd';
import type { JSX } from 'react';

export type RichSelectorOption<T> = {
  value: T;
  title: string;
  label: JSX.Element | string;
};

type Props<T> = {
  title: string;
  defaultValue: T;
  handleChange: (newValue: T) => void;
  options: RichSelectorOption<T>[];
};

export function RichSelector<T extends string | number | null>({
  title,
  defaultValue,
  handleChange,
  options,
}: Props<T>) {
  return (
    <>
      <Typography.Text>{`${title}: `}</Typography.Text>
      <Select
        style={{ minWidth: 300 }}
        defaultValue={defaultValue}
        onChange={handleChange}
        optionLabelProp="title"
        options={options}
      />
    </>
  );
}
