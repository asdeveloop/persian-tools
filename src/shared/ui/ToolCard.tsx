import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cx } from './cx';
import Card from './Card';

type Props = {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
};

export default function ToolCard(props: Props) {
  return (
    <Card className={cx(
      'group hover:shadow-lg transition-all duration-200 hover:-translate-y-1',
      'border-slate-200 hover:border-red-300',
      props.className
    )}>
      <Link to={props.to} className="block p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={cx(
            'flex h-16 w-16 items-center justify-center rounded-xl transition-all duration-200',
            'bg-slate-100 group-hover:bg-red-100'
          )}>
            <div className="transition-transform duration-200 group-hover:scale-110">
              {props.icon}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors">
              {props.title}
            </div>
            <div className="text-sm text-slate-600 leading-relaxed">
              {props.description}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
