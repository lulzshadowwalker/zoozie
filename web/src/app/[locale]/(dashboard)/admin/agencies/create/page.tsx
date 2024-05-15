import Header from "@/components/dashboard/shared/header";
import Button from "@/components/shared/button";
import ZoozInput from "@/components/shared/zooz-input";
import { createAgency } from "@/lib/actions/create-agency";
import { IBasePageParams } from "@/lib/types";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { unstable_setRequestLocale } from "next-intl/server";

export default function CreateAgency({ params: { locale } }: IBasePageParams) {
  unstable_setRequestLocale(locale);

  return (
    <main>
      <Header leading={<h1 className="text-2xl">Create Agency</h1>} />

      <form
        action={createAgency}
        className="mx-auto my-xl-2xl flex max-w-screen-lg flex-col gap-xs-s"
      >
        <div className="flex items-center gap-s-m">
          <ZoozInput
            id="name-ar"
            label="Arabic Name"
            type="text"
            placeholder="Enter Arabic Name"
            name="arabicName"
          />
          <ZoozInput
            id="name-en"
            label="Englsih Name"
            type="text"
            placeholder="Enter English Name"
            name="englishName"
          />
        </div>

        <div className="flex items-center gap-s-m">
          <ZoozInput
            id="desc-ar"
            label="Arabic Description"
            type="text"
            placeholder="Enter Arabic Description"
            name="arabicDescription"
          />
          <ZoozInput
            id="desc-en"
            label="Englsih Description"
            type="text"
            placeholder="Enter English Description"
            name="englishDescription"
          />
        </div>

        <div className="flex items-center gap-s-m">
          <ZoozInput
            id="country-code"
            label="Country Code"
            type="number"
            placeholder="Enter Country Code"
            value="962"
            // disabled
            name="countryCode"
          />
          <ZoozInput
            id="phone-number"
            label="Phone Number"
            type="number"
            placeholder="79 xxx xxxx"
            name="phoneNumber"
          />
        </div>

        <ZoozInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="email@example.com"
          name="emailAddress"
        />

        <ZoozInput
          id="logo"
          label="Logo URL"
          type="text"
          placeholder="Enter Logo URL"
          name="logo"
        />
        <Button type="submit">
          Create <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </form>
    </main>
  );
}
