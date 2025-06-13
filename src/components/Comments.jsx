import React, { useState, useEffect } from "react";
import {
  List,
  Avatar,
  Form,
  Button,
  Input,
  Tooltip,
  message,
  Card,
  Skeleton,
  Divider,
  Space,
  Popover,
} from "antd";
import {
  LikeOutlined,
  LikeFilled,
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  DeleteOutlined,
  CommentOutlined,
  SendOutlined,
  SmileOutlined,
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../../database/db";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import EmojiPicker from "emoji-picker-react";

const { TextArea } = Input;

const FormatButton = ({ icon, onClick, tooltip }) => (
  <Tooltip title={tooltip}>
    <Button
      type="text"
      icon={icon}
      onClick={onClick}
      className="text-gray-500 hover:text-blue-500"
    />
  </Tooltip>
);

const Editor = ({
  onChange,
  onSubmit,
  submitting,
  value,
  placeholder = "Viết bình luận của bạn...",
  showButton = true,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = React.useRef(null);

  const handleFormat = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let prefix = "";
    let suffix = "";

    switch (format) {
      case "bold":
        prefix = "**";
        suffix = "**";
        break;
      case "italic":
        prefix = "*";
        suffix = "*";
        break;
      case "list":
        prefix = "\n- ";
        suffix = "";
        break;
      case "numbered":
        prefix = "\n1. ";
        suffix = "";
        break;
      default:
        return;
    }

    const newText =
      value.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      value.substring(end);
    onChange({ target: { value: newText } });

    // Đặt lại con trỏ sau khi format
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selectedText
        ? start + prefix.length + selectedText.length + suffix.length
        : start + prefix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const onEmojiClick = (emojiObject) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursor = textarea.selectionStart;
    const text =
      value.slice(0, cursor) + emojiObject.emoji + value.slice(cursor);
    onChange({ target: { value: text } });
    setShowEmojiPicker(false);

    // Đặt lại con trỏ sau khi chèn emoji
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = cursor + emojiObject.emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        <div className="flex-grow">
          <Form.Item className="mb-1">
            <TextArea
              ref={textareaRef}
              rows={1}
              onChange={onChange}
              value={value}
              placeholder={placeholder}
              autoSize={{ minRows: 2, maxRows: 6 }}
              className="rounded-2xl py-2 px-4 bg-gray-50 hover:bg-gray-100 focus:bg-white transition-colors"
            />
          </Form.Item>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Space>
          <FormatButton
            icon={<BoldOutlined />}
            onClick={() => handleFormat("bold")}
            tooltip="In đậm (Ctrl+B)"
          />
          <FormatButton
            icon={<ItalicOutlined />}
            onClick={() => handleFormat("italic")}
            tooltip="In nghiêng (Ctrl+I)"
          />
          <FormatButton
            icon={<UnorderedListOutlined />}
            onClick={() => handleFormat("list")}
            tooltip="Danh sách"
          />
          <FormatButton
            icon={<OrderedListOutlined />}
            onClick={() => handleFormat("numbered")}
            tooltip="Danh sách số"
          />
          <Popover
            content={<EmojiPicker onEmojiClick={onEmojiClick} />}
            trigger="click"
            open={showEmojiPicker}
            onOpenChange={setShowEmojiPicker}
          >
            <Button
              type="text"
              icon={<SmileOutlined />}
              className="text-gray-500 hover:text-blue-500"
            />
          </Popover>
        </Space>

        {showButton && (
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            onClick={onSubmit}
            icon={<SendOutlined />}
            className="rounded-full"
          >
            Gửi
          </Button>
        )}
      </div>
    </div>
  );
};

const CommentContent = ({ content }) => {
  useEffect(() => {
    // Add styles for comment formatting
    const style = document.createElement("style");
    style.textContent = `
      .comment-content {
        font-size: 0.95rem;
        line-height: 1.4;
      }
      .comment-content p {
        margin: 0.25rem 0;
      }
      .comment-content ul, .comment-content ol {
        margin: 0.25rem 0;
        padding-left: 1.25rem;
      }
      .comment-content li {
        margin: 0.125rem 0;
      }
      .comment-content .bold {
        font-weight: 600;
      }
      .comment-content .italic {
        font-style: italic;
      }
      .comment-item {
        margin-bottom: 0.5rem;
      }
      .comment-item .ant-list-item {
        padding: 0.5rem 0;
      }
      .comment-item .ant-list-item-action {
        margin-left: 0.5rem;
      }
      .bg-gray-50 {
        padding: 0.75rem 1rem !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const formatContent = (text) => {
    // Format text with proper HTML and classes
    let formatted = text
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<span class="bold">$1</span>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>')
      // Unordered lists
      .replace(/^- (.+)$/gm, '<li class="list-disc">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.+)$/gm, '<li class="list-decimal">$1</li>');

    // Group list items into proper lists
    const lines = formatted.split("\n");
    let inList = false;
    formatted = lines
      .map((line) => {
        if (line.includes('<li class="list-disc"')) {
          if (!inList) {
            inList = "ul";
            return '<ul class="list-disc pl-6">' + line;
          }
          return line;
        } else if (line.includes('<li class="list-decimal"')) {
          if (!inList) {
            inList = "ol";
            return '<ol class="list-decimal pl-6">' + line;
          }
          return line;
        } else {
          if (inList) {
            const closingTag = inList === "ul" ? "</ul>" : "</ol>";
            inList = false;
            return closingTag + "\n<p>" + line + "</p>";
          }
          return "<p>" + line + "</p>";
        }
      })
      .join("\n");

    // Close the last list if needed
    if (inList) {
      formatted += inList === "ul" ? "</ul>" : "</ol>";
    }

    return formatted;
  };

  return (
    <div
      className="comment-content"
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  );
};

const CommentItem = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  onReaction,
  currentUser,
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyValue.trim()) return;
    setSubmitting(true);
    await onReply(comment, replyValue);
    setReplyValue("");
    setShowReplyEditor(false);
    setSubmitting(false);
  };

  const actions = [
    <Tooltip key="comment-like" title="Thích">
      <span
        onClick={() => onReaction(comment.id, "likes")}
        className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer"
      >
        {comment.reactions.likes.includes(currentUser?.uid) ? (
          <LikeFilled className="text-blue-500 text-lg" />
        ) : (
          <LikeOutlined className="text-lg" />
        )}
        <span className="text-sm font-medium">
          {comment.reactions.likes.length > 0 && comment.reactions.likes.length}
        </span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-heart" title="Yêu thích">
      <span
        onClick={() => onReaction(comment.id, "hearts")}
        className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
      >
        {comment.reactions.hearts.includes(currentUser?.uid) ? (
          <HeartFilled className="text-red-500 text-lg" />
        ) : (
          <HeartOutlined className="text-lg" />
        )}
        <span className="text-sm font-medium">
          {comment.reactions.hearts.length > 0 &&
            comment.reactions.hearts.length}
        </span>
      </span>
    </Tooltip>,
    <span
      key="comment-reply"
      onClick={() => setShowReplyEditor(!showReplyEditor)}
      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
    >
      <CommentOutlined className="text-lg" />
      <span className="text-sm font-medium">Trả lời</span>
    </span>,
  ];

  if (currentUser?.uid === comment.author.uid) {
    actions.push(
      <span
        key="comment-edit"
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
      >
        <EditOutlined className="text-lg" />
        <span className="text-sm font-medium">Sửa</span>
      </span>,
      <span
        key="comment-delete"
        onClick={() => onDelete(comment.id)}
        className="flex items-center gap-1 text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
      >
        <DeleteOutlined className="text-lg" />
        <span className="text-sm font-medium">Xóa</span>
      </span>
    );
  }

  const handleSaveEdit = () => {
    if (!editValue.trim()) return;
    onEdit(comment.id, editValue);
    setIsEditing(false);
  };

  return (
    <div className="comment-item group">
      <List.Item actions={actions}>
        <div className="flex gap-4 w-full">
          <Avatar
            src={comment.author.avatar}
            className="flex-shrink-0"
            size={48}
          >
            {!comment.author.avatar && comment.author.name[0]}
          </Avatar>
          <div className="flex-grow">
            <div className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-2xl px-6 py-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-semibold text-gray-900">
                  {comment.author.name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(comment.createdAt.toDate(), {
                    addSuffix: true,
                    locale: vi,
                  })}
                  {comment.editedAt && " • đã chỉnh sửa"}
                </span>
              </div>
              {isEditing ? (
                <div className="mt-4">
                  <Editor
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    submitting={false}
                    showButton={false}
                  />
                  <Space className="mt-4">
                    <Button
                      size="middle"
                      type="primary"
                      onClick={handleSaveEdit}
                    >
                      Lưu thay đổi
                    </Button>
                    <Button size="middle" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                  </Space>
                </div>
              ) : (
                <div className="text-gray-700">
                  <CommentContent content={comment.content} />
                </div>
              )}
            </div>

            {showReplyEditor && (
              <div className="mt-4">
                <Editor
                  value={replyValue}
                  onChange={(e) => setReplyValue(e.target.value)}
                  onSubmit={handleReply}
                  submitting={submitting}
                  placeholder={`Trả lời ${comment.author.name}...`}
                />
              </div>
            )}
          </div>
        </div>
      </List.Item>

      {children && (
        <div className="ml-16 mt-4 border-l-2 border-gray-100 pl-6 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const Comments = ({ blogId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!blogId) {
      setError("Blog ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let unsubscribe;
    try {
      const q = query(
        collection(db, "comments"),
        where("blogId", "==", blogId),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          try {
            const fetchedComments = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            // Reset retry count on successful fetch
            setRetryCount(0);

            // Organize comments into threads
            const threads = {};
            fetchedComments.forEach((comment) => {
              if (!comment.parentId) {
                if (!threads[comment.id]) {
                  threads[comment.id] = {
                    ...comment,
                    replies: [],
                  };
                } else {
                  threads[comment.id] = {
                    ...comment,
                    replies: threads[comment.id].replies,
                  };
                }
              } else {
                if (!threads[comment.parentId]) {
                  threads[comment.parentId] = {
                    replies: [comment],
                  };
                } else {
                  threads[comment.parentId].replies.push(comment);
                }
              }
            });

            // Sort replies by createdAt
            Object.values(threads).forEach((thread) => {
              if (thread.replies) {
                thread.replies.sort(
                  (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
                );
              }
            });

            setComments(
              Object.values(threads).filter((thread) => thread.content)
            );
            setError(null);
          } catch (err) {
            console.error("Error processing comments:", err);
            handleError(err);
          }
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching comments:", err);
          if (
            err.code === "failed-precondition" &&
            err.message.includes("index")
          ) {
            // Nếu lỗi là do thiếu index, thử query không có orderBy
            try {
              unsubscribe = onSnapshot(
                query(
                  collection(db, "comments"),
                  where("blogId", "==", blogId)
                ),
                (snapshot) => {
                  const fetchedComments = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));

                  // Sort comments manually
                  fetchedComments.sort(
                    (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
                  );

                  // Process comments as before...
                  const threads = {};
                  fetchedComments.forEach((comment) => {
                    if (!comment.parentId) {
                      threads[comment.id] = {
                        ...comment,
                        replies: threads[comment.id]?.replies || [],
                      };
                    } else {
                      if (!threads[comment.parentId]) {
                        threads[comment.parentId] = { replies: [comment] };
                      } else {
                        threads[comment.parentId].replies.push(comment);
                      }
                    }
                  });

                  Object.values(threads).forEach((thread) => {
                    if (thread.replies) {
                      thread.replies.sort(
                        (a, b) =>
                          b.createdAt.toMillis() - a.createdAt.toMillis()
                      );
                    }
                  });

                  setComments(
                    Object.values(threads).filter((thread) => thread.content)
                  );
                  setError(null);
                  setLoading(false);
                },
                (fallbackErr) => {
                  console.error("Error in fallback query:", fallbackErr);
                  handleError(fallbackErr);
                }
              );
            } catch (fallbackErr) {
              console.error("Error setting up fallback query:", fallbackErr);
              handleError(fallbackErr);
            }
          } else {
            handleError(err);
          }
        }
      );
    } catch (err) {
      console.error("Error setting up comments listener:", err);
      handleError(err);
    }

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [blogId]);

  const handleError = (err) => {
    if (retryCount < MAX_RETRIES) {
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setError(null);
        setLoading(true);
      }, RETRY_DELAY);
    } else {
      setError(
        err.code === "permission-denied"
          ? "Bạn không có quyền xem bình luận"
          : "Không thể tải bình luận. Vui lòng thử lại sau."
      );
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!value.trim()) return;
    if (!user) {
      message.error("Vui lòng đăng nhập để bình luận!");
      return;
    }

    setSubmitting(true);

    try {
      const commentData = {
        blogId,
        content: value.trim(),
        author: {
          uid: user.uid,
          name: user.displayName || "Anonymous",
          avatar: user.photoURL,
        },
        createdAt: Timestamp.now(),
        reactions: {
          likes: [],
          hearts: [],
        },
        parentId: null,
      };

      await addDoc(collection(db, "comments"), commentData);
      setValue("");
      message.success("Đã đăng bình luận!");
    } catch (error) {
      console.error("Error posting comment:", error);
      message.error(
        error.code === "permission-denied"
          ? "Bạn không có quyền đăng bình luận"
          : "Không thể đăng bình luận. Vui lòng thử lại sau."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentComment, content) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để trả lời bình luận!");
      return;
    }

    try {
      const replyData = {
        blogId,
        content: content.trim(),
        author: {
          uid: user.uid,
          name: user.displayName || "Anonymous",
          avatar: user.photoURL,
        },
        createdAt: Timestamp.now(),
        reactions: {
          likes: [],
          hearts: [],
        },
        parentId: parentComment.id,
      };

      await addDoc(collection(db, "comments"), replyData);
      message.success("Đã trả lời bình luận!");
    } catch (error) {
      message.error("Không thể trả lời bình luận: " + error.message);
    }
  };

  const handleEdit = async (commentId, newContent) => {
    try {
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        content: newContent.trim(),
        editedAt: Timestamp.now(),
      });
      message.success("Đã cập nhật bình luận!");
    } catch (error) {
      message.error("Không thể cập nhật bình luận: " + error.message);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteDoc(doc(db, "comments", commentId));
      message.success("Đã xóa bình luận!");
    } catch (error) {
      message.error("Không thể xóa bình luận: " + error.message);
    }
  };

  const handleReaction = async (commentId, reactionType) => {
    if (!user) {
      message.error("Vui lòng đăng nhập để thể hiện cảm xúc!");
      return;
    }

    try {
      const commentRef = doc(db, "comments", commentId);
      const comment =
        comments.find((c) => c.id === commentId) ||
        comments
          .flatMap((c) => c.replies || [])
          .find((c) => c.id === commentId);

      if (!comment) return;

      const reactions = { ...comment.reactions };
      const userReacted = reactions[reactionType].includes(user.uid);

      if (userReacted) {
        reactions[reactionType] = reactions[reactionType].filter(
          (uid) => uid !== user.uid
        );
      } else {
        reactions[reactionType] = [...reactions[reactionType], user.uid];
      }

      await updateDoc(commentRef, { reactions });
    } catch (error) {
      message.error("Không thể thể hiện cảm xúc: " + error.message);
    }
  };

  return (
    <div className="p-6 bg-white">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900">
          Bình luận {comments.length > 0 && `(${comments.length})`}
        </h3>
        {!user && (
          <Button
            type="primary"
            size="large"
            className="flex items-center gap-2"
            onClick={() => message.info("Vui lòng đăng nhập để bình luận")}
          >
            <CommentOutlined />
            Đăng nhập để bình luận
          </Button>
        )}
      </div>

      {user && (
        <div className="flex gap-4 mb-8">
          <Avatar src={user.photoURL} size={48} className="flex-shrink-0">
            {!user.photoURL && user.displayName?.[0]}
          </Avatar>
          <div className="flex-grow">
            <Editor
              onChange={(e) => setValue(e.target.value)}
              onSubmit={handleSubmit}
              submitting={submitting}
              value={value}
            />
          </div>
        </div>
      )}

      {error ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <ExclamationCircleOutlined style={{ fontSize: 32 }} />
          </div>
          <p className="text-gray-600">{error}</p>
          <div className="mt-4 space-x-4">
            <Button
              type="primary"
              onClick={() => {
                setRetryCount(0);
                setError(null);
                setLoading(true);
              }}
            >
              Thử lại
            </Button>
            {retryCount > 0 && (
              <span className="text-gray-500">
                Đã thử lại {retryCount}/{MAX_RETRIES} lần
              </span>
            )}
          </div>
        </div>
      ) : loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} avatar active paragraph={{ rows: 2 }} />
          ))}
        </div>
      ) : comments.length > 0 ? (
        <List
          className="comments-list space-y-6"
          itemLayout="horizontal"
          dataSource={comments}
          split={false}
          renderItem={(comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReaction={handleReaction}
              currentUser={user}
            >
              {comment.replies?.length > 0 && (
                <List
                  className="space-y-4"
                  itemLayout="horizontal"
                  dataSource={comment.replies}
                  split={false}
                  renderItem={(reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      onReply={handleReply}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onReaction={handleReaction}
                      currentUser={user}
                    />
                  )}
                />
              )}
            </CommentItem>
          )}
        />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <SmileOutlined
            style={{ fontSize: 32 }}
            className="mb-4 text-gray-400"
          />
          <p className="text-gray-500 text-lg">
            Hãy là người đầu tiên bình luận!
          </p>
        </div>
      )}
    </div>
  );
};

export default Comments;
