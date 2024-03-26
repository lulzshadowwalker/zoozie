import { createContext, useContext, ReactNode, useState } from "react";
import { TCoreFeature } from "@types";

type TPrice = {
  amount: number;
  currency: "USD" | "JOD";
};

interface TCoreFeatureWithInput extends TCoreFeature {
  titleInput?: string;
  descriptionInput?: string;
}

type TExtraFeature = {
  id: number;
  title: string;
  exists: boolean;
};

type TPicture = File;

type TState = {
  price?: TPrice;
  description?: string;
  coreFeatures?: TCoreFeatureWithInput[];
  extraFeatures?: TExtraFeature[];
  pictures?: TPicture[];
};

type TActions = {
  setPrice(price: TPrice): void;
  setDescription(description: string): void;

  addCoreFeatures(...coreFeatures: TCoreFeatureWithInput[]): void;
  updateCoreFeature(coreFeature: TCoreFeatureWithInput): void;
  removeCoreFeature(coreFeatures: TCoreFeatureWithInput): void;

  addExtraFeature(): void;
  updateExtraFeature(extraFeature: TExtraFeature): void;
  removeExtraFeature(extraFeature: TExtraFeature): void;

  addPictures(...pictures: TPicture[]): void;
  removePictures(...pictures: TPicture[]): void;
};

const CreateListingContext = createContext<(TState & TActions) | null>(null);

type Props = {
  children: ReactNode;
};

export default function CreateListingProvider({ children }: Props) {
  const [state, setState] = useState<TState>({});

  function setPrice(price: TPrice) {
    setState({ ...state, price });
  }

  function setDescription(description: string) {
    setState({ ...state, description });
  }

  function addPictures(...pictures: TPicture[]) {
    setState({
      ...state,
      pictures: [...(state.pictures || []), ...pictures],
    });
  }

  function removePictures(...pictures: TPicture[]) {
    // TODO: might need an extra id field for that?
    setState({
      ...state,
      pictures: state.pictures?.filter(
        (picture) => !pictures.includes(picture),
      ),
    });
  }

  function removeCoreFeature(coreFeature: TCoreFeatureWithInput) {
    if (coreFeature.required) {
      throw new Error("Cannot remove a required core feature");
    }

    setState({
      ...state,
      coreFeatures: state.coreFeatures?.filter(
        // TODO: better add an `id` field from the api and use that instead
        (feature) => feature.name !== coreFeature.name,
      ),
    });
  }

  function updateCoreFeature(coreFeature: TCoreFeatureWithInput) {
    setState({
      ...state,
      coreFeatures: state.coreFeatures?.map((feature) =>
        feature.name === coreFeature.name ? coreFeature : feature,
      ),
    });
  }

  function addCoreFeatures(...coreFeatures: TCoreFeatureWithInput[]) {
    setState({
      ...state,
      coreFeatures: [...(state.coreFeatures || []), ...coreFeatures],
    });
  }

  function addExtraFeature() {
    const hasFeatures = !!state.extraFeatures?.length;
    const lastFeatureHasValue =
      !!state.extraFeatures?.[state.extraFeatures?.length - 1]?.title;

    if (hasFeatures && (!lastFeatureHasValue ?? true)) {
      return;
    }

    setState({
      ...state,
      extraFeatures: [
        ...(state.extraFeatures || []),
        { id: Date.now(), title: "", exists: false },
      ],
    });
  }

  function updateExtraFeature(extraFeature: TExtraFeature) {
    setState({
      ...state,
      extraFeatures: state.extraFeatures?.map((feature) =>
        feature.id === extraFeature.id ? extraFeature : feature,
      ),
    });
  }

  function removeExtraFeature(extraFeature: TExtraFeature) {
    setState({
      ...state,
      extraFeatures: state.extraFeatures?.filter(
        (feature) => feature.id !== extraFeature.id,
      ),
    });
  }

  // TODO: form validation? prolly form.reportValidity() + manual validation
  return (
    <CreateListingContext.Provider
      value={{
        ...state,
        setPrice,
        setDescription,
        addCoreFeatures,
        removeCoreFeature,
        updateCoreFeature,
        addExtraFeature,
        updateExtraFeature,
        removeExtraFeature,
        addPictures,
        removePictures,
      }}
    >
      {children}
    </CreateListingContext.Provider>
  );
}

export function useCreateListing() {
  const context = useContext(CreateListingContext);
  if (!context) {
    throw new Error(
      "useCreateListing must be used within a CreateListingProvider",
    );
  }

  return context;
}
