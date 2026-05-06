type Props = {
    text: string;
};

const Heading = ({ text }: Props) => {
    return (
        <h1 className="text-lg md:text-xl font-inter font-bold text-[#212B36]">{text}</h1>
    );
};

export default Heading;