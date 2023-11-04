import { Select, Typography } from 'antd';
import { JSX } from 'react';

export type RichSelectorOption<T> = {
  value: T;
  title: JSX.Element | string;
  label: JSX.Element | string;
};

type Props<T> = {
  title: string;
  defaultValue: T;
  handleChange: (newValue: T) => void;
  options: RichSelectorOption<T>[];
};

export function RichSelector<T>({
  title,
  defaultValue,
  handleChange,
  options,
}: Props<T>) {
  return (
    <>
      <Typography.Text>{title + ': '}</Typography.Text>
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
