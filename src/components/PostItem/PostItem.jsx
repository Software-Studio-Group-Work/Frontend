import React from "react";
import { PostItemContainer } from "./PostItem.styles";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import { BiHide } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function PostItem({
  bg,
  item,
  role,
  userId,
  type,
  onDelete,
  onHide,
  onEdit,
  onShow,
}) {
  const navigate = useNavigate();

  return (
    <PostItemContainer bg={bg}>
      <div className={`${type}-item-header`}>
        {type === "post" ? (
          <h5 onClick={() => navigate(`/${type}/${item.id}`)}>{item?.title}</h5>
        ) : (
          <h5>{item?.title}</h5>
        )}

        {userId && role === "admin" && userId !== item.userId && (
          <div className="post-item-icons">
            {type === "announcement" && (
              <>
                <AiFillEdit onClick={onEdit} />
                <AiFillDelete onClick={onDelete} />
              </>
            )}
            {type === "post" && (
              <>
                {item.isHide ? (
                  <AiFillEye onClick={onShow} />
                ) : (
                  <BiHide onClick={onHide} />
                )}

                <AiFillDelete onClick={onDelete} />
              </>
            )}
          </div>
        )}

        {userId && userId === item.userId && (
          <div className="post-item-icons">
            {type === "post" && (
              <>
                <AiFillEdit onClick={onEdit} />
                {item.isHide ? (
                  <AiFillEye onClick={onShow} />
                ) : (
                  <BiHide onClick={onHide} />
                )}
                <AiFillDelete onClick={onDelete} />
              </>
            )}
          </div>
        )}
      </div>

      {item?.description.length > 120 ? (
        <p>{item?.description.slice(0, 120)}...</p>
      ) : (
        <p>{item?.description}</p>
      )}
    </PostItemContainer>
  );
}

export default PostItem;
