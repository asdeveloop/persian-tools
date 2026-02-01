type Props = {
  title: string;
  description?: string;
};

export default function PdfToolPlaceholder({ title, description }: Props) {
  return (
    <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-slate-600">
        {description ?? 'این ابزار در حال توسعه است و به زودی فعال می شود.'}
      </p>
    </div>
  );
}
