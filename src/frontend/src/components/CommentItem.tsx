import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRef, useState } from "react";
import { translateComment, useI18n } from "../i18n";

export interface CommentData {
  text: string;
  time: string;
  lang?: string; // optional language code, e.g. "fr", "es"
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

  // Show translate button when comment has a different lang metadata
  const commentLang = comment.lang ?? "en";
  const canTranslate = commentLang !== userLang;

  const handleTranslate = async () => {
    if (cacheRef.current) {
      // Use cache — fade swap
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
        <AvatarFallback className="bg-accent/20 text-accent text-[10px] font-bold">
          ME
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <span className="text-xs font-semibold text-foreground">You </span>
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
        {/* Translation controls */}
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
