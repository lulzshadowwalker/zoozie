import Button from "@/components/shared/secondary-button";
import ZoozImage from "@/components/shared/zooz-image";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

// TODO: might wanna refactor sections with border top and a heading
export default function Agency() {
  const t = useTranslations("agency");

  // TODO: add a view listing floating button

  return (
    <main className="my-2xl-3xl">
      <section className="max-w-page mx-auto px-page">
        <div className="flex flex-col items-stretch gap-xs-s md:flex-row md:items-center">
          <div className="flex items-center gap-xs-s my-m-l">
            <div className="md:w-[15rem] w-[10rem] aspect-square rounded-full relative overflow-hidden">
              <ZoozImage
                src="https://images.unsplash.com/photo-1709418354495-fc4e5dd6d1f3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                title=""
                fill
                sizes="(min-width: 780px) 150px, 100px"
                className="object-cover"
                priority
                quality={75}
              />
            </div>

            <div>
              <h3 className="text-xl font-light cursor-pointer">
                Railway Real-estate™
              </h3>
              <p className="text-base text-gray-500 font-light underline-offset-4 hover:underline cursor-pointer">
                5.0 (12 reviews)
              </p>
            </div>
          </div>

          <section className="md:ms-auto flex items-center gap-xs-s">
            <Button
              typ="secondary"
              className="ms-0 py-xs-s flex-grow basis-0 md:flex-grow-0 md:py-3xs-2xs"
            >
              Follow
            </Button>
            <Button className="ms-0 py-xs-s flex-grow basis-0 md:flex-grow-0 md:py-3xs-2xs">
              Message
            </Button>
          </section>
        </div>
      </section>
      <section className="max-w-page mx-auto px-page">
        <article className="mt-l-xl pt-l-xl border-t">
          <h2 className="text-xl font-medium">About Railway Real-estate™</h2>
          <p className="text-lg text-gray-500 max-w-readable mt-s-m">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est minima
            odio quod mollitia optio ipsum iusto cumque laboriosam officia fuga
            dolorum vel eos reprehenderit ab excepturi harum quisquam, unde
            porro. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Obcaecati quibusdam ducimus illum architecto doloremque numquam
            consectetur error. Cumque optio magnam quod tenetur dolore iste
            eveniet, accusantium harum, ex aperiam hic! _
          </p>
        </article>
      </section>
      <section className="max-w-page mx-auto px-page ">
        <article className="mt-l-xl pt-l-xl border-t">
          <h2 className="text-xl font-medium">Contact Information</h2>
          <ul className="flex flex-col gap-m-l mt-m-l">
            {[...Array(3)].map((_, index) => (
              <li className="flex items-center gap-s-m" key={index}>
                <FontAwesomeIcon
                  icon={faPhone}
                  className="bg-gray-200 rounded-2xl p-xs-s flex items-center justify-center"
                />
                <a
                  className="text-lg font-medium text-gray-500"
                  href="tel:12345678"
                >
                  (06) 567 8996
                </a>
              </li>
            ))}
          </ul>
        </article>
      </section>
      <section className="max-w-page mx-auto px-page ">
        <article className="mt-l-xl pt-l-xl border-t flex flex-col">
          <h2 className="text-xl font-medium">Reviews</h2>
          <ul className="flex flex-col gap-l-xl mt-m-l">
            {[...Array(3)].map((_, index) => (
              <li className="flex items-start gap-s-m" key={index}>
                <div className="h-xl-2xl w-xl-2xl rounded-3xl relative overflow-hidden">
                  <ZoozImage
                    src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    title=""
                    fill
                    sizes="(min-width: 1340px) 50px, (min-width: 620px) calc(1.71vw + 27px), calc(7.67vw - 8px)"
                    quality={65}
                  />
                </div>
                <div className="leading-[1.2rem] self-center">
                  <h3 className="text-lg text-gray-400">Customer Name</h3>
                  <p className="text-lg text-on-primary-1/80 max-w-[50ch] mt-2xs-xs">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Quisquam odit fugit nihil fugiat quam autem quae nam modi
                    amet incidunt.
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <button className="ms-auto mt-xs-s underline underline-offset-4 outline-none hover:decoration-transparent focus:decoration-transparent">
            {t("view-more")}
          </button>
        </article>
      </section>

      {/* NOTE: I don't want this button to be fluid in spacings or font size */}
      <Button className="fixed bottom-m-l end-m-l px-[2rem] py-[0.625rem] text-[1.5rem]">
        {t("view-listings")}
      </Button>
    </main>
  );
}
