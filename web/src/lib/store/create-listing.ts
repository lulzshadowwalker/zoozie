import create from "zustand-store-addons";
import { Locale } from "../i18n/config";
import { translate } from "../utils";

type TPrice = {
  amount: number;
  currency: "USD" | "JOD";
};

type TExtraFeature = {
  id: number;
  enTitle: string;
  arTitle: string;
  exists: boolean;
};

type TPicture = File;

type TAvailability = {
  availability: "RENT" | "SALE";
  price: TPrice;
};

type TState = {
  enDescription?: string;
  arDescription?: string;
  bedrooms?: number;
  enBedroomsDescription?: string;
  arBedroomsDescription?: string;
  bathrooms?: number;
  enBathroomsDescription?: string;
  arBathroomsDescription?: string;
  yearBuilt?: string;
  enYearBuiltDescription?: string;
  arYearBuiltDescription?: string;
  area?: number;
  enAreaDescription?: string;
  arAreaDescription?: string;
  furnished?: boolean;
  enFurnishedDescription?: string;
  arFurnishedDescription?: string;
  availabilities?: TAvailability[];
  extraFeatures?: TExtraFeature[];
  pictures?: TPicture[];
  location?: {
    countryId?: number;
    cityId?: number;
    areaId?: number;
  };
  propertyType?: string;
  translated?: boolean;
};

type TActions = {
  // NOTE: allow modification of common fields but do not allow adding or removing of non-common fields
  setDescription(locale: Locale, description: string): void;
  setYearBuilt(yearBuilt: string): void;
  setYearBuiltDescription(locale: Locale, description: string): void;
  setBedrooms(bedrooms: number): void;
  setBedroomsDescription(locale: Locale, description: string): void;
  setBathrooms(bathrooms: number): void;
  setBathroomsDescription(locale: Locale, description: string): void;
  setArea(area: number): void;
  setAreaDescription(locale: Locale, description: string): void;
  setFurnished(furnished: boolean): void;
  setFurnishedDescription(locale: Locale, description: string): void;
  addAvailability(availability: TAvailability): void;
  removeAvailability(availability: TAvailability["availability"]): void;
  addExtraFeature(locale: Locale): void;
  updateExtraFeature(extraFeature: TExtraFeature): void;
  removeExtraFeature(extraFeature: TExtraFeature): void;
  addPictures(...pictures: TPicture[]): void;
  removePictures(...pictures: TPicture[]): void;
  setLocation(location: TState["location"]): void;
  setPropertyType(code: string): void;
  setTranslated: (translated: boolean) => void;
};

