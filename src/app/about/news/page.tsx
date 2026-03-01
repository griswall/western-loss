import { NewsFeed } from "@/components/news-feed";
import { getNewsPosts } from "@/lib/news-source";

export default async function AboutNewsPage() {
  const posts = await getNewsPosts();
  return <NewsFeed posts={posts} />;
}
