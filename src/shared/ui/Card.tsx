import type { ReactNode } from 'react';
import { cx } from './cx';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card(props: Props) {
  return (
    <div
      className={cx(
        'bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300',
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
