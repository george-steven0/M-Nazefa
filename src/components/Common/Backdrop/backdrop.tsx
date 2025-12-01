interface backdrop {
  open: boolean;
  toggle: () => void;
}

const Backdrop = ({ open, toggle }: backdrop) => {
  return !open ? (
    <div
      onClick={toggle}
      className="fixed inset-0 w-full h-full bg-[rgba(0,0,0,.3)] backdrop-blur-xs -z-1"
    ></div>
  ) : (
    ""
  );
};

export default Backdrop;
