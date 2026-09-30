import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faInbox } from "@fortawesome/free-solid-svg-icons";
import { EXTERNAL_URLS } from "../../constants";
import WishCard from "./WishCard.jsx";

const SPREADSHEET_JSON_PREFIX_LENGTH = 47;
const SPREADSHEET_JSON_SUFFIX_LENGTH = 2;

function extractWishItemsFromSpreadsheet(spreadsheetData) {
  return spreadsheetData.table.rows.map((row) => row.c[1]["v"]);
}

const WishCardList = () => {
  const [wishItems, setWishItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(EXTERNAL_URLS.WISH_SPREADSHEET)
      .then((response) => response.text())
      .then((text) =>
        JSON.parse(
          text
            .substring(SPREADSHEET_JSON_PREFIX_LENGTH)
            .slice(0, -SPREADSHEET_JSON_SUFFIX_LENGTH),
        ),
      )
      .then((jsonData) => {
        setWishItems(extractWishItemsFromSpreadsheet(jsonData));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch wishes:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas px-4 pt-10 pb-16 md:pt-14">
        <div className="max-w-5xl mx-auto text-center py-20 flex flex-col items-center">
          <h1 className="text-title-1 text-label mb-8">願望清單</h1>
          <div className="activity-indicator mb-3" role="status" aria-label="Loading" />
          <p className="text-label-2 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-4 pt-10 pb-16 md:pt-14">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-12 animate-fade-up">
        <h1 className="text-title-1 text-label mb-3">願望清單</h1>
        <p className="text-label-2 text-lg mb-7">
          在這裡許願你想要的考古題，我們會盡力幫你找到
        </p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdJdgLgRz1sczuDvSGdXdMrS4Y3aROl3HwEKD4zSUmNQCOvKQ/viewform"
          target="_blank"
          rel="noreferrer"
          className="btn-filled"
        >
          <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
          提交願望
        </a>
      </div>

      {/* Cards Grid */}
      {wishItems.length > 0 ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-up">
          {wishItems.map((wishText, index) => (
            <WishCard key={index} wishText={wishText} status="pending" />
          ))}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto text-center py-20 text-label-3">
          <FontAwesomeIcon icon={faInbox} className="text-5xl mb-4 opacity-60" />
          <p>目前沒有願望</p>
        </div>
      )}
    </div>
  );
};

export default WishCardList;
