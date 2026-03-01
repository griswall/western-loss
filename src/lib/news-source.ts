import { legacyPages } from "@/data/legacy-pages";
import { parseNewsPosts, type NewsPost } from "@/lib/news-parser";
import { getSanityNewsPosts } from "@/lib/sanity-news";

export async function getNewsPosts(): Promise<NewsPost[]> {
  const sanityPosts = await getSanityNewsPosts();

  if (sanityPosts.length > 0) {
    return sanityPosts;
  }

  return parseNewsPosts(legacyPages.aboutNews.html);
}
