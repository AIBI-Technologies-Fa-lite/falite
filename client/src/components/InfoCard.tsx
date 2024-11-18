const InfoCard = ({ title, value, bgColor, textColor, onClick }) => {
  return (
    <div className={`p-4 ${textColor} ${bgColor} rounded-lg shadow-lg cursor-pointer`} onClick={onClick}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-5xl">{value}</p>
    </div>
  );
};
export default InfoCard;
