import type { ReactNode } from 'react';
import { cx } from './cx';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Container(props: Props) {
  return <div className={cx('mx-auto w-full max-w-6xl px-4', props.className)}>{props.children}</div>;
}
