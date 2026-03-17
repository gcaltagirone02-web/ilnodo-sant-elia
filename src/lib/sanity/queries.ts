import { client } from "./client";

export async function getSiteSettings() {
  const query = `*[_type == "operations"][0]`;
  return await client.fetch(query);
}

export async function getCategories(lang: string = "it") {
  const query = `*[_type == "category"] | order(orderRank asc, title asc) {
    _id,
    "title": select(
      "${lang}" == "fr" => select(
        defined(titleFr) && titleFr != "" => titleFr,
        defined(titleEn) && titleEn != "" => titleEn,
        title
      ),
      "${lang}" == "en" => select(
        defined(titleEn) && titleEn != "" => titleEn,
        title
      ),
      title
    ),
    "slug": slug.current,
    "image": image.asset->url
  }`;
  return await client.fetch(query);
}

export async function getMenuItems(lang: string = "it") {
  const query = `*[_type == "menuItem"] | order(orderRank asc, name asc) {
    _id,
    "name": select(
      "${lang}" == "fr" => select(
        defined(nameFr) && nameFr != "" => nameFr,
        defined(nameEn) && nameEn != "" => nameEn,
        name
      ),
      "${lang}" == "en" => select(
        defined(nameEn) && nameEn != "" => nameEn,
        name
      ),
      name
    ),
    "nameIt": name,
    "nameEn": nameEn,
    "nameFr": nameFr,
    "price": price,
    "description": select(
      "${lang}" == "fr" => select(
        defined(descriptionFr) && descriptionFr != "" => descriptionFr,
        defined(descriptionEn) && descriptionEn != "" => descriptionEn,
        description
      ),
      "${lang}" == "en" => select(
        defined(descriptionEn) && descriptionEn != "" => descriptionEn,
        description
      ),
      description
    ),
    "descriptionEn": descriptionEn,
    "descriptionFr": descriptionFr,
    "ingredients": select(
      "${lang}" == "fr" => select(
        defined(ingredientsFr) && count(ingredientsFr) > 0 => ingredientsFr,
        defined(ingredientsEn) && count(ingredientsEn) > 0 => ingredientsEn,
        ingredients
      ),
      "${lang}" == "en" => select(
        defined(ingredientsEn) && count(ingredientsEn) > 0 => ingredientsEn,
        ingredients
      ),
      ingredients
    ),
    "ingredientsEn": ingredientsEn,
    "ingredientsFr": ingredientsFr,
    "categorySlug": category->slug.current,
    isHighlight
  }`;
  return await client.fetch(query);
}
