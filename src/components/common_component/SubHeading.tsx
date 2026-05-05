type Props = {
  text: string;
};

const SubHeading = ({ text }: Props) => {
  return (
    <h2 className="text-base md:text-lg font-archivo font-semibold text-[#212B36]">
      {text}
    </h2>
  );
};

export default SubHeading;