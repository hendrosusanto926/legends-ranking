"use client";

import { useState } from "react";
import { Share2, Link, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title?: string;
  url?: string;
  className?: string;
}

export function ShareButton({
  title = "Football Legends Ranking",
  url,
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: "Check out the Football Legends Ranking!",
          url: shareUrl,
        });
      } catch {
        // user cancelled
      }
    }
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        "Check out the Football Legends Ranking!"
      )}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Check out the Football Legends Ranking! ${shareUrl}`
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("text-xs", className)}>
          <Share2 className="h-3.5 w-3.5 mr-1.5" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyLink}>
          <Link className="h-4 w-4 mr-2" />
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <DropdownMenuItem onClick={shareNative}>
            <Share2 className="h-4 w-4 mr-2" />
            Share via...
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={shareTwitter}>
          <ExternalLink className="h-4 w-4 mr-2 text-blue-400" />
          X (Twitter)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareFacebook}>
          <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareWhatsApp}>
          <MessageCircle className="h-4 w-4 mr-2 text-green-400" />
          WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
