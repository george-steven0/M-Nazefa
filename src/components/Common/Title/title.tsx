import type { JSX, ReactElement } from "react";

type titleProps = {
  title: string | JSX.Element;
  subTitle?: boolean;
  className?: string;
  component?:
    | JSX.Element
    | ReactElement
    | React.ReactNode
    | (() => JSX.Element);
};

const Title = ({
  title,
  component,
  subTitle = false,
  className,
}: titleProps) => {
  return (
    <div
      className={`title-wrapper flex items-center justify-between ${className}`}
    >
      <span
        className={`${
          !subTitle
            ? "text-[clamp(2rem,2.7vw,4rem)] font-bold"
            : "font-semibold text-[clamp(2rem,2vw,4rem)]"
        } capitalize text-black`}
      >
        {title}
      </span>

      <div>{typeof component === "function" ? component() : component}</div>
    </div>
  );
};

export default Title;
