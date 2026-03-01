"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";

import type { NewsAlbum } from "@/lib/news-parser";

type LightboxState = {
  albumIndex: number;
  imageIndex: number;
};

type NewsAlbumViewerProps = {
  albums: NewsAlbum[];
};

export function NewsAlbumViewer({ albums }: NewsAlbumViewerProps) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const current = useMemo(() => {
    if (!lightbox) {
      return null;
    }

    const album = albums[lightbox.albumIndex];
    if (!album || album.images.length === 0) {
      return null;
    }

    const image = album.images[lightbox.imageIndex];
    if (!image) {
      return null;
    }

    return { album, image };
  }, [albums, lightbox]);

  const close = () => setLightbox(null);

  const goPrev = () => {
    if (!lightbox) {
      return;
    }

    const album = albums[lightbox.albumIndex];
    if (!album?.images.length) {
      return;
    }

    const last = album.images.length - 1;
    const nextIndex = lightbox.imageIndex === 0 ? last : lightbox.imageIndex - 1;
    setLightbox({ ...lightbox, imageIndex: nextIndex });
  };

  const goNext = () => {
    if (!lightbox) {
      return;
    }

    const album = albums[lightbox.albumIndex];
    if (!album?.images.length) {
      return;
    }

    const nextIndex = (lightbox.imageIndex + 1) % album.images.length;
    setLightbox({ ...lightbox, imageIndex: nextIndex });
  };

  useEffect(() => {
    if (!lightbox) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        setLightbox((currentLightbox) => {
          if (!currentLightbox) {
            return currentLightbox;
          }

          const album = albums[currentLightbox.albumIndex];
          if (!album?.images.length) {
            return currentLightbox;
          }

          const last = album.images.length - 1;
          const imageIndex = currentLightbox.imageIndex === 0 ? last : currentLightbox.imageIndex - 1;
          return { ...currentLightbox, imageIndex };
        });
        return;
      }

      if (event.key === "ArrowRight") {
        setLightbox((currentLightbox) => {
          if (!currentLightbox) {
            return currentLightbox;
          }

          const album = albums[currentLightbox.albumIndex];
          if (!album?.images.length) {
            return currentLightbox;
          }

          const imageIndex = (currentLightbox.imageIndex + 1) % album.images.length;
          return { ...currentLightbox, imageIndex };
        });
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [albums, lightbox]);

  if (!albums.length) {
    return null;
  }

  return (
    <>
      <div className="news-album-list">
        {albums.map((album, albumIndex) => {
          const cover = album.images[0];

          return (
            <button
              key={album.id}
              type="button"
              className="album-launch"
              onClick={() => setLightbox({ albumIndex, imageIndex: 0 })}
            >
              {cover ? (
                <img
                  src={cover.thumbSrc}
                  alt={`${album.title} cover`}
                  loading="lazy"
                  decoding="async"
                  className="album-cover"
                />
              ) : null}
              <span>
                <strong>{album.title}</strong>
                <small>{album.images.length} photos</small>
              </span>
            </button>
          );
        })}
      </div>

      {lightbox && current ? (
        <div className="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Photo viewer">
          <button type="button" className="lightbox-backdrop" aria-label="Close album" onClick={close} />

          <div className="lightbox-panel">
            <button type="button" className="lightbox-close" onClick={close} aria-label="Close">
              Close
            </button>

            <button type="button" className="lightbox-arrow left" onClick={goPrev} aria-label="Previous photo">
              ‹
            </button>

            <img
              src={current.image.fullSrc}
              alt="Album photo"
              className="lightbox-image"
              loading="eager"
              decoding="async"
            />

            <button type="button" className="lightbox-arrow right" onClick={goNext} aria-label="Next photo">
              ›
            </button>

            <p className="lightbox-counter">
              {lightbox.imageIndex + 1} / {current.album.images.length}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
