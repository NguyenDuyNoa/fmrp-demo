import React, { useState } from "react";

const ReferenceComponent = ({ content, maxChar }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const maxChars = maxChar;

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div>
            {isExpanded ? (
                <div>{content}</div>
            ) : (
                <div>
                    {content.slice(0, maxChars)}
                    {content.length > maxChars && (
                        <button onClick={toggleExpand}>{isExpanded ? "Rút gọn" : "Xem thêm"}</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReferenceComponent;
