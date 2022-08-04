interface LandingPageSectionProps {
  isDividerHidden?: boolean;
}
const LandingPageSection: React.FunctionComponent<LandingPageSectionProps> = ({
  children,
  isDividerHidden,
}): JSX.Element => {
  return (
    <div
      className={` border-b-gray-100 dark:border-b-gray-600 py-10 space-y-4 ${
        isDividerHidden ? 'border-b-0' : 'border-b'
      }`}
    >
      {children}
    </div>
  );
};

export default LandingPageSection;
