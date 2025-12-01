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
      className={`title-wrapper flex flex-wrap md:flex-nowrap items-center justify-between ${className}`}
    >
      <span
        className={`
          basis-full md:basis-auto
          ${
            !subTitle
              ? "text-[clamp(2rem,2.7vw,4rem)] font-bold"
              : "font-semibold text-[clamp(2rem,2vw,4rem)]"
          } capitalize text-black`}
      >
        {title}
      </span>

      <div className="basis-full md:basis-auto flex justify-end">
        {typeof component === "function" ? component() : component}
      </div>
    </div>
  );
};

export default Title;
