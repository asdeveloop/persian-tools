type IconProps = {
  className?: string;
};

export function IconCalculator(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M8 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 11h2m4 0h2M8 15h2m4 0h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconMoney(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 7h16v10H4V7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M7 10h0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 14h0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function IconPdf(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M14 3v4h4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 16h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 13h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconImage(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        fill="currentColor"
      />
      <path
        d="M4 17l5-5 4 4 3-3 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
