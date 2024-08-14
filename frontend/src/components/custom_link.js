import Link from "next/link";

export const CustomLink = ({ href, children, disabled, ...props }) => {
  if (disabled) {
    return <span {...props}>{children}</span>;
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
};
