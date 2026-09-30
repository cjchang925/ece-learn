import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

const WishCard = ({ wishText, status }) => {
  const isCompleted = status === "completed";

  return (
    <div className="surface-card p-6 flex flex-col transition-transform duration-300 ease-apple hover:-translate-y-0.5">
      <div className="w-10 h-10 bg-gradient-to-b from-[#ffb340] to-[#ff9500] rounded-xl flex items-center justify-center text-white mb-4 shadow-sm">
        <FontAwesomeIcon icon={faLightbulb} />
      </div>
      <p className="text-label leading-relaxed text-[15px] flex-1">{wishText}</p>
      <div className="mt-5 pt-4 border-t border-separator flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${isCompleted ? "bg-[#34c759]" : "bg-[#ff9f0a]"}`}
        />
        <span className="text-footnote text-label-2">
          {isCompleted ? "已完成" : "處理中"}
        </span>
      </div>
    </div>
  );
};

export default WishCard;
