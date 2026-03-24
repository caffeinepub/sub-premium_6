import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, useState } from "react";
import { translateComment, useI18n } from "../i18n";

export interface CommentData {
  id: string;
  text: string;
  time: string;
  lang?: string;
  username?: string;
  avatarBlobId?: string;
  userId?: string;
}

interface CommentItemProps {
  comment: CommentData;
  index: number;
  userLang: string;
}

export function CommentItem({ comment, index, userLang }: CommentItemProps) {
  const { t } = useI18n();
  const [displayText, setDisplayText] = useState(comment.text);
  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [visible, setVisible] = useState(true);
  const cacheRef = useRef<string | null>(null);

  const commentLang = comment.lang ?? "en";
  const canTranslate = commentLang !== userLang;

  const displayName = comment.username ?? "User";
  const initials = displayName.charAt(0).toUpperCase();

  const handleTranslate = async () => {
    if (cacheRef.current) {
      setVisible(false);
      setTimeout(() => {
        setDisplayText(cacheRef.current!);
        setIsTranslated(true);
        setVisible(true);
      }, 150);
      return;
    }
    setIsTranslating(true);
    try {
      const translated = await translateComment(comment.text, userLang);
      cacheRef.current = translated;
      setVisible(false);
      setTimeout(() => {
        setDisplayText(translated);
        setIsTranslated(true);
        setVisible(true);
        setIsTranslating(false);
      }, 150);
    } catch {
      setIsTranslating(false);
    }
  };

  const handleShowOriginal = () => {
    setVisible(false);
    setTimeout(() => {
      setDisplayText(comment.text);
      setIsTranslated(false);
      setVisible(true);
    }, 150);
  };

  return (
    <div className="flex gap-2" data-ocid={`player.comment.item.${index}`}>
      <Avatar className="w-7 h-7 flex-shrink-0">
        {comment.avatarBlobId ? (
          <AvatarImage src={comment.avatarBlobId} alt={displayName} />
        ) : null}
        <AvatarFallback className="bg-accent/20 text-accent text-[10px] font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <span className="text-xs font-semibold text-foreground">
          {displayName}{" "}
        </span>
        <span className="text-xs text-muted-foreground">{comment.time}</span>
        <p
          className="text-sm text-foreground mt-0.5"
          style={{
            transition: "opacity 0.2s ease",
            opacity: visible ? 1 : 0,
          }}
        >
          {displayText}
        </p>
        {canTranslate && (
          <div className="mt-1">
            {isTranslating ? (
              <span className="text-[11px] text-muted-foreground italic">
                {t("comment.translating")}
              </span>
            ) : isTranslated ? (
              <button
                type="button"
                onClick={handleShowOriginal}
                className="text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                data-ocid={`player.comment.toggle.${index}`}
              >
                {t("comment.showOriginal")}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleTranslate}
                className="text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                data-ocid={`player.comment.toggle.${index}`}
              >
                {t("comment.translate")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
