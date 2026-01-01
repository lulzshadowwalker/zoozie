// import Card from "@/components/customer/blog/card";
// import { fetchApi } from "@/lib/api";
// import { IBasePageParams, TBlogPost } from "@/lib/types";
// import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

// export default async function Blog({ params: { locale } }: IBasePageParams) {
//   unstable_setRequestLocale(locale);
//   const t = await getTranslations("customer.blog");

//   const res = await fetchApi("posts", {
//     source: "strapi",
//     queryParams: {
//       populate: "deep",
//       locale,
//     },
//   });
//   if (!res.ok) {
//     throw new Error("failed to fetch blog posts because " + res.statusText);
//   }

//   const posts = (await res.json())?.data as TBlogPost[] | undefined;

//   return (
//     <main className="my-2xl-3xl px-page">
//       <section className="my-2xl-3xl">
//         <h1 className="text-center text-4xl font-medium">
//           {t("insights-and-tips")}
//         </h1>
//         <p className="mx-auto max-w-readable text-center text-lg">
//           {t("discover-latest-trends")}
//         </p>
//       </section>

//       <section className="grid grid-cols-[repeat(auto-fill,minmax(35rem,1fr))] justify-items-center gap-s-m">
//         {posts?.map((post, index) => <Card key={index} post={post} />)}
//       </section>
//     </main>
//   );
// }
