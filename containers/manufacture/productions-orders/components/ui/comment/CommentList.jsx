import React from "react";
import CommentItem from "./CommentItem";

const CommentList = ({ data, currentUser  }) => {
    return (
        <React.Fragment>
            {
                data && data?.map(item => (
                    <CommentItem
                        key={item.id}
                        item={item}
                        currentUser={currentUser}
                    />
                ))
            }
        </React.Fragment>
    );
};

export default CommentList
