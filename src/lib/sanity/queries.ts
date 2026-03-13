import { client } from "./client";

export async function getSiteSettings() {
  const query = `*[_type == "operations"][0]`;
  return await client.fetch(query);
}

export async function getCategories() {
  const query = `*[_type == "category"] | order(orderRank asc, title asc) {
    _id,
    title,
    titleEn,
    "slug": slug.current,
    "image": image.asset->url
  }`;
  return await client.fetch(query);
}

export async function getMenuItems() {
  const query = `*[_type == "menuItem"] | order(orderRank asc, name asc) {
    _id,
    name,
    nameEn,
    price,
    description,
    descriptionEn,
    ingredients,
    ingredientsEn,
    "category": category->title,
    isHighlight
  }`;
  return await client.fetch(query);
}
