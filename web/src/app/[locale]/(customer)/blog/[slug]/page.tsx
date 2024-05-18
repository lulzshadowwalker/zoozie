import Image from "next/image";

export default function BlogPost() {
  return (
    <main className="mx-auto my-2xl-3xl">
      <section className="px-page">
        <div className="mx-auto mb-s-m max-w-fit cursor-pointer rounded-full bg-gray-100 px-xs-s py-2xs-xs text-base font-medium uppercase text-on-primary-1/80 transition-all hover:bg-gray-200">
          Design
        </div>

        <h1 className="text-balnce max-w-[55ch] text-center text-4xl">
          The influence of modern architecture
        </h1>
        <p className="mx-auto max-w-[62ch] text-center text-lg font-light">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reiciendis
          iure at dolor deserunt eum sapiente asperiores modi?
        </p>

        <div className="mx-auto mt-s-m flex max-w-[40rem] flex-wrap items-center justify-center gap-l-xl">
          <div>
            <p className="text-center text-lg font-medium uppercase">Date</p>
            <time
              dateTime="2022-07-21"
              className="text-center text-lg font-light"
            >
              July 21, 2022
            </time>
          </div>

          <div>
            <p className="text-center text-lg font-medium uppercase">Read</p>
            <time
              dateTime="2022-07-21"
              className="text-center text-lg font-light"
            >
              12 Min
            </time>
          </div>
        </div>
      </section>

      <div className="relative my-xl-2xl aspect-video overflow-hidden rounded-[5rem] md:mx-page">
        <Image
          src="https://images.unsplash.com/photo-1715645943748-a7cf8a81f1ef?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          fill
          sizes="(min-width: 2020px) 1770px, (min-width: 780px) calc(90.98vw - 50px), 100vw"
          quality={90}
          priority
          className="transition-all duration-[900ms] ease-out hover:scale-105"
        />
      </div>

      <article className="mx-auto max-w-[85ch] px-page">
        <h2 className="text-2xl font-medium">Hello, lulzie.</h2>
        <p className="text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam id a
          voluptatibus vel distinctio voluptate dolore dolor adipisci molestias
          fuga. Earum magnam sit ex laborum perferendis, ea consequuntur impedit
          temporibus!
        </p>
      </article>
    </main>
  );
}
