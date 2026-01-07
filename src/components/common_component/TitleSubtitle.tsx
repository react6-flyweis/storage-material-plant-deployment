type TitleSubtitleProps = {
  title: string;
  subtitle: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

const TitleSubtitle: React.FC<TitleSubtitleProps> = ({
  title,
  subtitle,
  titleClassName = "",
  subtitleClassName = "",
}) => {
  return (
    <div className="flex items-start gap-1 flex-col lg:max-w-3/6 max-w-auto">
      <h1
        className={`lg:text-3xl md:text-2xl text-xl font-normal text-[#111827] md:mb-2 mb-1 ${titleClassName}`}
      >
        {title}
      </h1>
      <p
        className={`text-[#4B5563]) md:text-base text-sm ${subtitleClassName}`}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default TitleSubtitle;
