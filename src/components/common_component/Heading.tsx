type Props = {
    text: string;
};

const Heading = ({ text }: Props) => {
    return (
        <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#111827]">{text}</h1>
    );
};

export default Heading;