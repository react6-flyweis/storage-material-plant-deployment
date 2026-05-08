type Props = {
    text: string;
};

const Heading = ({ text }: Props) => {
    return (
        <h1 className="text-lg md:text-2xl font-inter font-medium text-[#111827]">{text}</h1>
    );
};

export default Heading;