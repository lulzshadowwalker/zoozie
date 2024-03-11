import Button from "@/components/shared/secondary-button";
import ZoozImage from "@/components/shared/zooz-image";
import Marquee from "react-fast-marquee";
import { faMobile, faToilet } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IBasePageParams } from "@/lib/types/types";
import { unstable_setRequestLocale } from "next-intl/server";

export const dynamic = "force-static";

export default function Listing({ params: { locale } }: IBasePageParams) {
  unstable_setRequestLocale(locale);

  const sampleImages: string[] = [
    "https://images.unsplash.com/photo-1551429340-1a7a56cde81f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1612200167908-f55e26ada541?q=80&w=2866&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1434873740857-1bc5653afda8?q=80&w=2900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <main className="my-xl-2xl">
      <section>
        <div className="min-h-[55rem] relative mx-auto max-w-page rounded-xl overflow-hidden cursor-pointer">
          <ZoozImage
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            title=""
            fill
            sizes="(min-width: 1280px) 1200px, calc(93.75vw + 19px)"
            className="object-cover transition-all duration-[800ms] ease-out hover:scale-105"
            priority
            quality={90}
          />
        </div>

        {/* NOTE: for some reason `<Marquee>` doesn't seem to load until all the children are loaded or something of sorts 
        so this wrapper div is to prevent cls */}
        <div className="md:min-h-[26rem] min-h-[16rem] mt-m-l">
          <Marquee autoFill speed={30}>
            {sampleImages.map((image, index) => (
              <div
                key={index}
                className="relative md:min-h-[26rem] min-h-[16rem] aspect-square mx-2xs-xs rounded-xl overflow-hidden cursor-pointer"
              >
                <ZoozImage
                  src={image}
                  alt=""
                  title=""
                  fill
                  // sizes="(min-width: 1180px) 260px, (min-width: 780px) calc(21.05vw + 16px), (min-width: 740px) 160px, calc(22.86vw - 5px)"
                  className="object-cover transition-all duration-[800ms] ease-out hover:scale-105"
                  quality={70}
                />
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      <section className="max-w-page mx-auto px-page flex flex-col-reverse lg:flex-row lg:gap-m-l lg:items-start">
        <section>
          <section className="mt-l-xl pt-l-xl border-t flex items-start">
            <div className="flex-grow-[2] basis-0">
              <h2 className="text-xl font-medium">What this place offers</h2>
              <ul className="flex flex-col gap-m-l mt-m-l">
                {[...Array(4)].map((_, index) => (
                  <li className="flex items-start gap-s-m" key={index}>
                    <FontAwesomeIcon
                      icon={faToilet}
                      size="lg"
                      className="border border-gray-400 bg-gray-300/5 rounded-2xl p-xs-s text-gray-400 flex items-center justify-center"
                    />
                    <div className="leading-[1.2rem] self-center">
                      <div className="text-lg font-medium">5 Toilets</div>
                      {index < 2 && (
                        <p className="text-base text-gray-400 max-w-[50ch]">
                          2 master bedrooms and 3 independant batharooms.
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <article className="mt-l-xl pt-l-xl border-t">
            <h2 className="text-xl font-medium">About this home</h2>
            <p className="text-lg text-gray-500 max-w-readable mt-s-m">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
              minima odio quod mollitia optio ipsum iusto cumque laboriosam
              officia fuga dolorum vel eos reprehenderit ab excepturi harum
              quisquam, unde porro. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Obcaecati quibusdam ducimus illum architecto
              doloremque numquam consectetur error. Cumque optio magnam quod
              tenetur dolore iste eveniet, accusantium harum, ex aperiam hic! _
            </p>
          </article>
        </section>

        <div className="flex-grow basis-0 border border-gray-400 bg-gray-300/20 rounded-2xl px-s-m py-m-l top-[3rem] mt-l-xl lg:sticky">
          <p className="text-xl mb-xs-s pb-xs-s border-b-2">
            $<strong>20, 500</strong> USD
          </p>

          <article>
            <h2 className="text-xl font-medium">Contact Information</h2>
            <ul className="flex flex-col gap-2xs-xs mt-xs-s">
              <li className="flex items-center gap-3xs-2xs">
                <FontAwesomeIcon icon={faEnvelope} />
                <a
                  href="mailto:email@example.com"
                  className="text-lg text-gray-600 font-light"
                >
                  email@example.com
                </a>
              </li>

              <li className="flex items-center gap-3xs-2xs">
                <FontAwesomeIcon icon={faMobile} />
                <a
                  href="tel:07912345678"
                  className="text-lg text-gray-600 font-light"
                >
                  079 982 0981
                </a>
              </li>
            </ul>
          </article>

          <Button className="w-full mt-xl-2xl py-xs-s lg:py-3xs-2xs">
            Message
          </Button>
        </div>
      </section>

      <section className="max-w-page mx-auto px-page ">
        <article className="mt-l-xl pt-l-xl border-t">
          <h2 className="text-xl font-medium">About this agency</h2>

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

            <Button
              typ="secondary"
              className="ms-0 py-xs-s md:py-3xs-2xs md:ms-auto"
            >
              Follow
            </Button>
          </div>

          <p className="text-lg text-gray-500 max-w-readable mt-s-m">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est minima
            odio quod mollitia optio ipsum iusto cumque laboriosam officia fuga
            dolorum vel eos reprehenderit ab excepturi harum quisquam, unde
            porro. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Obcaecati quibusdam ducimus illum architecto doloremque numquam
            consectetur error. Cumque optio magnam quod tenetur dolore iste
            eveniet, accusantium harum, ex aperiam hic!
          </p>
        </article>
      </section>
    </main>
  );
}
