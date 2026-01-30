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
      <div className="min-h-screen bg-slate-100 p-4 md:p-6">
        <div className="max-w-5xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">願望清單</h1>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
          願望清單
        </h1>
        <p className="text-slate-500 mb-6">
          在這裡許願你想要的考古題，我們會盡力幫你找到
        </p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdJdgLgRz1sczuDvSGdXdMrS4Y3aROl3HwEKD4zSUmNQCOvKQ/viewform"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
          提交願望
        </a>
      </div>

      {/* Cards Grid */}
      {wishItems.length > 0 ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishItems.map((wishText, index) => (
            <WishCard key={index} wishText={wishText} status="pending" />
          ))}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto text-center py-20 text-slate-400">
          <FontAwesomeIcon icon={faInbox} className="text-5xl mb-4" />
          <p>目前沒有願望</p>
        </div>
      )}
    </div>
  );
};

export default WishCardList;
