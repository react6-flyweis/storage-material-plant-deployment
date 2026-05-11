type TitleSubtitleProps = {
  title: string;
  subtitle: string;
  titleClassName?: string;
  subtitleClassName?: string;
  widthClass?:string;
};

const TitleSubtitle: React.FC<TitleSubtitleProps> = ({
  title,
  subtitle,
  titleClassName = "",
  subtitleClassName = "",
  widthClass="lg:max-w-3/6 max-w-auto"
}) => {
  return (
    <div className={`flex items-start gap-1 flex-col ${widthClass}`}>
      <h1
        className={`md:text-2xl text-xl font-normal text-[#111827] md:mb-2 mb-1 ${titleClassName}`}
      >
        {title}
      </h1>
      <p
        className={`text-(--text-color-gray-2) md:text-base font-normal text-sm font-inter ${subtitleClassName}`}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default TitleSubtitle;
