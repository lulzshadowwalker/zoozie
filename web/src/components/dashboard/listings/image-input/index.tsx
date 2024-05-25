"use client";

import { useTranslations } from "next-intl";
import { cn } from "@utils";
import { ChangeEvent } from "react";
import ZoozImage from "@/components/shared/zooz-image";
import Marquee from "react-fast-marquee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { useCreateListingStore } from "@/lib/store/create-listing";

export default function ImageInput() {
  const pictures = useCreateListingStore((state) => state.pictures);
  const addPictures = useCreateListingStore((state) => state.addPictures);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    addPictures(...files);
  }

  return (
    <section>
      <input
        id="dropzone-file"
        type="file"
        multiple
        className="hidden"
        name="pictures[]"
        onChange={handleInputChange}
      />
      <div className="relative mx-auto min-h-[55rem] max-w-page cursor-pointer overflow-hidden rounded-xl bg-blue-200">
        {pictures?.[0] ? (
          <_HightlightedImagePreview image={pictures[0]} />
        ) : (
          <_ImageInput />
        )}
      </div>

      {/* NOTE: for some reason `<Marquee>` doesn't seem to load until all the children are loaded or something of sorts 
        so this wrapper div is to prevent cls */}
      <div className="mt-m-l min-h-[16rem] md:min-h-[26rem]" dir="ltr">
        <Marquee autoFill speed={30}>
          {(pictures ?? [...Array(5)]).map((image, index) => (
            <div
              key={index}
              className={cn(
                "relative mx-2xs-xs aspect-square min-h-[16rem] overflow-hidden rounded-xl bg-gray-50 md:min-h-[26rem]",
                {
                  "flex items-center justify-center border-2 border-dashed border-gray-300":
                    !pictures?.[0],
                },
              )}
            >
              {pictures?.[0] ? (
                <ZoozImage
                  src={URL.createObjectURL(image)}
                  alt=""
                  title=""
                  fill
                  sizes="(min-width: 1180px) 260px, (min-width: 780px) calc(21.05vw + 16px), (min-width: 740px) 160px, calc(22.86vw - 5px)"
                  className="object-cover transition-all duration-[800ms] ease-out hover:scale-105"
                  quality={70}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faImage}
                  size="4x"
                  className="text-gray-500 dark:text-gray-400"
                />
              )}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function _ImageInput() {
  const t = useTranslations("dashboard.create-listing");

  return (
    <div className="absolute inset-0 flex w-full items-center justify-center">
      <label
        htmlFor="dropzone-file"
        className="dark:hover:bg-bray-800 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <svg
            className="mb-[1.6rem] h-[8rem] w-[8rem] text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-1 text-lg text-gray-500 dark:text-gray-400">
            <span className="font-semibold">{t("click-to-upload")}</span>{" "}
            {t("or-drag-and-drop")}
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
      </label>
    </div>
  );
}

function _HightlightedImagePreview({ image }: { image: File }) {
  return (
    <ZoozImage
      src={URL.createObjectURL(image)}
      alt={image.name}
      fill
      sizes="(min-width: 1280px) 1200px, calc(93.75vw + 19px)"
      className="object-cover transition-all duration-[800ms] ease-out hover:scale-105"
      priority
      quality={90}
    />
  );
}
