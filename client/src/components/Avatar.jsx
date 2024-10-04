const Avatar = ({ name, userId,online }) => {
  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-violet-400",
    "bg-pink-400",
    "bg-teal-400",
    "bg-purple-400",
    "bg-indigo-400",
    "bg-pink-500",
  ];
  const userIdBase10 = parseInt(userId, 16);
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center text-xl relative shadow-sm shadow-stone-600 ${
        colors[userIdBase10 % colors.length]
      }`}
    >
      {online && <div className="w-2 h-2  absolute bottom-[2px] right-[2px] bg-[#0f0] shadow-sm shadow-black rounded-full"></div>}
      <div className="w-full text-center">
        {name[0].toUpperCase()}
      </div>
    </div>
  );
};

export default Avatar;
