"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, ThumbsUp } from "lucide-react";
import { marked } from "marked";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

type Comment = {
  id: number;
  parent_id: number | null;
  author_name: string;
  content: string;
  created_at: string;
  is_verified: boolean;
  reactionCount: number;
  rating: number;
};

export default function CommentsSection({
  programId,
  showComments,
  setShowComments,
  onNewReview,
}: {
  programId: string;
  showComments: boolean;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
  onNewReview?: ()=>void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [rating, setRating] = useState<number | null>(null)
  const [newText, setNewText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [replyName, setReplyName] = useState<{ [key: number]: string }>({});
  const [sortBy, setSortBy] = useState<"date" | "popularity">("date");
  const [expandedCommentId, setExpandedCommentId] = useState<number | null>(
    null
  );

  function renderMarkdown(content: string) {
    const DOMPurify = require("dompurify")(window);
    return DOMPurify.sanitize(marked.parse(content));
  }

  async function load() {
    const res = await fetch(`/api/comments?programId=${programId}`);
    let data = await res.json();
    if (sortBy === "popularity") {
      data = data.sort(
        (a: Comment, b: Comment) => b.reactionCount - a.reactionCount
      );
    } else {
      data = data.sort(
        (a: Comment, b: Comment) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    setComments(data);
  }

  async function post(
    parentId: number | null = null,
    content?: string,
    name?: string
  ) {
    await fetch(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({
        programId,
        parentId,
        content: content ?? newText,
        authorName: name ?? authorName,
        rating: rating,
      }),
    });

    if (parentId) {
      setReplyText((prev) => ({ ...prev, [parentId]: "" }));
      setReplyName((prev) => ({ ...prev, [parentId]: "" }));
    } else {
      setNewText("");
      setAuthorName("");
      setRating(0);
      if (onNewReview) onNewReview();
    }
    load();
  }

  useEffect(() => {
    load();
  }, [programId, sortBy]);

  function handleExpand(commentId: number) {
    setExpandedCommentId((prev) => (prev === commentId ? null : commentId));
  }

  function renderComments(parentId: number | null = null, level = 0) {
    return comments
      .filter((c) => c.parent_id === parentId)
      .map((c) => {
        const canReply = level === 0;
        const isExpanded = expandedCommentId === c.id;
        return (
          <Card
            key={c.id}
            onClick={() => handleExpand(c.id)}
            className={`mb-2 ml-${
              level * 4
            } bg-gray-50 max-w-lg shadow-none border border-gray-200 pt-0 pb-1 rounded-sm cursor-pointer transition-colors ${
              isExpanded ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <CardContent className="p-0">
              <div className="flex justify-between gap-0 items-center rounded-t bg-gray-200 px-3 py-0 min-h-[32px]">
                <span className="font-semibold text-xs text-gray-700 truncate max-w-[60%]">
                  {c.author_name}
                </span>
                {c.is_verified && (
                  <CheckCircle size={14} className="text-blue-500 ml-1" />
                )}
                <span className="text-xs text-gray-500 italic ml-auto w-">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="px-3 pb-0 pt-2">
                <div
                  className={`text-xs markdown-content break-words ${
                    !isExpanded ? "line-clamp-3" : ""
                  }`}
                  style={{
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(c.content),
                  }}
                />
                
                <div className="flex justify-end gap-2 pb-0 pt-1">
                {/* Show read-only rating if set */}
                    {c.rating && (
                    <Box sx={{ '& > legend': { mt: 2 } }} className="flex justify-center mt-1 mb-1">
                        <Rating 
                            value={c.rating} 
                            readOnly 
                            size="small" 
                            icon={<Star size={14} fill="#facc15" stroke="#facc15" />}
                            emptyIcon={<Star size={14} fill="#e5e7eb" stroke="#e5e7eb" />}
                        />
                    </Box>
                    )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-0 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetch("/api/reactions", {
                        method: "POST",
                        body: JSON.stringify({ commentId: c.id }),
                      }).then(load);
                    }}
                  >
                    👍 {c.reactionCount}
                    {/* Upvote/Downvote reaction */}
                  </Button>
                  {canReply && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-0 h-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReplyTo(c.id);
                        setExpandedCommentId(c.id);
                      }}
                    >
                      Reply
                    </Button>
                  )}
                </div>
                {replyTo === c.id && canReply && (
                  <div
                    className="mt-2 flex flex-col gap-1 pb-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    
                    <input
                      className="border rounded px-2 py-1 text-xs bg-white"
                      placeholder="Your name (optional)"
                      value={replyName[c.id] || ""}
                      maxLength={25}
                      onChange={(e) =>
                        setReplyName((prev) => ({
                          ...prev,
                          [c.id]: e.target.value,
                        }))
                      }
                    />
                    <textarea
                      className="border rounded px-2 py-1 text-xs bg-white"
                      placeholder="Write a reply..."
                      value={replyText[c.id] || ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [c.id]: e.target.value,
                        }))
                      }
                    />
                    <div className="flex justify-end gap-2 pb-0 pt-1">
                      <Button
                        size="sm"
                        className="text-xs px-2 py-0 h-6"
                        disabled={!replyText[c.id]?.trim()}
                        onClick={() => {
                          post(c.id, replyText[c.id], replyName[c.id]);
                          setReplyTo(null);
                        }}
                      >
                        Post Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs px-2 py-0 h-6"
                        onClick={() => setReplyTo(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                <div className="ml-4 mt-2">
                  {renderComments(c.id, level + 1)}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      });
  }

  // Count all comments (including children) for header
  const allCommentsCount = comments.length;

  return (
    <section className="">
      <div
        className="flex items-center gap-2 mb-2 cursor-pointer"
        onClick={() => setShowComments((v) => !v)}
      >
        <h4 className="font-bold text-sm text-gray-700 mb-0">
          Comments
        </h4>
        {showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        <span className="text-xs text-gray-500">({allCommentsCount})</span>
      </div>
      {showComments && (
        <>
          <Card className="mb-2 bg-gray-50 max-w-lg border border-gray-200 pt-0 pb-1 rounded-sm hover:shadow-md">
            <CardContent className="p-0 mb-1">
              <div className="flex justify-between items-center gap-4 rounded-t bg-gray-200 px-3 py-0 min-h-[32px]">
                <input
                  className="border rounded px-2 py-1 text-xs h-full w-full bg-white"
                  placeholder="Your name (optional)"
                  value={authorName}
                  maxLength={25}
                  onChange={(e) => setAuthorName(e.target.value)}
                />
                <span className="text-xs text-gray-500 italic ml-auto w-fit">
                  {new Date().toLocaleDateString("en-US")}
                </span>
              </div>
              <div className="px-3 pb-0 pt-2">
                
                <textarea
                  className="border rounded px-2 py-1 text-xs w-full bg-white"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Share your experience..."
                />
                <Box sx={{ '& > legend': { mt: 2 } }} className="flex justify-center">
                  <Rating
                    value={rating}
                    onChange={(_, newValue) => setRating(newValue)}
                    className="flex justify-center"
                    icon={<Star size={24} fill="#facc15" stroke="#facc15" />}
                    emptyIcon={<Star size={24} fill="#e5e7eb" stroke="#e5e7eb" />}
                  />
                </Box>
                <div className="flex justify-end mt-0">
                  <Button
                    onClick={() => post()}
                    disabled={!newText.trim()}
                    size="sm"
                    className="text-xs px-2 py-0 h-6 w-fit"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {allCommentsCount > 0 && (
            <div className="ml-auto pb-2">
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as "date" | "popularity")}
              >
                <SelectTrigger className="w-full h-6 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="text-xs" value="date">
                    Sort by Date
                  </SelectItem>
                  <SelectItem className="text-xs" value="popularity">
                    Sort by Popularity
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="mt-0">{renderComments()}</div>
        </>
      )}
    </section>
  );
}
