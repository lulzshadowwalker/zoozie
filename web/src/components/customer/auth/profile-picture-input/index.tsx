import { faUserLarge, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useState, ChangeEvent } from "react";
import Image from "next/image";

export default function ProfilePictureInput() {
  const t = useTranslations("customer.auth");
  const [file, setFile] = useState<File | null>(null);

  function handlePictureChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setFile(file);
  }

  // TODO: add 'X' button

  return (
    <label
      htmlFor="profile-picture"
      className="group relative flex aspect-square w-2xl-3xl cursor-pointer items-center justify-center rounded-2xl bg-gray-200 transition-all hover:bg-gray-300"
    >
      <input
        id="profile-picture"
        type="file"
        className="hidden"
        name="profilePicture"
        onChange={handlePictureChange}
      />
      {file ? (
        <Image
          src={URL.createObjectURL(file)}
          fill
          alt={t("profile-picture")}
          title={t("profile-picture")}
          className="rounded-2xl object-cover"
          sizes="70px"
        />
      ) : (
        <>
          <FontAwesomeIcon
            icon={faUserLarge}
            size="2x"
            className="text-gray-500"
          />
          <FontAwesomeIcon
            icon={faPlusCircle}
            size="sm"
            className="absolute bottom-0 end-0 translate-x-1/3 translate-y-1/3 rounded-full  border-2 border-gray-200 text-gray-400 transition-all group-hover:scale-125 rtl:-translate-x-1/2"
          />
        </>
      )}
    </label>
  );
}
