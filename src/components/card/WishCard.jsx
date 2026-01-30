import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

const WishCard = ({ wishText, status }) => {
  const isCompleted = status === "completed";

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl mb-4">
        <FontAwesomeIcon icon={faLightbulb} />
      </div>
      <p className="text-slate-700 leading-relaxed flex-1">{wishText}</p>
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-amber-400"}`}
        />
        <span className="text-sm text-slate-400">
          {isCompleted ? "已完成" : "處理中"}
        </span>
      </div>
    </div>
  );
};

export default WishCard;
