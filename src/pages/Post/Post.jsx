import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PostContainer,
  PostItem,
  FooterItem,
  Header,
  CommentForm,
} from "./Post.styles";
import { AiFillDelete } from "react-icons/ai";
import { BiHide } from "react-icons/bi";
import { AiFillLike } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { useGetPost } from "../../hooks/usePost";
import { UserContext } from "../../contexts/UserContext";
import { useDeletePost, useUpdatePost } from "../../hooks/usePost";
import { Button } from "react-bootstrap";
import {
  useGetCommentsByPostId,
  useAddComment,
  useUpdateComment,
  useDeleteComment,
} from "../../hooks/useComment";
import {
  useGetLikesPost,
  useAddLikePost,
  useDeleteLikePost,
} from "../../hooks/useLikePost";
import CommentItem from "../../components/CommentItem/CommentItem";
import { ReligionContext } from "../../contexts/ReligionContext";
function Post() {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [commentEdit, setCommentEdit] = useState(null);
  const { user } = useContext(UserContext);
  const { religion } = useContext(ReligionContext);
  const { id } = useParams();
  const { data, isLoading, isError } = useGetPost(id);
  const { data: comments } = useGetCommentsByPostId(id);
  const { data: likes } = useGetLikesPost(id);
  const { mutate: deletePost } = useDeletePost(religion);
  const { mutate: updatePost } = useUpdatePost(religion);
  const { mutate: addComment } = useAddComment();
  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: addLikePost } = useAddLikePost();
  const { mutate: deleteLikePost } = useDeleteLikePost();
  const [isEditComment, setIsEditComment] = useState(false);
  const [isLike, setIsLike] = useState(false);

  useEffect(() => {
    if (likes) {
      const like = likes.find((like) => like.userId === user?.id);
      if (like) {
        setIsLike(true);
      } else {
        setIsLike(false);
      }
    }
  }, [likes, user?.id]);

  const onDelete = () => {
    if (window.confirm("คุณต้องการลบกระทู้นี้หรือไม่?")) {
      deletePost(data);
      navigate("/");
    }
  };

  const onHide = () => {
    if (window.confirm("คุณต้องการซ่อนกระทู้นี้หรือไม่?")) {
      let newItem = { ...data };
      newItem.isHide = true;
      updatePost(newItem);
    }
  };

  const onSubmitComment = (e) => {
    e.preventDefault();
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนสร้างความคิดเห็น");
      navigate("/login");
    }
    if (isEditComment) {
      if (comment.trim() === "") return;
      let newComment = {
        ...commentEdit,
        comment: comment,
      };
      updateComment(newComment);
    } else {
      if (comment.trim() === "") return;
      let newComment = {
        postId: id,
        userId: user.id,
        comment,
      };
      addComment(newComment);
    }
    setComment("");
    setIsEditComment(false);
  };

  const onEditClick = (comment) => {
    setIsEditComment(true);
    setCommentEdit(comment);
    setComment(comment.comment);
  };

  const onDeleteComment = (comment) => {
    if (window.confirm("คุณต้องการลบความคิดเห็นนี้หรือไม่?")) {
      deleteComment(comment);
    }
  };

  const onCancelCommentClick = () => {
    setIsEditComment(false);
    setComment("");
  };

  const onLikePost = () => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนเพื่อกดถูกใจ");
    } else {
      if (!isLike) {
        addLikePost({
          postId: id,
          userId: user.id,
        });
      } else {
        let like = likes.find((like) => like.userId === user.id);
        deleteLikePost(like);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  if (data?.isHide) return <h2>กระทู้นี้ถูกซ่อนแล้ว</h2>;

  return (
    <PostContainer>
      <PostItem>
        <Header>
          <h4>{data?.title}</h4>
          {user && user.id === data?.userId && (
            <div className="icons">
              <BiHide onClick={onHide} />
              <AiFillEdit onClick={() => navigate(`/edit-post/${id}`)} />
              <AiFillDelete onClick={onDelete} />
            </div>
          )}
          {user && user.id !== data?.userId && user.role === "admin" && (
            <div className="icons">
              <BiHide onClick={onHide} />
              <AiFillDelete onClick={onDelete} />
            </div>
          )}
        </Header>
        {data?.picture && <img alt="post" src={data?.picture} />}

        <p style={{ whiteSpace: "pre-line" }}>{data?.description}</p>
        <FooterItem>
          <AiFillLike onClick={onLikePost} color={isLike ? "#000" : "#fff"} />
          <span>{likes?.length}</span>
          <span>|</span>
          <span
            className="user-id"
            onClick={() => navigate(`/user/${data?.userId}`)}
          >
            สมาชิกหมายเลข: {data?.userId}
          </span>
        </FooterItem>
      </PostItem>
      {comments?.map((comment) => (
        <CommentItem
          key={comment.id}
          user={user}
          comment={comment}
          onEditClick={onEditClick}
          onDeleteComment={onDeleteComment}
        />
      ))}

      <CommentForm onSubmit={onSubmitComment}>
        <label style={{ marginTop: "10px" }}>
          <strong>แสดงความคิดเห็น</strong>
        </label>
        <textarea
          type="text"
          className="form-control"
          id="questionDetail"
          aria-describedby=""
          placeholder=""
          rows="2"
          style={{ backgroundColor: "#c4c4c4" }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div>
          <Button variant="warning" type="submit">
            {isEditComment ? "บันทึก" : "แสดงความคิดเห็น"}
          </Button>
          {isEditComment && (
            <Button variant="danger" onClick={onCancelCommentClick}>
              ยกเลิก
            </Button>
          )}
        </div>
      </CommentForm>
    </PostContainer>
  );
}

export default Post;
