export const newsListModel = (data) => {
  return data.map((article) => {
    const { title, description, url, urlToImage } = article
    return {
      title,
      description,
      url,
      image: urlToImage
    }
  })
}
