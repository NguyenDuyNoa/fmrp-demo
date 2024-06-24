import React, { useState } from "react";

const ExpandableContent = ({ content, maxChar }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const maxChars = maxChar || 60;
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      {isExpanded ? (
        <div>{content}</div>
      ) : (
        <div>
          {content?.slice(0, maxChars)}
          {content?.length > maxChars && <span className="">...</span>}
        </div>
      )}
      {maxChar != 30 && content?.length > maxChars && (
        <button
          onClick={toggleExpand.bind(this)}
          className="text-blue-400 text-[10px] hover:text-blue-600 transition-all ease-linear font-semibold animate-bounce-custom"
        >
          {isExpanded ? "Rút gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
};
export default ExpandableContent;
