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
    <div className="flex items-start gap-1 flex-col">
      <h1
        className={`md:text-2xl text-xl font-normal text-gray-800 md:mb-2 mb-1 ${titleClassName}`}
      >
        {title}
      </h1>
      <p className={`text-(--text-color-gray-2) text-sm ${subtitleClassName}`}>
        {subtitle}
      </p>
    </div>
  );
};

export default TitleSubtitle;