export const useCreateListingStore = create<TState & TActions>(
  (set) => {
    return {
      setDescription: (locale, description) =>
        set((state) => ({ ...state, [`${locale}Description`]: description })),
      setYearBuilt: (yearBuilt) =>
        set((state) => {
          if (state.translated) return {};
          return { ...state, yearBuilt };
        }),
      setYearBuiltDescription: (locale, description) =>
        set((state) => ({
          ...state,
          [`${locale}YearBuiltDescription`]: description,
        })),
      setBedrooms: (bedrooms) => set((state) => ({ ...state, bedrooms })),
      setBedroomsDescription: (locale, description) =>
        set((state) => ({
          ...state,
          [`${locale}BedroomsDescription`]: description,
        })),
      setBathrooms: (bathrooms) => set((state) => ({ ...state, bathrooms })),
      setBathroomsDescription: (locale, description) =>
        set((state) => ({
          ...state,
          [`${locale}BathroomsDescription`]: description,
        })),
      setArea: (area) => set((state) => ({ ...state, area })),
      setAreaDescription: (locale, description) =>
        set((state) => ({
          ...state,
          [`${locale}AreaDescription`]: description,
        })),
      setFurnished: (furnished) => set((state) => ({ ...state, furnished })),
      setFurnishedDescription: (locale, description) =>
        set((state) => ({
          ...state,
          [`${locale}FurnishedDescription`]: description,
        })),
      addAvailability: (availability) =>
        set((state) => {
          const index = state.availabilities?.findIndex(
            (a) => a.availability === availability.availability,
          );

          console.log("index: ", index, state.availabilities);
          if (index !== undefined && index !== -1) {
            return {
              ...state,
              availabilities: state.availabilities?.map((a, i) =>
                i === index ? availability : a,
              ),
            };
          }

          return {
            ...state,
            availabilities: [...(state.availabilities || []), availability],
          };
        }),
      removeAvailability: (availability) =>
        set((state) => ({
          ...state,
          availabilities: state.availabilities?.filter(
            (a) => a.availability !== availability,
          ),
        })),
      addPictures: (...pictures) =>
        set((state) => ({
          ...state,
          pictures: [...(state.pictures || []), ...pictures],
        })),
      removePictures: (...pictures) =>
        set((state) => ({
          ...state,
          pictures: state.pictures?.filter(
            (picture) => !pictures.includes(picture),
          ),
        })),
      addExtraFeature: (locale: Locale) => {
        set((state) => {
          if (state.translated) return {};

          const hasFeatures = !!state.extraFeatures?.length;
          const lastFeatureHasValue =
            locale === "en"
              ? !!state.extraFeatures?.[state.extraFeatures?.length - 1]
                  ?.enTitle
              : !!state.extraFeatures?.[state.extraFeatures?.length - 1]
                  ?.arTitle;

          if (hasFeatures && (!lastFeatureHasValue ?? true)) {
            return {};
          }

          return {
            ...state,
            extraFeatures: [
              ...(state.extraFeatures || []),
              { id: Date.now(), enTitle: "", exists: false },
            ],
          };
        });
      },
      updateExtraFeature: (extraFeature) =>
        set((state) => ({
          ...state,
          extraFeatures: state.extraFeatures?.map((feature) =>
            feature.id === extraFeature.id ? extraFeature : feature,
          ),
        })),
      removeExtraFeature: (extraFeature) =>
        set((state) => {
          if (state.translated) return {};

          return {
            ...state,
            extraFeatures: state.extraFeatures?.filter(
              (feature) => feature.id !== extraFeature.id,
            ),
          };
        }),
      setLocation: (location) => set((state) => ({ ...state, location })),
      setPropertyType: (code) =>
        set((state) => ({ ...state, propertyType: code })),
      setTranslated: (translated) => set((state) => ({ ...state, translated })),
    };
  },
  {
    computed: {},
  },
);

export function useCreateListingTranslator() {
  const state = useCreateListingStore();

  async function translateTo(target: Locale) {
    const opposite = target === "en" ? "ar" : "en";
    {
      const value = state[`${opposite}Description`];
      if (value) {
        const translated = await translate(
          value,
          target === "en" ? "ar" : "en",
          target,
        );
        if (translated) {
          state.setDescription(target, translated);
        }
      }
    }
    {
      const value = state[`${opposite}YearBuiltDescription`];
      if (value) {
        const translated = await translate(
          value,
          target === "en" ? "ar" : "en",
          target,
        );
        if (translated) {
          state.setYearBuiltDescription(target, translated);
        }
      }
    }
    {
      const value = state[`${opposite}BedroomsDescription`];
      if (value) {
        const translated = await translate(
          value,
          target === "en" ? "ar" : "en",
          target,
        );
        if (translated) {
          state.setBedroomsDescription(target, translated);
        }
      }
    }

    {
      const value = state[`${opposite}BathroomsDescription`];
      if (value) {
        const translated = await translate(
          value,
          target === "en" ? "ar" : "en",
          target,
        );
        if (translated) {
          state.setBathroomsDescription(target, translated);
        }
      }
    }

    {
      const value = state[`${opposite}AreaDescription`];
      if (value) {
        const translated = await translate(
          value,
          target === "en" ? "ar" : "en",
          target,
        );
        if (translated) {
          state.setAreaDescription(target, translated);
        }
      }
    }

    {
      const value = state[`${opposite}FurnishedDescription`];
      if (value) {
        const translated = await translate(
          value,
          target === "en" ? "ar" : "en",
          target,
        );
        if (translated) {
          state.setFurnishedDescription(target, translated);
        }
      }
    }

    for (const feature of state.extraFeatures || []) {
      if (feature[`${opposite}Title` as keyof TExtraFeature]) {
        const translated = await translate(
          feature[`${opposite}Title` as keyof TExtraFeature] as string,
          target === "en" ? "ar" : "en",
          target,
        );

        if (translated) {
          (feature[`${target}Title` as keyof TExtraFeature] as string) =
            translated;
        }
      }
    }

    state.setTranslated(true);
  }

  return { translateTo };
}
