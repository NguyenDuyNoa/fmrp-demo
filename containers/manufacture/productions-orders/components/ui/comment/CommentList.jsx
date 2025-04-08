import React from "react";
import CommentItem from "./CommentItem";

const CommentList = ({ data }) => {
    return (
        <React.Fragment>
            {
                data && data?.map(item => (
                    <CommentItem key={item.id} item={item} />
                ))
            }
        </React.Fragment>
    );
};

export default CommentList
