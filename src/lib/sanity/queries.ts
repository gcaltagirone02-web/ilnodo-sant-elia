import { client } from "./client";

export async function getSiteSettings() {
  const query = `*[_type == "operations"][0]`;
  return await client.fetch(query);
}

export async function getCategories(lang: string = "it") {
  const isEn = lang === "en";
  const query = `*[_type == "category"] | order(orderRank asc, title asc) {
    _id,
    "title": select(
      ${isEn} && defined(titleEn) && titleEn != "" => titleEn,
      title
    ),
    "slug": slug.current,
    "image": image.asset->url
  }`;
  return await client.fetch(query);
}

export async function getMenuItems(lang: string = "it") {
  const isEn = lang === "en";
  const query = `*[_type == "menuItem"] | order(orderRank asc, name asc) {
    _id,
    "name": select(
      ${isEn} && defined(nameEn) && nameEn != "" => nameEn,
      name
    ),
    "nameIt": name,
    "nameEn": nameEn,
    "price": price,
    "description": select(
      ${isEn} && defined(descriptionEn) && descriptionEn != "" => descriptionEn,
      description
    ),
    "descriptionEn": descriptionEn,
    "ingredients": select(
      ${isEn} && defined(ingredientsEn) && count(ingredientsEn) > 0 => ingredientsEn,
      ingredients
    ),
    "ingredientsEn": ingredientsEn,
    "categorySlug": category->slug.current,
    isHighlight
  }`;
  return await client.fetch(query);
}
