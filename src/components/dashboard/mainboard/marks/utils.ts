async function getImgUrlByName(name: string) {
  const url = `https://api.bgm.tv/search/subject/${name}?type=2`
  const encodedUrl = encodeURI(url)
  return await fetch(encodedUrl)
    .then(response => response.json())
    .then((data) => {
      if (data.results === 0) { return undefined }
      else {
        const id = data.list[0].id
        return id
      }
    })
}

export { getImgUrlByName }
